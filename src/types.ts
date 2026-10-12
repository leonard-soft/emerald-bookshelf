export type ReadingStatus = 'por-leer' | 'leyendo' | 'completado';
export interface Book {
  id: string; title: string; authors: string[]; category: string;
  thumbnail?: string; description?: string; publishedDate?: string; pageCount?: number;
}
export interface Loan {
  bookId: string; title: string; authors: string[]; thumbnail?: string;
  borrowedAt: string; dueDate: string;
}
export interface User { email: string; name: string }
export interface Session { token: string; user: User }
