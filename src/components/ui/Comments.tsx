import React, { useEffect, useState } from 'react';
import Giscus from '@giscus/react';

export default function Comments() {
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        // Initial theme
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        setTheme(currentTheme);

        // Observer for theme changes
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'data-theme') {
                    const newTheme = document.documentElement.getAttribute('data-theme') || 'light';
                    setTheme(newTheme);
                }
            });
        });

        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });

        return () => observer.disconnect();
    }, []);

    return (
        <div className="comments-section" style={{ marginTop: 'var(--sonagi-spacing-3xl)' }}>
            <Giscus
                id="comments"
                repo="mindulle/sonagi-garden"
                repoId="R_kgDOLP4J4Q"
                category="General"
                categoryId="DIC_kwDOLP4J4c4Cc4jK"
                mapping="pathname"
                term="Welcome to my digital garden!"
                reactionsEnabled="1"
                emitMetadata="0"
                inputPosition="top"
                theme={theme === 'dark' ? 'dark' : 'light'}
                lang="ko"
                loading="lazy"
            />
        </div>
    );
}
