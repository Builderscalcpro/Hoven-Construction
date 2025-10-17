// src/components/AIChatbot.tsx
import { useEffect, useRef, useState } from "react";
import { Bot, Send, X, Minimize2, Maximize2, Sparkles, Phone, Calendar } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import LeadCaptureForm from "./LeadCaptureForm";
import AppointmentBookingForm from "./AppointmentBookingForm";

type Role = "user" | "assistant";

interface Message {
  role: Role;
  content: string;
  timestamp: string;
}

const QUICK_REPLIES = [
  "What services do you offer?",
  "How much does a kitchen remodel cost?",
  "Schedule a consultation",
  "What's your timeline?"
];

export default function AIChatbot() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [showQuickReplies, setShowQuickReplies] = useState(true);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI assistant. I can help with:\n\n✓ Service information\n✓ Pricing estimates\n✓ Scheduling consultations\n✓ Project timelines\n\nWhat would you like to know?",
      timestamp: new Date().toISOString(),
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Auto-open after 48 seconds (delayed by 30 seconds)
  useEffect(() => {
    if (!hasAutoOpened) {
      const notificationTimer = setTimeout(() => {
        setShowNotification(true);
      }, 45000); // 45 seconds before showing notification

      const openTimer = setTimeout(() => {
        setIsOpen(true);
        setHasAutoOpened(true);
        setShowNotification(false);
        const welcomeMsg: Message = {
          role: "assistant",
          content: "👋 Welcome! I noticed you're checking out our services. How can I help you today?",
          timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, welcomeMsg]);
      }, 48000); // 48 seconds before auto-opening


      return () => {
        clearTimeout(notificationTimer);
        clearTimeout(openTimer);
      };
    }
  }, [hasAutoOpened]);

  async function sendMessage(text?: string) {
    const messageText = text || input.trim();
    if (!messageText || isLoading) return;

    const userMsg: Message = {
      role: "user",
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);
    setShowQuickReplies(false);

    // Check for appointment/consultation keywords
    const appointmentTriggers = ['appointment', 'consultation', 'schedule', 'book', 'meeting', 'visit', 'available', 'availability'];
    const isAppointmentRequest = appointmentTriggers.some(trigger => messageText.toLowerCase().includes(trigger));

    // Check for pricing/service keywords to trigger lead form
    const leadTriggers = ['price', 'cost', 'quote', 'estimate', 'how much', 'budget', 'payment'];
    const shouldShowLeadForm = leadTriggers.some(trigger => messageText.toLowerCase().includes(trigger));

    // Handle appointment requests with inline form
    if (isAppointmentRequest) {
      const appointmentMsg: Message = {
        role: "assistant",
        content: "I'd be happy to help you schedule a consultation! You can book directly here in the chat, or I can take you to our full booking page.\n\n📅 Would you like to:\n1. Book right here in the chat (quick & easy)\n2. Visit our full booking page with calendar view",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, appointmentMsg]);
      setIsLoading(false);
      
      // Show inline appointment form after a short delay
      setTimeout(() => {
        setShowAppointmentForm(true);
      }, 1500);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("ai-chatbot", {
        body: {
          message: messageText,
          conversationHistory: messages.map(({ role, content }) => ({ role, content }))
        },
      });

      if (error) throw new Error(error.message || "Failed to get response");

      const assistantText: string =
        (data && (data.message || data.answer)) ||
        "I couldn't generate a response. Please try again.";

      const botMsg: Message = {
        role: "assistant",
        content: assistantText,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);

      // Show lead form after AI response if pricing question detected
      // INCREASED DELAY TO 10 SECONDS
      if (shouldShowLeadForm && messages.length >= 2) {
        setTimeout(() => {
          const leadOfferMsg: Message = {
            role: "assistant",
            content: "💡 I can send you a detailed, personalized quote via email! Would you like me to prepare one for you?",
            timestamp: new Date().toISOString(),
          };
          setMessages((prev) => [...prev, leadOfferMsg]);
          // Additional 5 seconds before showing the form
          setTimeout(() => setShowLeadForm(true), 5000);
        }, 10000); // 10 SECOND DELAY BEFORE SHOWING FOLLOW-UP
      }
    } catch (err: any) {
      const botMsg: Message = {
        role: "assistant",
        content: "I'm having trouble connecting. Please call us at (310) 853-2131 or try again.",
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-4 md:bottom-32 md:right-6 z-50">
        {showNotification && (
          <div className="absolute bottom-20 right-0 bg-white shadow-2xl rounded-xl p-3 mb-2 animate-bounce max-w-[200px] md:max-w-xs border-2 border-amber-500">
            <p className="text-xs md:text-sm font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-amber-500 animate-spin" />
              Need help? Chat with our AI!
            </p>
            <p className="text-[10px] md:text-xs text-gray-600 mt-1">Get instant answers 24/7</p>
          </div>
        )}
        <button
          onClick={() => {
            setIsOpen(true);
            setShowNotification(false);
          }}
          className="relative rounded-full h-14 w-14 md:h-16 md:w-16 shadow-2xl bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center hover:scale-110 transition-all duration-300 group animate-chatbot-pulse"
          aria-label="Open AI Assistant"
        >
          <Bot className="h-7 w-7 md:h-8 md:w-8 relative z-10 group-hover:rotate-12 transition-transform" />
          <span className="absolute -top-1 -right-1 h-5 w-5 md:h-6 md:w-6 bg-green-500 rounded-full flex items-center justify-center text-[9px] md:text-[10px] font-bold border-2 border-white">
            AI
          </span>
        </button>
      </div>
    );
  }
  return (
    <div
      className={`fixed inset-x-4 bottom-4 md:bottom-32 md:right-6 md:left-auto z-50 shadow-2xl transition-all bg-white border-2 border-amber-500 rounded-2xl overflow-hidden ${
        isMinimized ? "h-14" : "h-[calc(100vh-2rem)] md:h-[550px] md:max-h-[75vh]"
      } w-auto md:w-96`}
      role="dialog"
    >
      <div className="flex items-center justify-between p-2 md:p-3 bg-gradient-to-r from-amber-500 via-amber-600 to-orange-500 text-white">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Bot className="h-5 w-5 md:h-6 md:w-6 animate-pulse" />
            <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 md:h-3 md:w-3 bg-green-400 rounded-full border-2 border-white"></span>
          </div>
          <div>
            <span className="font-bold text-xs md:text-sm">AI Assistant</span>
            <p className="text-[9px] md:text-[10px] opacity-90">Online • Instant replies</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            className="p-1.5 md:p-2 hover:bg-white/20 rounded-md transition"
            onClick={() => setIsMinimized(!isMinimized)}
            aria-label={isMinimized ? "Maximize" : "Minimize"}
          >
            {isMinimized ? <Maximize2 className="h-3.5 w-3.5 md:h-4 md:w-4" /> : <Minimize2 className="h-3.5 w-3.5 md:h-4 md:w-4" />}
          </button>
          <button
            className="p-1.5 md:p-2 hover:bg-white/20 rounded-md transition"
            onClick={() => setIsOpen(false)}
            aria-label="Close chat"
          >
            <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </button>
        </div>
      </div>

      {!isMinimized && !showLeadForm && !showAppointmentForm && (
        <>
          <div ref={scrollRef} className="p-3 md:p-4 h-[calc(100vh-16rem)] md:h-[380px] overflow-y-auto space-y-3 bg-gradient-to-b from-gray-50 to-white">

            {messages.map((m, i) => {
              const mine = m.role === "user";
              return (
                <div key={i} className={`flex ${mine ? "justify-end" : "justify-start"} animate-slideUp`}>
                  <div
                    className={`max-w-[85%] rounded-2xl p-3 text-sm shadow-md ${
                      mine ? "bg-gradient-to-br from-amber-500 to-amber-600 text-white" : "bg-white border-2 border-gray-100"
                    }`}
                  >
                    <p className="whitespace-pre-wrap leading-relaxed">{m.content}</p>
                    <p className="text-[10px] opacity-70 mt-1">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="flex justify-start animate-slideUp">
                <div className="bg-white border-2 border-gray-100 rounded-2xl p-3 shadow-md">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                      <span className="h-2 w-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                      <span className="h-2 w-2 bg-amber-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                    </div>
                    <span className="text-xs text-gray-500">AI is typing...</span>
                  </div>
                </div>
              </div>
            )}
            
            {showQuickReplies && messages.length <= 2 && (
              <div className="space-y-2 pt-2">
                <p className="text-xs text-gray-500 font-semibold">Quick questions:</p>
                {QUICK_REPLIES.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendMessage(reply)}
                    className="block w-full text-left px-4 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-lg text-sm font-medium transition border border-amber-200"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-t-2 border-amber-100 bg-white">
            <div className="flex gap-2 p-2 border-b border-gray-100">
              <button
                onClick={() => window.location.href = 'tel:+13108532131'}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-xs font-semibold transition"
              >
                <Phone className="h-3 w-3" />
                Call Now
              </button>
              <button
                onClick={() => navigate('/book-consultation')}
                className="flex-1 flex items-center justify-center gap-1 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition"
              >
                <Calendar className="h-3 w-3" />
                Book Free Consult
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="p-3 flex gap-2"
            >
              <input
                className="flex-1 border-2 border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-amber-500 transition"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <button
                type="submit"
                className="h-10 w-10 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white grid place-items-center disabled:opacity-60 hover:scale-105 transition-transform shadow-md"
                disabled={isLoading}
                aria-label="Send"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </>
      )}

      {!isMinimized && showLeadForm && (
        <LeadCaptureForm
          conversationHistory={messages.map(({ role, content }) => ({ role, content }))}
          onSuccess={() => {
            setShowLeadForm(false);
            const successMsg: Message = {
              role: "assistant",
              content: "✅ Perfect! I've received your information. You'll receive a detailed quote via email within 24 hours. Looking forward to working with you!",
              timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, successMsg]);
          }}
          onCancel={() => setShowLeadForm(false)}
        />
      )}

      {!isMinimized && showAppointmentForm && (
        <AppointmentBookingForm
          onSuccess={() => {
            setShowAppointmentForm(false);
            const successMsg: Message = {
              role: "assistant",
              content: "🎉 Excellent! Your consultation is booked! We've sent a confirmation email with all the details. Looking forward to meeting with you!",
              timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, successMsg]);
          }}
          onCancel={() => {
            setShowAppointmentForm(false);
            const cancelMsg: Message = {
              role: "assistant",
              content: "No problem! If you'd like to schedule later, just let me know or click the 'Book Free Consult' button below. How else can I help you today?",
              timestamp: new Date().toISOString(),
            };
            setMessages((prev) => [...prev, cancelMsg]);
          }}
        />
      )}
    </div>
  );
}