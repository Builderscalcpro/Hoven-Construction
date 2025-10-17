import { useState, useMemo } from 'react';
import { SEO } from '@/components/SEO';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight, Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { blogPosts } from '@/data/blogPosts';

const additionalPosts = [
  {
    id: 11,
    title: 'How Do I Make My Home Smart During Renovation?',
    excerpt: 'Essential smart home technologies to integrate during your renovation for convenience and efficiency.',
    content: '',
    date: '2025-09-11',
    readTime: '8 min',
    category: 'Technology',
    slug: 'smart-home-renovation-guide',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759450164957_d3242a36.webp'
  },
  {
    id: 12,
    title: 'When Should I Replace My Roof?',
    excerpt: 'Signs your roof needs replacement, material options, and what to expect during a roofing project.',
    content: '',
    date: '2025-09-09',
    readTime: '6 min',
    category: 'Maintenance',
    slug: 'when-to-replace-roof',
    image: 'https://d64gsuwffb70l.cloudfront.net/68deb4266cd629b01658472d_1759450165700_219ea329.webp'
  }
];

const allPosts = [...blogPosts, ...additionalPosts];

export default function Blog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get all unique categories with counts
  const categories = useMemo(() => {
    const categoryMap = new Map<string, number>();
    allPosts.forEach(post => {
      categoryMap.set(post.category, (categoryMap.get(post.category) || 0) + 1);
    });
    return Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }));
  }, []);

  // Filter posts based on search and category
  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (post.content && post.content.toLowerCase().includes(searchQuery.toLowerCase()));
      
      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
  };

  const hasActiveFilters = searchQuery !== '' || selectedCategory !== null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    "name": "Hoven Construction Blog",
    "description": "Expert construction tips, guides, and industry insights",
    "blogPost": blogPosts.map(post => ({
      "@type": "BlogPosting",
      "headline": post.title,
      "description": post.excerpt,
      "datePublished": post.date,
      "image": post.image,
      "articleSection": post.category
    }))
  };

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Construction Blog & Tips"
        description="Expert construction advice, renovation tips, and industry insights from Hoven Construction."
        keywords="construction blog, renovation tips, building advice, contractor insights"
        schema={schema}
      />
      <div className="container mx-auto px-4 py-12">
        <Breadcrumbs />
        <h1 className="text-4xl font-bold mb-4">Construction Blog</h1>
        <p className="text-xl text-muted-foreground mb-8">Expert tips and insights for your next project</p>
        
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>

        {/* Category Filters */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm font-medium text-muted-foreground mr-2">Filter by:</span>
            {categories.map(({ name, count }) => (
              <Button
                key={name}
                variant={selectedCategory === name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(selectedCategory === name ? null : name)}
                className="gap-2"
              >
                {name}
                <Badge variant="secondary" className="ml-1">{count}</Badge>
              </Button>
            ))}
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="gap-2 text-muted-foreground"
              >
                <X className="h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredPosts.length} {filteredPosts.length === 1 ? 'article' : 'articles'}
            {selectedCategory && ` in ${selectedCategory}`}
            {searchQuery && ` matching "${searchQuery}"`}
          </p>
        </div>
        
        {/* Blog Posts Grid */}
        {filteredPosts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>
                <CardHeader>
                  <div className="text-sm text-primary mb-2">{post.category}</div>
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {post.readTime}
                    </span>
                  </div>
                  <Button variant="link" className="p-0" asChild>
                    <Link to={`/blog/${post.slug}`}>
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No articles found matching your criteria.</p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
