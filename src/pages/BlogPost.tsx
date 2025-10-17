import { useParams, Link, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { BlogSEO } from '@/components/BlogSEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Calendar, Clock, ArrowLeft, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { enhancedBlogPosts } from '@/data/blogPostsKeywords';
import { getRelatedArticles } from '@/utils/relatedArticles';
import { analytics } from '@/lib/analytics';


// Simple markdown-style content renderer
const renderContent = (content: string) => {
  const lines = content.split('\n');
  const elements: JSX.Element[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.startsWith('## ')) {
      elements.push(<h2 key={key++} className="text-3xl font-bold mt-8 mb-4">{line.slice(3)}</h2>);
    } else if (line.startsWith('### ')) {
      elements.push(<h3 key={key++} className="text-2xl font-bold mt-6 mb-3">{line.slice(4)}</h3>);
    } else if (line.startsWith('**') && line.endsWith('**')) {
      elements.push(<p key={key++} className="font-bold mb-3 mt-4">{line.slice(2, -2)}</p>);
    } else if (line.startsWith('- ')) {
      elements.push(<li key={key++} className="ml-6 mb-2">{line.slice(2)}</li>);
    } else if (line.trim() === '') {
      elements.push(<div key={key++} className="h-2"></div>);
    } else if (line.includes('[') && line.includes('](')) {
      const match = line.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (match) {
        const [, text, url] = match;
        const before = line.slice(0, line.indexOf('['));
        const after = line.slice(line.indexOf(')') + 1);
        elements.push(
          <p key={key++} className="mb-4">
            {before}
            <Link to={url} className="text-primary hover:underline">{text}</Link>
            {after}
          </p>
        );
      } else {
        elements.push(<p key={key++} className="mb-4">{line}</p>);
      }
    } else if (line.trim().length > 0) {
      elements.push(<p key={key++} className="mb-4">{line}</p>);
    }
  }
  
  return elements;
};

export default function BlogPost() {
  const { slug } = useParams();
  const post = enhancedBlogPosts.find(p => p.slug === slug);

  useEffect(() => {
    if (post) {
      analytics.trackBlogPostView(post.slug, post.title, post.category);
    }
  }, [post]);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const relatedArticles = getRelatedArticles(post, enhancedBlogPosts, 4);
  const handleRelatedArticleClick = (toSlug: string, position: number) => {
    analytics.trackRelatedArticleClick(post.slug, toSlug, position);
  };

  const currentUrl = `https://heinhoven.com/blog/${post.slug}`;

  return (
    <div className="min-h-screen bg-background">
      <BlogSEO post={post} url={currentUrl} />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Breadcrumbs />
        <Link to="/blog">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Button>
        </Link>
        
        <article>
          <div className="mb-4">
            <span className="text-sm font-semibold text-primary">{post.category}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8">
            <span className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              {new Date(post.date).toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              {post.readTime} read
            </span>
            <span className="flex items-center gap-2">
              <User className="h-4 w-4" />
              {post.author.name}
            </span>
          </div>
          
          <img 
            src={post.image} 
            alt={post.title}
            className="w-full rounded-lg mb-8 shadow-lg"
          />
          
          <div className="prose prose-lg max-w-none">
            {renderContent(post.content)}
          </div>

          <Card className="mt-12 bg-muted">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <img 
                  src={post.author.image} 
                  alt={post.author.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-xl font-bold mb-1">{post.author.name}</h3>
                  <p className="text-sm text-muted-foreground mb-2">{post.author.credentials}</p>
                  <p className="text-sm">{post.author.bio}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12 p-6 bg-primary/5 rounded-lg border-l-4 border-primary">
            <h3 className="text-xl font-bold mb-3">Ready to Start Your Project?</h3>
            <p className="mb-4">Get expert guidance and a detailed estimate for your renovation project.</p>
            <Button asChild>
              <Link to="/consultations">Schedule Free Consultation</Link>
            </Button>
          </div>

          {/* Related Articles Section */}
          {relatedArticles.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {relatedArticles.map((article, index) => (
                  <Link
                    key={article.id}
                    to={`/blog/${article.slug}`}
                    onClick={() => handleRelatedArticleClick(article.slug, index + 1)}
                    className="group"
                  >
                    <Card className="h-full transition-all hover:shadow-lg hover:-translate-y-1">
                      <CardContent className="p-0">
                        <img
                          src={article.image}
                          alt={article.title}
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                        <div className="p-6">
                          <span className="text-xs font-semibold text-primary uppercase tracking-wide">
                            {article.category}
                          </span>
                          <h3 className="text-xl font-bold mt-2 mb-3 group-hover:text-primary transition-colors">
                            {article.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                            {article.excerpt}
                          </p>
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {article.readTime}
                            </span>
                            <span className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                              Read More <ArrowRight className="h-4 w-4" />
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}