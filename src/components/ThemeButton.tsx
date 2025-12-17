import React, { useEffect, useState } from 'react';
import { Icon } from "@iconify/react";

import $style from './ThemeButton.module.scss';

const themes = ['system', 'light', 'dark'] as const;
type Theme = typeof themes[number];

export const ThemeButton: React.FC<{
	className?: string;
	systemIcon?: string;
	lightIcon?: string;
	darkIcon?: string;
}> = (p) => {
	const [theme, setTheme] = useState<Theme>('system');
	const [preferTheme, setPreferTheme] = useState<'light' | 'dark'>('light');

	const icon =
		theme === 'system'
			? 'tabler:device-desktop-filled'
			: theme === 'light'
				? 'tabler:sun-filled'
				: 'tabler:moon-filled';

	const toggleTheme = () => {
		const currentIndex = themes.indexOf(theme);
		const nextIndex = (currentIndex + 1) % themes.length;
		const nextTheme = themes[nextIndex];
		setTheme(nextTheme);
		localStorage.setItem('theme', nextTheme);
	};

	// local storageからテーマを取得して設定
	useEffect(() => {
		const savedTheme = localStorage.getItem('theme') ?? 'system';
		setTheme(savedTheme as Theme);

		const matchMediaResult = window.matchMedia('(prefers-color-scheme: dark)');
		const onThemeChange = () => {
			setPreferTheme(matchMediaResult.matches ? 'dark' : 'light');
		};
		matchMediaResult.addEventListener('change', onThemeChange);
		onThemeChange();

		return () => {
			matchMediaResult.removeEventListener('change', onThemeChange);
		}
	}, []);

	// テーマが変わったときにdocumentのdata-themeを更新
	useEffect(() => {
		let appliedTheme: 'light' | 'dark';
		if (theme === 'system') {
			appliedTheme = preferTheme;
		} else {
			appliedTheme = theme;
		}
		document.documentElement.dataset.theme = appliedTheme;
	}, [theme, preferTheme]);

	return (
		<button className={$style.button} onClick={toggleTheme} aria-label="Toggle Theme">
			<Icon icon={icon} width="1rem" height="1rem" />
		</button>
	 );
};
