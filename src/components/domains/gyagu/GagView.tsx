import React, { useEffect, useState } from 'react';

type GagRecord = {
	id: string;
	text: string;
	summary?: string | null;
	url?: string | null;
};

const Gag: React.FC<GagRecord> = ({id, text, summary, url}) => {
	const inner = summary ? (
		<details id={id} className="gyagu--details">
			<summary>{summary}</summary>
			{text}
		</details>
	) : text;

	return url ? <a className="gyagu--link" href={url} target="_blank" rel="noopener noreferrer">{inner}</a> : inner;
};

export const GagView: React.FC = () => {
	const [gagList, setGagList] = useState<GagRecord[]>([]);

	useEffect(() => {
		fetch('https://urusai.lutic.at').then(d => d.json()).then(setGagList);
	}, []);

	return gagList.length === 0 ? (
		<div style={{height: '100vh'}}>
			Loading...
		</div>
	) : (
		<>
			<p>現在のギャグ数：{gagList.length}個</p>
			<ul>
				{gagList.map(g => (
					<li key={g.id}>
						<Gag {...g} />
					</li>
				))}
			</ul>
		</>
		);
};
