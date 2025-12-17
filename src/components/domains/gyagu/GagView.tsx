import React, { useEffect, useState } from 'react';

const Gag: React.FC<{text: string | [string, string]}> = ({text}) => {
	if (typeof text === 'string') {
		return text;
	}

	return (
		<details>
			<summary>{text[0]}</summary>
			{text[1]}
		</details>
	);
};

export const GagView: React.FC = () => {
	const [gagList, setGagList] = useState<(string | [string, string])[]>([]);

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
					<li key={typeof g === 'string' ? g : g[0] + g[1]}>
						<Gag text={g} />
					</li>
				))}
			</ul>
		</>
		);
};
