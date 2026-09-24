import rss from "@astrojs/rss";
import { getCollection } from "astro:content";

export async function GET(context) {
  const blog = await getCollection('blog');
  return rss({
    title: 'TOK 的博客',
    description: '设计、体验与日常思考。',
    site: context.site,
    items: blog.map((post) => ({
      title: post.data.title,
      pubDate: post.data.publishDate,
      description: post.data.description,
      // ...post.data,
      link: `${import.meta.env.BASE_URL.replace(/\/$/, '')}/blog/${post.id}/`,
      stylesheet: '/rss/pretty-feed-v3.xsl',
    })),
  });
}
