// supabase/functions/ai-chatbot/index.ts
// Supabase Edge Function with Anthropic Prompt Caching & Knowledge Base
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

type ChatRole = "user" | "assistant";
type HistoryItem = { role: ChatRole; content: string };
type ReqBody = {
  message?: string;
  conversationHistory?: HistoryItem[];
  system?: string;
  temperature?: number;
  maxTokens?: number;
  model?: string;
  useKnowledgeBase?: boolean;
};

// ----------------------- C O R S -----------------------
const ALLOWED_ORIGINS = (Deno.env.get("ALLOWED_ORIGINS") ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

function isAllowed(origin: string | null) {
  if (!origin) return false;
  if (ALLOWED_ORIGINS.length === 0) return true; // no secret set → allow all
  if (ALLOWED_ORIGINS.includes("*")) return true;
  if (ALLOWED_ORIGINS.includes(origin)) return true;
  
  // wildcard support for rotating DeployPad previews: *.deploypad.app
  try {
    const u = new URL(origin);
    const host = u.host.toLowerCase();
    if (host.endsWith(".deploypad.app")) return true;
  } catch {
    /* ignore */
  }
  return false;
}

function corsHeaders(origin: string | null) {
  const allow = isAllowed(origin) ? (origin ?? "*") : (ALLOWED_ORIGINS[0] ?? "*");
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    "Vary": "Origin",
  };
}

// --------------------- D e f a u l t s ---------------------
const DEFAULT_MODEL = Deno.env.get("ANTHROPIC_MODEL") || "claude-3-5-sonnet-20241022";
const DEFAULT_MAX_TOKENS = Number(Deno.env.get("ANTHROPIC_MAX_TOKENS") || 1024);
const DEFAULT_TEMPERATURE = Number(Deno.env.get("ANTHROPIC_TEMPERATURE") || 0.7);
const TIMEOUT_MS = Number(Deno.env.get("EDGE_TIMEOUT_MS") || 30_000);

console.log("🚀 AI Chatbot with Caching v3.0 Started");

// ----------------------- H a n d l e r -----------------------
serve(async (req) => {
  const origin = req.headers.get("origin");
  const baseHeaders = { ...corsHeaders(origin), "Content-Type": "application/json" };

  // Preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders(origin) });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: baseHeaders,
    });
  }

  try {
    const {
      message,
      conversationHistory = [],
      system,
      temperature,
      maxTokens,
      model,
      useKnowledgeBase = true,
    } = (await req.json()) as ReqBody;

    if (!message || typeof message !== "string") {
      return new Response(JSON.stringify({ error: "Message is required (string)" }), {
        status: 400,
        headers: baseHeaders,
      });
    }

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      console.error("❌ ANTHROPIC_API_KEY not configured");
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 401,
        headers: baseHeaders,
      });
    }

    // Build knowledge base context
    let knowledgeBaseContext = system || "";
    
    // Load knowledge base from Supabase if not provided
    if (!system && useKnowledgeBase) {
      try {
        const supabaseUrl = Deno.env.get('SUPABASE_URL');
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
        
        if (supabaseUrl && supabaseServiceKey) {
          const supabase = createClient(supabaseUrl, supabaseServiceKey);
          
          const { data: knowledgeBase, error } = await supabase
            .from('chatbot_knowledge_base')
            .select('category, question, answer, keywords')
            .eq('is_active', true)
            .order('priority', { ascending: false });

          if (!error && knowledgeBase && knowledgeBase.length > 0) {
            knowledgeBaseContext = "You are a helpful assistant for Hoven Construction, ";
            knowledgeBaseContext += "a professional contracting company specializing in ";
            knowledgeBaseContext += "kitchen remodeling, bathroom renovation, and home additions.\n\n";
            knowledgeBaseContext += "KNOWLEDGE BASE:\n\n";
            
            knowledgeBase.forEach(item => {
              knowledgeBaseContext += `Category: ${item.category}\n`;
              knowledgeBaseContext += `Question: ${item.question}\n`;
              knowledgeBaseContext += `Answer: ${item.answer}\n`;
              if (item.keywords) {
                knowledgeBaseContext += `Keywords: ${item.keywords}\n`;
              }
              knowledgeBaseContext += "---\n";
            });
            
            knowledgeBaseContext += "\nINSTRUCTIONS:\n";
            knowledgeBaseContext += "- Use the knowledge base above to answer questions accurately\n";
            knowledgeBaseContext += "- Be professional, helpful, and concise\n";
            knowledgeBaseContext += "- If unsure about specific details, suggest contacting Hoven Construction directly\n";
            knowledgeBaseContext += "- Focus on the company's expertise in kitchen, bathroom, and home additions\n";
            
            console.log(`✅ Loaded ${knowledgeBase.length} knowledge base entries`);
          } else {
            console.log("⚠️ No active knowledge base entries found");
          }
        }
      } catch (err) {
        console.error("❌ Failed to load knowledge base:", err);
      }
    }

    // Default context if none provided
    if (!knowledgeBaseContext) {
      knowledgeBaseContext = "You are a helpful assistant for Hoven Construction. ";
      knowledgeBaseContext += "We are professional contractors specializing in kitchen remodeling, ";
      knowledgeBaseContext += "bathroom renovation, and home additions. Be professional and helpful.";
    }

    // Sanitize & clip history
    const clippedHistory = Array.isArray(conversationHistory)
      ? conversationHistory
          .filter(
            (m): m is HistoryItem =>
              !!m &&
              (m.role === "user" || m.role === "assistant") &&
              typeof m.content === "string"
          )
          .slice(-20)
      : [];

    // Build messages array
    const messages = [...clippedHistory, { role: "user" as const, content: message }];

    // Build Anthropic payload WITH CACHING SUPPORT
    const payload: any = {
      model: model || DEFAULT_MODEL,
      max_tokens: Number.isFinite(maxTokens) ? Number(maxTokens) : DEFAULT_MAX_TOKENS,
      temperature: Number.isFinite(temperature) ? Number(temperature) : DEFAULT_TEMPERATURE,
      messages: messages,
    };

    // ADD SYSTEM MESSAGE WITH CACHING - THIS SAVES MONEY! 💰
    if (knowledgeBaseContext) {
      payload.system = [
        {
          type: "text",
          text: knowledgeBaseContext,
          cache_control: { type: "ephemeral" }  // ENABLE CACHING HERE!
        }
      ];
    }

    // Timeout safety
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    let upstream: Response;
    try {
      console.log("📤 Calling Anthropic with caching enabled...");
      upstream = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,
          "anthropic-version": "2023-06-01",
          "anthropic-beta": "prompt-caching-2024-07-31",  // ENABLE CACHING FEATURE!
          "content-type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timer);
    }

    if (!upstream.ok) {
      const details = await upstream.text().catch(() => "");
      console.error(`❌ Anthropic error ${upstream.status}:`, details);
      
      if (upstream.status === 401) {
        return new Response(JSON.stringify({ error: "Invalid API key" }), {
          status: 401,
          headers: baseHeaders,
        });
      }
      
      if (upstream.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Try again later." }), {
          status: 429,
          headers: baseHeaders,
        });
      }
      
      return new Response(
        JSON.stringify({ error: `Upstream error ${upstream.status}`, details }),
        { status: 502, headers: baseHeaders }
      );
    }

    const data = (await upstream.json().catch(() => ({}))) as any;
    const aiMessage = data?.content?.[0]?.text ?? data?.content?.text ?? "No response generated";

    // LOG CACHE SAVINGS - THIS SHOWS YOU THE MONEY SAVED! 💰
    if (data?.usage) {
      const cacheCreation = data.usage.cache_creation_input_tokens || 0;
      const cacheRead = data.usage.cache_read_input_tokens || 0;
      const totalInput = data.usage.input_tokens || 0;
      const totalOutput = data.usage.output_tokens || 0;
      
      if (cacheCreation > 0 || cacheRead > 0) {
        const savingsPercent = cacheRead > 0 
          ? Math.round((cacheRead / totalInput) * 90) 
          : 0;
        
        // Calculate money saved (90% discount on cached tokens)
        const inputCost = 0.003;  // $3 per million tokens for input
        const moneySaved = (cacheRead * inputCost * 0.9) / 1_000_000;
        
        console.log("💰 ============ CACHE SAVINGS REPORT ============ 💰");
        console.log("📊 Token Usage:", {
          input_tokens: totalInput,
          output_tokens: totalOutput,
          cache_creation_tokens: cacheCreation,
          cache_read_tokens: cacheRead,
        });
        console.log("💵 Financial Impact:", {
          savings_percentage: savingsPercent + "%",
          money_saved_this_request: "$" + moneySaved.toFixed(5),
          status: cacheRead > 0 ? "✅ SAVING MONEY!" : "📝 Building cache...",
        });
        console.log("💰 =========================================== 💰");
        
        // If saving money, celebrate!
        if (cacheRead > 0) {
          console.log("🎉 Cache hit! You just saved " + savingsPercent + "% on this request!");
        }
      } else {
        console.log("ℹ️ No caching used - make sure knowledge base is loaded");
      }
    }

    return new Response(
      JSON.stringify({ 
        message: aiMessage,
        cached: data?.usage?.cache_read_input_tokens > 0,
      }), 
      { status: 200, headers: baseHeaders }
    );

  } catch (err: any) {
    if (err?.name === "AbortError") {
      return new Response(JSON.stringify({ error: "Request timeout. Please try again." }), {
        status: 408,
        headers: baseHeaders,
      });
    }
    
    console.error("❌ Error:", err);
    return new Response(JSON.stringify({ error: err?.message || "Internal server error" }), {
      status: 500,
      headers: baseHeaders,
    });
  }
});