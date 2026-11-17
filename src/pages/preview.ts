import type { APIRoute } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { createMarkdownProcessor } from '@astrojs/markdown-remark';
import PreviewPost from '../components/PreviewPost.astro';

export const prerender = false;

/**
 * Decap / Sveltia の preview 用エンドポイント (POST /preview)。
 * CMS から送られた下書き (frontmatter + markdown 本文) を、実際のブログ記事と同じ Layout で描画して HTML を返す。
 * 同一 origin からのリクエストのみ受け付ける。
 */
export const POST: APIRoute = async ({ request }) => {
  const { origin } = new URL(request.url);
  if (request.headers.get('Origin') !== origin) {
    return new Response('Forbidden', { status: 403 });
  }

  const data = (await request.json()) as {
    title?: string;
    description?: string;
    date?: string;
    draft?: boolean;
    body?: string;
  };

  const processor = await createMarkdownProcessor();
  const { code } = await processor.render(data.body ?? '');

  const container = await AstroContainer.create();
  const html = await container.renderToString(PreviewPost, {
    props: {
      frontmatter: {
        title: data.title ?? '',
        description: data.description,
        date: new Date(data.date ?? ''),
        draft: data.draft ?? false,
      },
      html: code,
    },
  });

  return new Response(`<!doctype html>${html}`, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Robots-Tag': 'noindex',
    },
  });
};
