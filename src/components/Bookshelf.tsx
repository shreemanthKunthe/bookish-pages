import { BookOpen, Clock, Trash2, X } from "lucide-react";
import { BookRecord, removeFromShelf } from "@/lib/bookshelf";
import { useState } from "react";

interface BookshelfProps {
  books: BookRecord[];
  onRefresh: () => void;
}

const Bookshelf = ({ books, onRefresh }: BookshelfProps) => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  if (books.length === 0) return null;

  const handleRemove = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    removeFromShelf(id);
    onRefresh();
  };

  const formatDate = (ts: number) => {
    const d = new Date(ts);
    const now = Date.now();
    const diff = now - ts;
    if (diff < 60000) return "Just now";
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="w-full mt-10 animate-fade-in">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-sm font-sans font-medium text-muted-foreground uppercase tracking-wider">
          Recently Opened
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {books.map((book) => (
          <div
            key={book.id}
            className="group flex items-center gap-4 p-3 rounded-lg bg-card/50 border border-border/50 hover:bg-secondary hover:border-border transition-all duration-200 cursor-default"
            onMouseEnter={() => setHoveredId(book.id)}
            onMouseLeave={() => setHoveredId(null)}
          >
            {book.coverDataUrl ? (
              <div className="w-10 h-14 rounded overflow-hidden flex-shrink-0 bg-page shadow-sm">
                <img
                  src={book.coverDataUrl}
                  alt={book.name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-14 rounded bg-secondary flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-muted-foreground" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate font-medium">
                {book.name}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {book.pageCount} pages · Page {book.lastPage + 1} · {formatDate(book.lastOpened)}
              </p>
            </div>

            <button
              onClick={(e) => handleRemove(e, book.id)}
              className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all"
              title="Remove"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookshelf;
