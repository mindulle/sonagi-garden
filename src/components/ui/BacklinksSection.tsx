import * as React from 'react';

interface Backlink {
    sourceSlug: string;
    sourceTitle: string;
    excerpt: string;
}

interface Props {
    backlinks: Backlink[];
}

export function BacklinksSection({ backlinks }: Props) {
    if (!backlinks || backlinks.length === 0) return null;

    return (
        <section className="backlinks-section">
            <h3 className="backlinks-heading">Linked to this note</h3>
            <div className="backlinks-grid">
                {backlinks.map((link) => (
                    <a href={`/notes/${link.sourceSlug}`} key={link.sourceSlug} className="backlink-card">
                        <span className="backlink-title">{link.sourceTitle}</span>
                        <p className="backlink-excerpt">{link.excerpt}</p>
                    </a>
                ))}
            </div>
        </section>
    );
}
