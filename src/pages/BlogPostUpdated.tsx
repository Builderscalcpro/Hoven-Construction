import { useParams, Link, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { BlogSEO } from '@/components/BlogSEO';
import BlogNewsletter from '@/components/BlogNewsletter';
import { Calendar, Clock, ArrowLeft, User, ArrowRight, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { enhancedBlogPosts } from '@/data/blogPostsKeywords';
import { getRelatedArticles } from '@/utils/relatedArticles';
import { analytics } from '@/lib/analytics';

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
    } else if (line.trim().length > 0) {
      elements.push(<p key={key++} className="mb-4">{line}</p>);
    }
  }
  
  return elements;
};

export default function BlogPostUpdated() {
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

  const relatedArticles = getRelatedArticles(post, enhancedBlogPosts, 3);

  return (
    <div className="min-h-screen bg-background">
      <BlogSEO post={post} url={`https://heinhoven.com/blog/${post.slug}`} />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link to="/blog">
          <Button variant="ghost" className="mb-6 hover:bg-amber-50">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Button>
        </Link>
        
        <article>
          <div className="mb-4">
            <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-amber-600 rounded-full">
              {post.category}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">{post.title}</h1>
          
          <div className="flex flex-wrap items-center gap-6 text-muted-foreground mb-8 pb-8 border-b">
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
            className="w-full rounded-xl mb-8 shadow-2xl"
          />
          
          <div className="prose prose-lg max-w-none">
            {renderContent(post.content)}
          </div>

          <Card className="mt-12 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-100">
            <CardContent className="p-8">
              <div className="flex gap-6">
                <img 
                  src={post.author.image} 
                  alt={post.author.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
                <div>
                  <h3 className="text-2xl font-bold mb-1">{post.author.name}</h3>
                  <p className="text-sm text-amber-700 font-medium mb-3">{post.author.credentials}</p>
                  <p className="text-gray-700">{post.author.bio}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-12 p-8 bg-gradient-to-br from-amber-600 to-orange-600 text-white rounded-xl shadow-xl">
            <h3 className="text-2xl font-bold mb-3">Ready to Start Your Project?</h3>
            <p className="mb-6 text-white/90">Get expert guidance and a detailed estimate for your renovation project.</p>
            <Button asChild className="bg-white text-amber-600 hover:bg-gray-100">
              <Link to="/book-consultation">Schedule Free Consultation</Link>
            </Button>
          </div>

          {relatedArticles.length > 0 && (
            <div className="mt-16">
              <h2 className="text-3xl font-bold mb-8">Continue Reading</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {relatedArticles.map((article) => (
                  <Link key={article.id} to={`/blog/${article.slug}`} className="group">
                    <Card className="h-full hover:shadow-xl transition-all hover:-translate-y-1">
                      <CardContent className="p-0">
                        <img src={article.image} alt={article.title} className="w-full h-40 object-cover rounded-t-lg" />
                        <div className="p-4">
                          <h3 className="font-bold mb-2 group-hover:text-amber-600 transition-colors line-clamp-2">
                            {article.title}
                          </h3>
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {article.readTime}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          <div className="mt-16">
            <BlogNewsletter />
          </div>
        </article>
      </div>
    </div>
  );
}
