/**
 * Decap CMS の GitHub 認証開始エンドポイント (/auth)。
 * state を生成して Cookie に保存し、GitHub の認可画面へリダイレクトする。
 */
export const onRequestGet = ({ request, env }) => {
  if (!env.GITHUB_OAUTH_ID || !env.GITHUB_OAUTH_SECRET) {
    return new Response(
      `OAuth 設定不足: GITHUB_OAUTH_ID=${!!env.GITHUB_OAUTH_ID}, GITHUB_OAUTH_SECRET=${!!env.GITHUB_OAUTH_SECRET}`,
      { status: 500 },
    );
  }

  const { origin } = new URL(request.url);
  const state = crypto.randomUUID();

  const authorizeUrl = new URL('https://github.com/login/oauth/authorize');
  authorizeUrl.searchParams.set('client_id', env.GITHUB_OAUTH_ID);
  authorizeUrl.searchParams.set('redirect_uri', `${origin}/callback`);
  authorizeUrl.searchParams.set('scope', 'repo');
  authorizeUrl.searchParams.set('state', state);

  return new Response(null, {
    status: 302,
    headers: {
      Location: authorizeUrl.toString(),
      'Set-Cookie': `decap_state=${state}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=600`,
    },
  });
};
