import { useEffect, useState } from 'react';

export function DarkModeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [mounted, setMounted] = useState(false);

    // 마운트 후에만 theme 상태 초기화 (hydration mismatch 방지)
    useEffect(() => {
        const savedTheme = localStorage.getItem('sonagi-theme') as 'light' | 'dark' | null;
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

        setTheme(initialTheme);
        setMounted(true);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        localStorage.setItem('sonagi-theme', newTheme);
        document.documentElement.setAttribute('data-theme', newTheme);
    };

    // 마운트되기 전에는 아무것도 렌더링하지 않음
    if (!mounted) {
        return (
            <button className="theme-toggle" aria-label="Toggle theme">
                <span className="theme-icon">🌙</span>
            </button>
        );
    }

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
            <span className="theme-icon">
                {theme === 'light' ? '🌙' : '☀️'}
            </span>
        </button>
    );
}
