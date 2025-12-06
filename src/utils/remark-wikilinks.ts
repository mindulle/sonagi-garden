import { visit } from 'unist-util-visit';
import type { Root, Link, Text } from 'mdast';

// 위키링크 패턴: [[ note-name]] 또는 [[note-name|alias]]
const WIKILINK_REGEX = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

interface WikiLinkMatch {
    raw: string;
    target: string;
    alias?: string;
    index: number;
}

/**
 * 모든 노트의 정보를 캐시
 */
let noteCache: Map<string, { url: string; title: string }> = new Map();

/**
 * 빌드 시점에 노트 캐시를 초기화하는 함수
 * Astro 페이지에서 Astro.glob()로 로드한 노트들을 전달받아 캐시를 생성
 */
export function initNoteCache(notes: any[]) {
    noteCache.clear();

    for (const note of notes) {
        if (!note.file) continue;

        // 파일 경로에서 정보 추출
        const pathParts = note.file.split('/');
        const filename = pathParts[pathParts.length - 1].replace('.md', '');

        // 카테고리 찾기 (content/ 다음 경로)
        const contentIndex = pathParts.findIndex((p: string) => p === 'content');
        const category = pathParts[contentIndex + 1] || 'notes';

        // URL 생성
        const url = `/notes/${category}/${filename}`;

        // 정규화된 키 (소문자, 하이픈을 공백으로)
        const normalizedKey = filename.toLowerCase().replace(/[-_]/g, ' ');

        // 캐시에 저장 (제목은 frontmatter에서 가져오거나 파일명 사용)
        noteCache.set(normalizedKey, {
            url,
            title: note.frontmatter?.title || filename.replace(/-/g, ' ')
        });
    }

    return noteCache;
}

/**
 * 노트 이름으로 URL 찾기 (case-insensitive)
 */
function resolveNoteUrl(target: string): { url: string; title: string } | null {
    // 정규화: 소문자, 공백/하이픈 처리
    const normalized = target.toLowerCase().replace(/[-_]/g, ' ');

    return noteCache.get(normalized) || null;
}

/**
 * 텍스트 노드에서 위키링크 찾기
 */
function findWikiLinks(text: string): WikiLinkMatch[] {
    const matches: WikiLinkMatch[] = [];
    let match;

    WIKILINK_REGEX.lastIndex = 0; // 정규식 초기화

    while ((match = WIKILINK_REGEX.exec(text)) !== null) {
        matches.push({
            raw: match[0],
            target: match[1].trim(),
            alias: match[2]?.trim(),
            index: match.index
        });
    }

    return matches;
}

/**
 * Remark 플러그인: 위키링크를 실제 링크로 변환
 * 
 * 사용 전에 initNoteCache()로 캐시를 초기화해야 함
 */
export default function remarkWikilinks() {
    return (tree: Root) => {
        // 캐시가 초기화되지 않았으면 경고
        if (!noteCache || noteCache.size === 0) {
            console.warn('[remark-wikilinks] Note cache not initialized. Wikilinks will not be resolved.');
            return;
        }

        // 모든 텍스트 노드 방문
        visit(tree, 'text', (node: Text, index, parent) => {
            if (!parent || index === null) return;

            const text = node.value;
            const wikilinks = findWikiLinks(text);

            if (wikilinks.length === 0) return;

            // 새로운 노드 배열 생성
            const newNodes: (Text | Link)[] = [];
            let lastIndex = 0;

            for (const wikilink of wikilinks) {
                // 위키링크 앞의 텍스트
                if (wikilink.index > lastIndex) {
                    newNodes.push({
                        type: 'text',
                        value: text.slice(lastIndex, wikilink.index)
                    });
                }

                // 노트 URL 해결
                const resolved = resolveNoteUrl(wikilink.target);

                if (resolved) {
                    // 정상 링크
                    newNodes.push({
                        type: 'link',
                        url: resolved.url,
                        title: null,
                        children: [{
                            type: 'text',
                            value: wikilink.alias || wikilink.target
                        }],
                        data: {
                            hProperties: {
                                className: ['wikilink']
                            }
                        }
                    } as Link);
                } else {
                    // 깨진 링크
                    newNodes.push({
                        type: 'link',
                        url: '#',
                        title: `Note not found: ${wikilink.target}`,
                        children: [{
                            type: 'text',
                            value: wikilink.alias || wikilink.target
                        }],
                        data: {
                            hProperties: {
                                className: ['wikilink', 'broken'],
                                'data-target': wikilink.target
                            }
                        }
                    } as Link);
                }

                lastIndex = wikilink.index + wikilink.raw.length;
            }

            // 마지막 위키링크 뒤의 텍스트
            if (lastIndex < text.length) {
                newNodes.push({
                    type: 'text',
                    value: text.slice(lastIndex)
                });
            }

            // 부모 노드의 자식 배열 교체
            parent.children.splice(index, 1, ...newNodes);
        });
    };
}
