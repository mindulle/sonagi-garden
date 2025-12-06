import { useEffect, useState } from 'react';

interface Heading {
    depth: number;
    slug: string;
    text: string;
}

interface Props {
    headings: Heading[];
}

export function TOC({ headings }: Props) {
    const [activeId, setActiveId] = useState<string>('');

    // h2, h3, h4만 필터링
    const filteredHeadings = headings.filter(h => h.depth >= 2 && h.depth <= 4);

    useEffect(() => {
        if (filteredHeadings.length === 0) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -66% 0px' }
        );

        filteredHeadings.forEach((heading) => {
            const element = document.getElementById(heading.slug);
            if (element) {
                observer.observe(element);
            }
        });

        return () => observer.disconnect();
    }, [headings]);

    if (filteredHeadings.length < 2) return null;

    return (
        <nav className="toc">
            <h2 className="toc-title">On this page</h2>
            <ul className="toc-list">
                {filteredHeadings.map((heading) => (
                    <li
                        key={heading.slug}
                        className={`toc-item depth-${heading.depth} ${activeId === heading.slug ? 'active' : ''}`}
                    >
                        <a
                            href={`#${heading.slug}`}
                            onClick={(e) => {
                                e.preventDefault();
                                document.getElementById(heading.slug)?.scrollIntoView({
                                    behavior: 'smooth'
                                });
                                setActiveId(heading.slug);
                            }}
                        >
                            {heading.text}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
