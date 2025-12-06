import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';
import type { CollectionEntry } from 'astro:content';

export async function GET(context: APIContext) {
    const notes: CollectionEntry<'notes'>[] = await getCollection('notes');

    // Filter notes that shouldn't be in RSS (e.g. drafts if we had them)
    // And ensure date exists. If not, maybe use a default or skip?
    // for digital garden, many notes might not have dates.
    // Let's fallback to specific epoch or just filter those with dates for the feed.
    const validNotes = notes.filter((note) => note.data.date);

    // Sort by date descending
    const sortedNotes = validNotes.sort((a, b) => {
        // @ts-ignore
        return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
    });

    return rss({
        title: 'Sonagi Garden',
        description: '청량한 디지털 정원',
        site: context.site ?? 'https://sonagi-garden.vercel.app',
        items: sortedNotes.map((note) => ({
            title: note.data.title,
            pubDate: new Date(note.data.date!),
            description: note.data.description || '',
            link: `/notes/${note.slug}/`,
        })),
        customData: `<language>ko-kr</language>`,
    });
}
