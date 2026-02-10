export interface BookRecord {
  id: string;
  name: string;
  pageCount: number;
  lastPage: number;
  lastOpened: number;
  coverDataUrl: string | null;
}

const STORAGE_KEY = "bibliotheca_books";

export function getBookshelf(): BookRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as BookRecord[];
  } catch {
    return [];
  }
}

export function saveBookToShelf(book: BookRecord) {
  const shelf = getBookshelf().filter((b) => b.id !== book.id);
  shelf.unshift(book);
  // Keep max 20
  const trimmed = shelf.slice(0, 20);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
}

export function updateLastPage(id: string, lastPage: number) {
  const shelf = getBookshelf();
  const book = shelf.find((b) => b.id === id);
  if (book) {
    book.lastPage = lastPage;
    book.lastOpened = Date.now();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(shelf));
  }
}

export function removeFromShelf(id: string) {
  const shelf = getBookshelf().filter((b) => b.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(shelf));
}

export function generateBookId(name: string, pageCount: number): string {
  return `${name}-${pageCount}-${name.length}`;
}
