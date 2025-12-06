import React, { useEffect, useState, useRef } from 'react';

interface SearchResult {
    id: string;
    data: {
        url: string;
        meta: {
            title: string;
            image?: string;
        };
        excerpt: string;
        filters: {
            category?: string[];
            tags?: string[];
        };
    };
}

export function SearchModal() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    // Toggle modal
    useEffect(() => {
        const handleKeydown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };

        const handleOpenSearch = () => setIsOpen(true);

        window.addEventListener('keydown', handleKeydown);
        window.addEventListener('sonagi:open-search', handleOpenSearch);

        return () => {
            window.removeEventListener('keydown', handleKeydown);
            window.removeEventListener('sonagi:open-search', handleOpenSearch);
        };
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            setQuery('');
            setResults([]);
        }
    }, [isOpen]);

    // Search logic
    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        const runSearch = async () => {
            setIsLoading(true);
            try {
                // @ts-ignore
                if (window.pagefind) {
                    // @ts-ignore
                    const search = await window.pagefind.search(query);
                    const data = await Promise.all(search.results.map((r: any) => r.data()));
                    setResults(data);
                }
            } catch (e) {
                console.error('Search failed:', e);
            } finally {
                setIsLoading(false);
            }
        };

        const timeoutId = setTimeout(runSearch, 300);
        return () => clearTimeout(timeoutId);
    }, [query]);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (results[selectedIndex]) {
                window.location.href = results[selectedIndex].data.url;
                setIsOpen(false);
            }
        }
    };

    if (!isOpen) return null;

    return (
        <div className="search-overlay" onClick={(e) => e.target === modalRef.current && setIsOpen(false)}>
            <div className="search-modal" ref={modalRef}>
                <div className="search-header">
                    <span className="search-icon">🔍</span>
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Search notes..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="search-input"
                    />
                    <button onClick={() => setIsOpen(false)} className="close-button">ESC</button>
                </div>

                <div className="search-results">
                    {isLoading && <div className="search-message">Searching...</div>}

                    {!isLoading && query && results.length === 0 && (
                        <div className="search-message">No results found for "{query}"</div>
                    )}

                    {results.map((result, index) => (
                        <a
                            key={result.id}
                            href={result.data.url}
                            className={`search-result-item ${index === selectedIndex ? 'selected' : ''}`}
                            onClick={() => setIsOpen(false)}
                            onMouseEnter={() => setSelectedIndex(index)}
                        >
                            <div className="result-header">
                                <span className="result-title">{result.data.meta.title}</span>
                                {result.data.filters.category && (
                                    <span className="result-category">{result.data.filters.category}</span>
                                )}
                            </div>
                            <p className="result-excerpt" dangerouslySetInnerHTML={{ __html: result.data.excerpt }} />
                        </a>
                    ))}

                    {!query && (
                        <div className="search-empty-state">
                            <p>Type to search documentation, notes, and more...</p>
                            <div className="search-shortcuts">
                                <kbd>Cmd</kbd> + <kbd>K</kbd> to open
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
