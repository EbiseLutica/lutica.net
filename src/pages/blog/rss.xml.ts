import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { SITE_DESCRIPTION } from '../../scripts/const';

export async function GET(context: APIContext) {
	// 公開記事のみ。新しい順
	const posts = (await getCollection('blog', ({ data }) => !data.draft))
		.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

	return rss({
		title: 'るちーかの長いノート',
		description: SITE_DESCRIPTION,
		site: context.site!,
		items: posts.map(p => ({
			title: p.data.title,
			description: p.data.description,
			pubDate: p.data.date,
			link: `/blog/${p.slug}/`,
		})),
		customData: '<language>ja</language>',
	});
}
