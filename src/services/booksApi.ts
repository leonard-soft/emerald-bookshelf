import type { Book } from '../types';

const BASE = 'https://www.googleapis.com/books/v1/volumes';
export type OrderBy = 'relevance' | 'newest';

export const CATEGORIES = [
  { value: '', label: 'Todas' },
  { value: 'fiction', label: 'Ficción' },
  { value: 'science', label: 'Ciencia' },
  { value: 'history', label: 'Historia' },
  { value: 'technology', label: 'Tecnología' },
  { value: 'philosophy', label: 'Filosofía' }
];

export function mapVolume(raw: any): Book {
  const v = raw.volumeInfo ?? {};
  const thumb: string | undefined = v.imageLinks?.thumbnail ?? v.imageLinks?.smallThumbnail;
  return {
    id: raw.id,
    title: v.title ?? 'Sin título',
    authors: v.authors ?? [],
    category: v.categories?.[0] ?? 'General',
    thumbnail: thumb?.replace('http://', 'https://'),
    description: v.description ? String(v.description).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : undefined,
    publishedDate: v.publishedDate,
    pageCount: v.pageCount
  };
}

export function buildSearchUrl(query: string, category: string, orderBy: OrderBy): string {
  const parts: string[] = [];
  if (query.trim()) parts.push(query.trim());
  if (category) parts.push(`subject:${category}`);
  const q = parts.length ? parts.map(encodeURIComponent).join('+') : 'literature';
  return `${BASE}?q=${q}&orderBy=${orderBy}&maxResults=24&printType=books`;
}

export async function searchBooks(query: string, category: string, orderBy: OrderBy, signal?: AbortSignal): Promise<Book[]> {
  const res = await fetch(buildSearchUrl(query, category, orderBy), { signal });
  if (!res.ok) throw new Error(`Google Books respondió ${res.status}`);
  const data = await res.json();
  return (data.items ?? []).map(mapVolume);
}

export async function getBook(id: string, signal?: AbortSignal): Promise<Book> {
  const res = await fetch(`${BASE}/${encodeURIComponent(id)}`, { signal });
  if (!res.ok) throw new Error(`Google Books respondió ${res.status}`);
  return mapVolume(await res.json());
}
