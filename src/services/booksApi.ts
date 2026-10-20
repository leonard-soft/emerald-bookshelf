import type { Book } from '../types';

const BASE = 'https://openlibrary.org';
export type OrderBy = 'relevance' | 'newest';

export const CATEGORIES = [
  { value: '', label: 'Todas' },
{ value: 'fiction', label: 'Ficción' },
{ value: 'science', label: 'Ciencia' },
{ value: 'history', label: 'Historia' },
{ value: 'technology', label: 'Tecnología' },
{ value: 'philosophy', label: 'Filosofía' }
];

export function mapDoc(raw: any): Book {
  const workKey = raw.key ?? '';
  const id = workKey.includes('/works/') ? workKey.split('/works/')[1] : (raw.key ?? Math.random().toString());

  let thumbnail: string | undefined = undefined;
  if (raw.cover_i) {
    thumbnail = `https://covers.openlibrary.org/b/id/${raw.cover_i}-M.jpg`;
  }

  return {
    id,
    title: raw.title ?? 'Sin título',
    authors: raw.author_name ?? [],
    category: raw.subject?.[0] ?? 'General',
    thumbnail,
    description: undefined,
    publishedDate: raw.first_publish_year ? String(raw.first_publish_year) : undefined,
    pageCount: raw.number_of_pages_median
  };
}

export function buildSearchUrl(query: string, category: string, orderBy: OrderBy): string {
  const params = new URLSearchParams();

  const qParts: string[] = [];
  if (query.trim()) qParts.push(query.trim());

  params.set('q', qParts.length ? qParts.join(' ') : 'literature');

  if (category) {
    params.set('subject', category);
  }

  if (orderBy === 'newest') {
    params.set('sort', 'new');
  }

  params.set('limit', '24');

  return `${BASE}/search.json?${params.toString()}`;
}

export async function searchBooks(query: string, category: string, orderBy: OrderBy, signal?: AbortSignal): Promise<Book[]> {
  const res = await fetch(buildSearchUrl(query, category, orderBy), { signal });
  if (!res.ok) throw new Error(`Open Library respondió con estado ${res.status}`);
  const data = await res.json();
  return (data.docs ?? []).map(mapDoc);
}

export async function getBook(id: string, signal?: AbortSignal): Promise<Book> {
  const res = await fetch(`${BASE}/works/${encodeURIComponent(id)}.json`, { signal });
  if (!res.ok) throw new Error(`Open Library respondió con estado ${res.status}`);
  const raw = await res.json();

  let desc = raw.description;
  if (typeof desc === 'object' && desc !== null) {
    desc = desc.value;
  }

  let thumbnail: string | undefined = undefined;
  if (raw.covers && raw.covers.length > 0) {
    thumbnail = `https://covers.openlibrary.org/b/id/${raw.covers[0]}-M.jpg`;
  }

  const authors: string[] = [];
  if (Array.isArray(raw.authors)) {
    authors.push(...raw.authors.map((a: any) => a.name || 'Autor desconocido'));
  }

  return {
    id,
    title: raw.title ?? 'Sin título',
    authors: authors.length > 0 ? authors : ['Autor desconocido'],
    category: raw.subjects?.[0] ?? 'General',
    thumbnail,
    description: desc ? String(desc).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : undefined,
    publishedDate: raw.created?.value ? new Date(raw.created.value).getFullYear().toString() : undefined,
    pageCount: undefined
  };
}
