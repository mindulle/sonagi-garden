import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
    const notes = await getCollection('notes');

    // Sort by date descending
    const sortedNotes = notes.sort((a, b) => {
        return new Date(b.data.date).getTime() - new Date(a.data.date).getTime();
    });

    return rss({
        title: 'Sonagi Garden',
        description: '청량한 디지털 정원',
        site: context.site,
        items: sortedNotes.map((note) => ({
            title: note.data.title,
            pubDate: new Date(note.data.date),
            description: note.data.description,
            link: `/notes/${note.slug}/`,
        })),
        customData: `<language>ko-kr</language>`,
    });
}
