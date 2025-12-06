import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
    const notes = await getCollection('notes');
    const categories = [...new Set(notes.map((note) => note.data.category).filter(Boolean))];
    return categories.map((category) => ({
        params: { category },
    }));
}

export async function GET(context) {
    const { category } = context.params;
    const notes = await getCollection('notes');

    const filteredNotes = notes
        .filter((note) => note.data.category === category)
        .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());

    return rss({
        title: `Sonagi Garden - ${category}`,
        description: `${category} notes from Sonagi Garden`,
        site: context.site,
        items: filteredNotes.map((note) => ({
            title: note.data.title,
            pubDate: new Date(note.data.date),
            description: note.data.description,
            link: `/notes/${note.slug}/`,
        })),
        customData: `<language>ko-kr</language>`,
    });
}
