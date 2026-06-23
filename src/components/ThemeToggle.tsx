'use client';

import { useEffect, useState } from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Light/dark switch. Persists to localStorage; no-flash init lives in layout.tsx. */
export function ThemeToggle({ className }: { className?: string }) {
	const [isDark, setIsDark] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
		setIsDark(document.documentElement.classList.contains('dark'));
	}, []);

	function toggle() {
		const next = !isDark;
		setIsDark(next);
		document.documentElement.classList.toggle('dark', next);
		try {
			localStorage.setItem('theme', next ? 'dark' : 'light');
		} catch {
			/* ignore storage errors */
		}
	}

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label={mounted && isDark ? 'מעבר למצב בהיר' : 'מעבר למצב כהה'}
			className={cn(
				'inline-flex size-9 items-center justify-center rounded-sm border border-border text-foreground transition-colors hover:border-primary hover:text-primary',
				className,
			)}
		>
			<SunIcon className="hidden size-4 dark:block" aria-hidden="true" />
			<MoonIcon className="block size-4 dark:hidden" aria-hidden="true" />
		</button>
	);
}
