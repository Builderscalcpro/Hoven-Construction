import { BlogPost } from '@/data/blogPosts';

/**
 * Get related articles based on category and content similarity
 * Algorithm:
 * 1. Prioritize posts from the same category
 * 2. Calculate similarity score based on common keywords in title/excerpt
 * 3. Return top 3-4 most relevant posts
 */
export function getRelatedArticles(
  currentPost: BlogPost,
  allPosts: BlogPost[],
  limit: number = 4
): BlogPost[] {
  // Filter out current post
  const otherPosts = allPosts.filter(post => post.id !== currentPost.id);

  // Calculate relevance score for each post
  const scoredPosts = otherPosts.map(post => {
    let score = 0;

    // Same category gets highest priority (50 points)
    if (post.category === currentPost.category) {
      score += 50;
    }

    // Calculate keyword similarity
    const currentKeywords = extractKeywords(currentPost.title + ' ' + currentPost.excerpt);
    const postKeywords = extractKeywords(post.title + ' ' + post.excerpt);
    
    const commonKeywords = currentKeywords.filter(kw => postKeywords.includes(kw));
    score += commonKeywords.length * 5;

    return { post, score };
  });

  // Sort by score and return top results
  return scoredPosts
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.post);
}

/**
 * Extract meaningful keywords from text
 */
function extractKeywords(text: string): string[] {
  const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during'];
  
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word));
}
