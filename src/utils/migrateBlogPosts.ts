import { supabase } from '@/lib/supabase';
import { blogPosts } from '@/data/blogPosts';

export async function migrateBlogPosts() {
  console.log('Starting blog post migration...');
  
  for (const post of blogPosts) {
    try {
      // Check if post already exists
      const { data: existing } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', post.slug)
        .single();

      if (existing) {
        console.log(`Post "${post.title}" already exists, skipping...`);
        continue;
      }

      // Insert the post
      const { error } = await supabase.from('blog_posts').insert({
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        content: post.content,
        featured_image: post.image,
        category: post.category,
        read_time: post.readTime,
        author_name: post.author.name,
        author_bio: post.author.bio,
        author_credentials: post.author.credentials,
        author_image: post.author.image,
        keywords: post.keywords || [],
        published_date: post.date,
        is_published: true,
        meta_description: post.excerpt.substring(0, 160),
      });

      if (error) {
        console.error(`Error migrating post "${post.title}":`, error);
      } else {
        console.log(`Successfully migrated: ${post.title}`);
      }
    } catch (err) {
      console.error(`Failed to migrate post "${post.title}":`, err);
    }
  }

  console.log('Migration complete!');
}
