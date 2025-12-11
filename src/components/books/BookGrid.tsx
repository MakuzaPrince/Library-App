import { Book } from '@/types/library';
import { BookCard } from './BookCard';

interface BookGridProps {
  books: Book[];
  onBorrow?: (bookId: string) => void;
  showActions?: boolean;
}

export function BookGrid({ books, onBorrow, showActions }: BookGridProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
          <span className="text-2xl">📚</span>
        </div>
        <h3 className="font-serif text-xl font-bold mb-2">No books found</h3>
        <p className="text-muted-foreground">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {books.map((book, index) => (
        <div
          key={book.id}
          className="animate-slide-up opacity-0"
          style={{ animationDelay: `${index * 0.05}s`, animationFillMode: 'forwards' }}
        >
          <BookCard book={book} onBorrow={onBorrow} showActions={showActions} />
        </div>
      ))}
    </div>
  );
}
