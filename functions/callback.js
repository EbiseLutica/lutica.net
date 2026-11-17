/**
 * Decap CMS の GitHub 認証コールバック (/callback)。
 * state を検証し、code をアクセストークンに交換して、opener (CMS) へ postMessage で渡す。
 */
export const onRequestGet = async ({ request, env }) => {
  const url = new URL(request.url);
  const { origin } = url;
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const savedState = readCookie(request.headers.get('Cookie'), 'decap_state');

  if (!code || !state || !savedState || state !== savedState) {
    return new Response('Invalid OAuth state', { status: 400 });
  }

  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: env.GITHUB_OAUTH_ID,
      client_secret: env.GITHUB_OAUTH_SECRET,
      code,
      redirect_uri: `${origin}/callback`,
    }),
  });
  const tokenJson = await tokenRes.json();
  if (!tokenJson.access_token) {
    return new Response('Failed to obtain access token', { status: 502 });
  }

  const message = `authorization:github:success:${JSON.stringify({ token: tokenJson.access_token, provider: 'github' })}`;

  return new Response(callbackHtml(origin, message), {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'Cache-Control': 'no-store',
      'Set-Cookie': 'decap_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0',
    },
  });
};

/**
 * Cookie ヘッダから指定名の値を取り出す。
 * @param {string | null} header Cookie ヘッダ値
 * @param {string} name Cookie 名
 * @returns {string | null}
 */
const readCookie = (header, name) => {
  if (!header) return null;
  for (const part of header.split(';')) {
    const [key, ...rest] = part.trim().split('=');
    if (key === name) return rest.join('=');
  }
  return null;
};

/**
 * 認証結果を opener に渡す HTML を生成する。
 * CMS からの handshake (authorizing:github) を受けてからトークンを送る。
 * 送信先 origin はサイト自身の origin に固定し、受信元も同一 origin のみ許可する。
 * @param {string} origin サイトの origin
 * @param {string} message 送信するメッセージ
 * @returns {string}
 */
const callbackHtml = (origin, message) => {
  const safeOrigin = JSON.stringify(origin).replace(/</g, '\\u003c');
  const safeMessage = JSON.stringify(message).replace(/</g, '\\u003c');
  return `<!doctype html>
<html lang="ja">
<head><meta charset="utf-8"><meta name="robots" content="noindex"><title>認証中</title></head>
<body>
<p>認証しています…</p>
<script>
(function () {
  var origin = ${safeOrigin};
  var message = ${safeMessage};
  window.addEventListener('message', function (e) {
    if (e.origin !== origin || !window.opener) return;
    window.opener.postMessage(message, origin);
    window.close();
  });
  if (window.opener) window.opener.postMessage('authorizing:github', origin);
})();
</script>
</body>
</html>`;
};
