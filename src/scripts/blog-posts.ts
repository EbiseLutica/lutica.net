import type { CollectionEntry } from 'astro:content';
import { getCollection } from 'astro:content';
import { isListed } from './blog';

/**
 * 一覧に載せる記事を新しい順で取得する。開発ビルドでは限定公開・非公開の記事も含める。
 */
export async function getListedPosts(): Promise<CollectionEntry<'blog'>[]> {
    const isDev = import.meta.env.DEV;
    const posts = await getCollection('blog', ({ data }) => isDev || isListed(data));
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
