import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BookGrid } from '@/components/books/BookGrid';
import { BookFilters } from '@/components/books/BookFilters';
import { mockBooks } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

export default function Books() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'librarian';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [availability, setAvailability] = useState('all');

  const filteredBooks = useMemo(() => {
    return mockBooks.filter((book) => {
      // Search filter
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        !searchQuery ||
        book.title.toLowerCase().includes(searchLower) ||
        book.author.toLowerCase().includes(searchLower) ||
        book.isbn.toLowerCase().includes(searchLower);

      // Category filter
      const matchesCategory =
        selectedCategory === 'all' || book.category === selectedCategory;

      // Availability filter
      const matchesAvailability =
        availability === 'all' ||
        (availability === 'available' && book.availableCopies > 0) ||
        (availability === 'borrowed' && book.availableCopies === 0);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }, [searchQuery, selectedCategory, availability]);

  const handleBorrow = (bookId: string) => {
    const book = mockBooks.find(b => b.id === bookId);
    toast.success(`Borrow request sent for "${book?.title}"`);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setAvailability('all');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="page-header">Book Catalog</h1>
            <p className="page-subtitle">
              Browse our collection of {mockBooks.length} books
            </p>
          </div>
          {isAdmin && (
            <Button asChild variant="accent" size="lg">
              <Link to="/books/add">
                <Plus className="w-5 h-5 mr-2" />
                Add New Book
              </Link>
            </Button>
          )}
        </div>

        {/* Filters */}
        <BookFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          availability={availability}
          onAvailabilityChange={setAvailability}
          onClearFilters={clearFilters}
        />

        {/* Results Count */}
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            Showing {filteredBooks.length} of {mockBooks.length} books
          </p>
        </div>

        {/* Book Grid */}
        <BookGrid
          books={filteredBooks}
          onBorrow={handleBorrow}
          showActions={user?.role === 'student'}
        />
      </div>
    </DashboardLayout>
  );
}
