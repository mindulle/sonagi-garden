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
import { globSync } from 'glob'; // Changed to globSync for synchronous loading in config
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * 모든 노트의 정보를 캐시
 */
let noteCache: Map<string, { url: string; title: string }> = new Map();

/**
 * 파일 시스템에서 마크다운 파일들을 스캔하여 캐시 초기화
 * @param contentDir 콘텐츠 디렉토리 절대 경로 (예: src/content)
 */
export function initNoteCache(contentDir: string) {
    noteCache.clear();

    // glob 패턴으로 모든 .md 파일 찾기
    const files = globSync('**/*.md', { cwd: contentDir, absolute: true });

    for (const filePath of files) {
        // 파일 내용 읽어서 frontmatter 파싱
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data } = matter(fileContent);

        // 상대 경로 계산 (ex: dev/getting-started.md)
        const relativePath = path.relative(contentDir, filePath);

        // 파일명과 카테고리 추출
        const filename = path.basename(filePath, '.md');
        const pathParts = relativePath.split(path.sep);

        // 폴더 구조에 따른 URL 생성 (ex: /notes/dev/getting-started)
        // content/dev/note.md -> /notes/dev/note
        // 최상위 파일인 경우 -> /notes/note (혹은 분류에 따라 다름)
        // 여기서는 디렉토리 구조를 그대로 유지
        const urlPath = pathParts.join('/').replace('.md', '');
        const url = `/notes/${urlPath}`;

        // 정규화된 키 (소문자, 하이픈/언더바를 공백으로)
        const normalizedKey = filename.toLowerCase().replace(/[-_]/g, ' ');

        // 캐시에 저장
        noteCache.set(normalizedKey, {
            url,
            title: data.title || filename.replace(/-/g, ' ')
        });
    }

    console.log(`[remark-wikilinks] Cached ${noteCache.size} notes.`);
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
        // 캐시가 비어있어도 실행 (경고 로그는 init에서 처리)

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
