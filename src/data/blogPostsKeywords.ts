// Add keywords to all blog posts efficiently
import { blogPosts } from './blogPosts';
import { blogKeywords } from './blogKeywords';

// Map keywords to posts
export const enhancedBlogPosts = blogPosts.map(post => ({
  ...post,
  keywords: blogKeywords[post.id] || []
}));
