import React, { useEffect, useState } from 'react';

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
					<li>
						{typeof g === 'string' ? g : (
							<details>
								<summary>{g[0]}</summary>
								{g[1]}
							</details>
						)}
					</li>
				))}
			</ul>
		</>
		);
};
