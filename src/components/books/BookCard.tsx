import { Book } from '@/types/library';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, Eye } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onBorrow?: (bookId: string) => void;
  showActions?: boolean;
}

export function BookCard({ book, onBorrow, showActions = true }: BookCardProps) {
  const isAvailable = book.availableCopies > 0;

  return (
    <div className="book-card group">
      {/* Cover Image */}
      <div className="aspect-[3/4] relative overflow-hidden bg-muted">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Quick Actions Overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0">
          <Button asChild variant="secondary" size="sm" className="flex-1">
            <Link to={`/books/${book.id}`}>
              <Eye className="w-4 h-4 mr-1" />
              View
            </Link>
          </Button>
          {showActions && isAvailable && (
            <Button
              variant="accent"
              size="sm"
              className="flex-1"
              onClick={() => onBorrow?.(book.id)}
            >
              <BookOpen className="w-4 h-4 mr-1" />
              Borrow
            </Button>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <Badge variant="outline" className="text-xs">
            {book.category}
          </Badge>
          {isAvailable ? (
            <span className="badge-available">Available</span>
          ) : (
            <span className="badge-borrowed">Borrowed</span>
          )}
        </div>
        
        <h3 className="font-serif font-bold text-lg leading-tight mb-1 line-clamp-2">
          {book.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-2">{book.author}</p>
        
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>ISBN: {book.isbn.slice(-4)}</span>
          <span>{book.availableCopies}/{book.totalCopies} copies</span>
        </div>
      </div>
    </div>
  );
}
