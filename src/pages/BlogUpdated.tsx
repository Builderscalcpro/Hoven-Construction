import { useState, useMemo } from 'react';
import { SEO } from '@/components/SEO';
import BlogHero from '@/components/BlogHero';
import BlogNewsletter from '@/components/BlogNewsletter';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight, Search, X, TrendingUp } from 'lucide-react';
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

export default function BlogUpdated() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const categoryMap = new Map<string, number>();
    allPosts.forEach(post => {
      categoryMap.set(post.category, (categoryMap.get(post.category) || 0) + 1);
    });
    return Array.from(categoryMap.entries()).map(([name, count]) => ({ name, count }));
  }, []);

  const filteredPosts = useMemo(() => {
    return allPosts.filter(post => {
      const matchesSearch = searchQuery === '' || 
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !selectedCategory || post.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const featuredPosts = allPosts.slice(0, 3);

  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Construction Blog & Renovation Tips | Hoven Construction"
        description="Expert construction advice, renovation tips, and industry insights from LA's premier remodeling contractor. Get guides on kitchen remodels, bathroom renovations, ADUs & more."
        keywords="construction blog, renovation tips, remodeling guide, kitchen remodel cost, bathroom renovation, ADU construction, home improvement"
      />
      
      <BlogHero />
      
      <div className="container mx-auto px-4 py-12">
        {/* Featured Posts */}
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="h-6 w-6 text-amber-600" />
            <h2 className="text-3xl font-bold">Featured Articles</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-xl transition-shadow overflow-hidden border-2 border-amber-100">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={post.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <Badge className="w-fit mb-2 bg-amber-600">{post.category}</Badge>
                  <CardTitle className="text-xl line-clamp-2">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
                  <Button variant="link" className="p-0 text-amber-600" asChild>
                    <Link to={`/blog/${post.slug}`}>
                      Read More <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Search & Filter */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-12 h-12 text-lg"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 justify-center items-center">
            <span className="text-sm font-medium text-muted-foreground">Categories:</span>
            {categories.map(({ name, count }) => (
              <Button
                key={name}
                variant={selectedCategory === name ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(selectedCategory === name ? null : name)}
                className={selectedCategory === name ? "bg-amber-600 hover:bg-amber-700" : ""}
              >
                {name} ({count})
              </Button>
            ))}
          </div>
        </div>

        {/* All Posts */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {filteredPosts.map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={post.image} 
                  alt={post.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">{post.category}</Badge>
                <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 line-clamp-2">{post.excerpt}</p>
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

        {/* Newsletter */}
        <BlogNewsletter />
      </div>
    </div>
  );
}
