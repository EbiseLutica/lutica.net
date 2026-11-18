import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';

/**
 * 公開対象の記事を新しい順で取得する。開発ビルドでは下書きも含める。
 */
export async function getPublishedPosts(): Promise<CollectionEntry<'blog'>[]> {
    const isDev = import.meta.env.DEV;
    const posts = await getCollection('blog', ({ data }) => isDev || !data.draft);
    return posts.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/**
 * 記事群に含まれるタグと件数を、件数の多い順で返す。
 */
export function countTags(posts: CollectionEntry<'blog'>[]): { tag: string; count: number }[] {
    const counts = new Map<string, number>();
    for (const post of posts) {
        for (const tag of post.data.tags) {
            counts.set(tag, (counts.get(tag) ?? 0) + 1);
        }
    }
    return [...counts]
        .map(([tag, count]) => ({ tag, count }))
        .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag, 'ja'));
}
