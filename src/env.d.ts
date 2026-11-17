/// <reference types="astro/client" />
/// <reference types="../.astro/types" />

/** cloudflare:workers の env 型 (wrangler secret / dashboard で設定) */
declare namespace Cloudflare {
	interface Env {
		GITHUB_OAUTH_ID: string;
		GITHUB_OAUTH_SECRET: string;
	}
}
