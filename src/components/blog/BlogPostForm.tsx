import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from './RichTextEditor';
import { BlogImageUpload } from './BlogImageUpload';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface BlogPostFormProps {
  postId?: number;
  onSaved?: () => void;
}

export function BlogPostForm({ postId, onSaved }: BlogPostFormProps) {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('General');
  const [featuredImage, setFeaturedImage] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [authorName, setAuthorName] = useState('Hein Hoven');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (postId) loadPost();
  }, [postId]);

  const loadPost = async () => {
    const { data } = await supabase.from('blog_posts').select('*').eq('id', postId).single();
    if (data) {
      setTitle(data.title);
      setSlug(data.slug);
      setExcerpt(data.excerpt);
      setContent(data.content);
      setCategory(data.category);
      setFeaturedImage(data.featured_image);
      setMetaDescription(data.meta_description);
      setKeywords(data.keywords?.join(', ') || '');
      setAuthorName(data.author_name);
    }
  };

  const generateSlug = (text: string) => {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  const handleSave = async (status: 'draft' | 'published') => {
    setSaving(true);
    try {
      const postData = {
        title, slug: slug || generateSlug(title), excerpt, content, category,
        featured_image: featuredImage, meta_description: metaDescription,
        keywords: keywords.split(',').map(k => k.trim()),
        author_name: authorName, is_published: status === 'published',
        published_date: status === 'published' ? new Date().toISOString() : null
      };

      if (postId) {
        await supabase.from('blog_posts').update(postData).eq('id', postId);
      } else {
        await supabase.from('blog_posts').insert(postData);
      }
      toast.success(`Post ${status === 'published' ? 'published' : 'saved as draft'}`);
      onSaved?.();
    } catch (error) {
      toast.error('Failed to save post');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Tabs defaultValue="content" className="w-full">
      <TabsList><TabsTrigger value="content">Content</TabsTrigger><TabsTrigger value="seo">SEO</TabsTrigger></TabsList>
      <TabsContent value="content" className="space-y-4">
        <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} /></div>
        <div><Label>Slug</Label><Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={generateSlug(title)} /></div>
        <div><Label>Excerpt</Label><Textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} /></div>
        <div><Label>Category</Label><Select value={category} onValueChange={setCategory}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="General">General</SelectItem><SelectItem value="Cost Guide">Cost Guide</SelectItem><SelectItem value="Design Guide">Design Guide</SelectItem></SelectContent></Select></div>
        <div><Label>Featured Image</Label><BlogImageUpload currentImage={featuredImage} onImageUploaded={setFeaturedImage} /></div>
        <div><Label>Content</Label><RichTextEditor content={content} onChange={setContent} /></div>
      </TabsContent>
      <TabsContent value="seo" className="space-y-4">
        <div><Label>Meta Description</Label><Textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} /></div>
        <div><Label>Keywords (comma-separated)</Label><Input value={keywords} onChange={(e) => setKeywords(e.target.value)} /></div>
        <div><Label>Author</Label><Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} /></div>
      </TabsContent>
      <div className="flex gap-2 mt-4">
        <Button onClick={() => handleSave('draft')} disabled={saving}>Save Draft</Button>
        <Button onClick={() => handleSave('published')} disabled={saving}>Publish</Button>
      </div>
    </Tabs>
  );
}
