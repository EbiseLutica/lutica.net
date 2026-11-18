/**
 * ブログ記事の公開状態。
 * - public: 公開。一覧・RSS・個別ページすべてに出る
 * - unlisted: 限定公開。個別ページは生成するが、一覧・RSS には載せず noindex を付ける
 * - private: 非公開。本番ではページを生成しない（dev のみ表示）
 */
export const VISIBILITIES = ['public', 'unlisted', 'private'] as const;

export type Visibility = typeof VISIBILITIES[number];

export const VISIBILITY_LABELS: Record<Visibility, string> = {
	public: '公開',
	unlisted: '限定公開',
	private: '非公開',
};

/** 一覧・RSS に載せるかどうか */
export const isListed = (data: { visibility?: Visibility }) => data.visibility === 'public';

/** 本番でページを生成するかどうか */
export const isPublished = (data: { visibility?: Visibility }) => data.visibility !== 'private';
