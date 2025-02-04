import { getPagesPaths } from '@/sanity/lib/fetch';
import fs from 'fs';
import path from 'path';

export default async function sitemap() {
	const baseUrl = process.env.SITE_URL;
	const baseDir = 'src/app/(pages)';
	// Exclude non-static pages
	const excludeDirs = ['_components', '[...not_found]', '[slug]'];
	// Define dynamic page types as an array of objects
	const dynamicPagesTypes = [{ type: 'pGeneral', slug: '' }];

	// Generate static routes from app router file system
	function generateStaticRoutes() {
		const fullPath = path.join(process.cwd(), baseDir);
		const entries = fs.readdirSync(fullPath, { withFileTypes: true });
		let staticRoutes = [];

		entries.forEach((entry) => {
			if (entry.isDirectory() && !excludeDirs.includes(entry.name)) {
				staticRoutes.push(`/${entry.name}`);
			}
		});

		return staticRoutes.map((route) => ({
			url: `${baseUrl}${route}`,
			lastModified: new Date(),
			changeFrequency: 'weekly',
			priority: 1.0,
		}));
	}

	// Generate dynamic routes
	async function generateDynamicRoutes() {
		const dynamicRoutes = await Promise.all(
			dynamicPagesTypes.map(async (page) => {
				const slugs = await getPagesPaths({ pageType: page.type });
				const urlPrefix = page.slug ? `/${page.slug}` : '';

				return slugs.map((slug) => ({
					url: `${baseUrl}${urlPrefix}/${slug}`,
					lastModified: new Date(),
					changeFrequency: 'monthly',
					priority: 1.0,
				}));
			})
		);

		return dynamicRoutes.flat();
	}

	const staticPages = generateStaticRoutes();
	const dynamicPages = await generateDynamicRoutes();
	const sitemap = [...staticPages, ...dynamicPages];

	return sitemap;
}
