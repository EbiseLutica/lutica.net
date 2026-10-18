import React, { useCallback, useEffect, useState } from 'react';
import styles from './GagView.module.css';

type GagRecord = {
	id: number;
	text: string;
	summary?: string | null;
	url?: string | null;
	likes: number;
};

const Gag: React.FC<GagRecord & {like: (id: number) => void}> = ({id, text, summary, url, likes, like}) => {
	const [opened, setOpened] = useState(false);
	const inner = summary ? (
		<div>
			<div>
				{summary}
				<button className={styles.openGyaguButton} onClick={() => setOpened(b => !b)}>
					{opened ? '隠す' : '続きを見る'}
				</button>
			</div>

			{opened && <div>{text}</div>}
		</div>
	) : <div>{text}</div>;

	return (
		<div className={styles.card}>
			{inner}
			<div className={styles.toolbar}>
				<button className={styles.likeButton} onClick={() => like(id)}>❤️ {likes}</button>
				{url && <a className={styles.source} href={url} target="_blank" rel="noopener noreferrer">出典…</a>}
			</div>
		</div>
	);
};

const GAG_ORDERS = {
	'id-desc': '新しい順',
	'id-asc': '古い順',
	'likes-desc': 'いいねが多い順',
	'likes-asc': 'いいねが少ない順',
} as const;

type GagOrder = keyof typeof GAG_ORDERS;

export const GagView: React.FC = () => {
	const [gagList, setGagList] = useState<GagRecord[]>([]);
	const [order, setOrder] = useState<GagOrder>('id-desc');

	useEffect(() => {
		setGagList([]);
		fetch(`https://urusai.lutic.at?order=${encodeURIComponent(order)}`).then(d => d.json()).then(setGagList);
	}, [order]);

	const like = useCallback((id: number) => {
		// 楽観的UI更新
		fetch(`https://urusai.lutic.at/like/${id}`, {
			method: 'POST',
		});
		setGagList(gags => gags.map(gag => gag.id === id ? {
			...gag,
			likes: gag.likes + 1,
		} : gag));
	}, []);

	return (
		<div>
			<header className={styles.header}>
				<div>{gagList.length > 0 ? `現在のギャグ数: ${gagList.length}個` : 'ギャグを取得中…'}</div>
				<select className={styles.select} value={order} onChange={e => setOrder(e.target.value as GagOrder)}>
					{(Object.keys(GAG_ORDERS) as GagOrder[]).map(o => <option key={o} value={o}>{GAG_ORDERS[o]}</option>)}
				</select>
			</header>
			{gagList.length > 0 && (
				<div className={styles.list}>
					{gagList.map(g => (
						<Gag key={g.id} {...g} like={like} />
					))}
				</div>
			)}
		</div>
	);
};
