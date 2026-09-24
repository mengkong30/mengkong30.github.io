import { glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';

const blogCollection = defineCollection({
	loader: glob({
		base: './src/content/blog',
		pattern: ['**/*.{md,mdx}', '!article-template.md', '!chinese-article-template.md', '!css-text-gradient-showcase-and-how-to-code/**'],
		generateId: ({ entry }) =>
			entry.replace(/\\/g, '/').replace(/\/index\.(md|mdx)$/i, '').replace(/\.(md|mdx)$/i, ''),
	}),
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		publishDate: z.coerce.date(),
		read: z.number().optional(),
		tags: z.array(z.string()).optional(),
		img: z.string().optional(),
		img_alt: z.string().optional(),
	}),
});

export const collections = {
	blog: blogCollection,
};
