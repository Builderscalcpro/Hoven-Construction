import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { generateSitemap, generateBlogSitemap, generateSitemapIndex, APP_ROUTES } from '@/lib/sitemapGenerator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { RefreshCw, Download, Upload, FileText, BookOpen } from 'lucide-react';

interface SitemapConfig {
  id: string;
  url: string;
  priority: number;
  changefreq: string;
  excluded: boolean;
  page_type: string;
}

interface BlogConfig {
  priority: number;
  changefreq: string;
  includeImages: boolean;
  enabled: boolean;
}

export function SitemapManager() {
  const [configs, setConfigs] = useState<SitemapConfig[]>([]);
  const [blogConfig, setBlogConfig] = useState<BlogConfig>({
    priority: 0.65,
    changefreq: 'daily',
    includeImages: true,
    enabled: true
  });
  const [blogPostCount, setBlogPostCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const baseUrl = window.location.origin;

  useEffect(() => {
    loadConfigs();
    loadBlogConfig();
    loadBlogPostCount();
  }, []);

  async function loadConfigs() {
    setLoading(true);
    const { data, error } = await supabase
      .from('sitemap_config')
      .select('*')
      .order('url');

    if (!error) {
      setConfigs(data || []);
    }
    setLoading(false);
  }

  async function loadBlogConfig() {
    const { data } = await supabase
      .from('sitemap_config')
      .select('*')
      .eq('page_type', 'blog')
      .single();

    if (data) {
      setBlogConfig({
        priority: data.priority || 0.65,
        changefreq: data.changefreq || 'daily',
        includeImages: data.metadata?.includeImages ?? true,
        enabled: !data.excluded
      });
    }
  }

  async function loadBlogPostCount() {
    const { count } = await supabase
      .from('blog_posts')
      .select('*', { count: 'exact', head: true })
      .eq('is_published', true);
    setBlogPostCount(count || 0);
  }

  async function initializeRoutes() {
    const promises = APP_ROUTES.map(route => {
      const url = `${baseUrl}${route.path}`;
      return supabase.from('sitemap_config').upsert({
        url,
        priority: route.priority,
        changefreq: route.changefreq,
        page_type: route.pageType,
        excluded: false
      }, { onConflict: 'url' });
    });

    await Promise.all(promises);
    await loadConfigs();
    toast.success('Routes initialized');
  }

  async function generateAndDownload(type: 'main' | 'blog' | 'index') {
    setGenerating(true);
    try {
      let xml: string;
      let filename: string;

      if (type === 'main') {
        xml = await generateSitemap(baseUrl);
        filename = 'sitemap.xml';
      } else if (type === 'blog') {
        xml = await generateBlogSitemap(baseUrl);
        filename = 'sitemap-blog.xml';
      } else {
        xml = await generateSitemapIndex(baseUrl);
        filename = 'sitemap-index.xml';
      }

      const blob = new Blob([xml], { type: 'application/xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      toast.success(`${filename} generated and downloaded`);
    } catch (error) {
      toast.error('Failed to generate sitemap');
    }
    setGenerating(false);
  }

  async function submitToSearchEngine(engine: 'google' | 'bing') {
    setSubmitting(engine);
    try {
      const sitemapUrl = `${baseUrl}/sitemap.xml`;
      const { data, error } = await supabase.functions.invoke(
        `submit-sitemap-${engine}`,
        { body: { sitemapUrl, siteUrl: baseUrl } }
      );

      if (error) throw error;

      await supabase.from('sitemap_submissions').insert({
        search_engine: engine,
        status: data.success ? 'success' : 'failed',
        response_data: data
      });

      toast.success(`Sitemap submitted to ${engine === 'google' ? 'Google' : 'Bing'}`);
    } catch (error) {
      toast.error(`Failed to submit to ${engine}`);
    }
    setSubmitting(null);
  }

  async function updateConfig(id: string, field: string, value: any) {
    await supabase.from('sitemap_config').update({ [field]: value }).eq('id', id);
    await loadConfigs();
  }

  async function saveBlogConfig() {
    await supabase.from('sitemap_config').upsert({
      url: `${baseUrl}/blog`,
      priority: blogConfig.priority,
      changefreq: blogConfig.changefreq,
      page_type: 'blog',
      excluded: !blogConfig.enabled,
      metadata: { includeImages: blogConfig.includeImages }
    }, { onConflict: 'url' });
    toast.success('Blog sitemap settings saved');
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sitemap Manager</CardTitle>
        <CardDescription>Generate and manage sitemaps with blog integration</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="blog">Blog Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <Button onClick={initializeRoutes} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                Initialize Routes
              </Button>
              <Button onClick={() => generateAndDownload('main')} disabled={generating}>
                <Download className="w-4 h-4 mr-2" />
                Main Sitemap
              </Button>
              <Button onClick={() => generateAndDownload('blog')} disabled={generating}>
                <BookOpen className="w-4 h-4 mr-2" />
                Blog Sitemap
              </Button>
              <Button onClick={() => generateAndDownload('index')} disabled={generating}>
                <FileText className="w-4 h-4 mr-2" />
                Sitemap Index
              </Button>
              <Button 
                onClick={() => submitToSearchEngine('google')}
                disabled={submitting === 'google'}
              >
                <Upload className="w-4 h-4 mr-2" />
                Submit to Google
              </Button>
              <Button 
                onClick={() => submitToSearchEngine('bing')}
                disabled={submitting === 'bing'}
              >
                <Upload className="w-4 h-4 mr-2" />
                Submit to Bing
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>URL</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Change Freq</TableHead>
                  <TableHead>Excluded</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {configs.map(config => (
                  <TableRow key={config.id}>
                    <TableCell className="font-mono text-sm">{config.url}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        value={config.priority}
                        onChange={(e) => updateConfig(config.id, 'priority', parseFloat(e.target.value))}
                        className="w-20"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={config.changefreq}
                        onValueChange={(v) => updateConfig(config.id, 'changefreq', v)}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="always">Always</SelectItem>
                          <SelectItem value="hourly">Hourly</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                          <SelectItem value="yearly">Yearly</SelectItem>
                          <SelectItem value="never">Never</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={config.excluded}
                        onCheckedChange={(v) => updateConfig(config.id, 'excluded', v)}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TabsContent>

          <TabsContent value="blog" className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-900">
                <strong>{blogPostCount} published blog posts</strong> will be included in the blog sitemap
              </p>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="blog-enabled">Enable Blog Sitemap</Label>
                <Switch
                  id="blog-enabled"
                  checked={blogConfig.enabled}
                  onCheckedChange={(v) => setBlogConfig({...blogConfig, enabled: v})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blog-priority">Default Priority (0.6-0.7 recommended)</Label>
                <Input
                  id="blog-priority"
                  type="number"
                  step="0.05"
                  min="0"
                  max="1"
                  value={blogConfig.priority}
                  onChange={(e) => setBlogConfig({...blogConfig, priority: parseFloat(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="blog-changefreq">Change Frequency</Label>
                <Select
                  value={blogConfig.changefreq}
                  onValueChange={(v) => setBlogConfig({...blogConfig, changefreq: v})}
                >
                  <SelectTrigger id="blog-changefreq">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="always">Always</SelectItem>
                    <SelectItem value="hourly">Hourly</SelectItem>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="blog-images">Include Featured Images</Label>
                <Switch
                  id="blog-images"
                  checked={blogConfig.includeImages}
                  onCheckedChange={(v) => setBlogConfig({...blogConfig, includeImages: v})}
                />
              </div>

              <Button onClick={saveBlogConfig}>Save Blog Settings</Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
