import { useParams, Link, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockBooks, mockBorrowRecords, mockUsers } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft, BookOpen, Edit, Trash2, Calendar, User, Hash } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'librarian';

  const book = mockBooks.find((b) => b.id === id);

  if (!book) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">
          <h1 className="font-serif text-2xl font-bold mb-4">Book Not Found</h1>
          <Button asChild variant="outline">
            <Link to="/books">Back to Books</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const borrowHistory = mockBorrowRecords
    .filter((r) => r.bookId === book.id)
    .map((record) => ({
      ...record,
      user: mockUsers.find((u) => u.id === record.userId),
    }));

  const handleBorrow = () => {
    toast.success(`Borrow request sent for "${book.title}"`);
  };

  const handleDelete = () => {
    toast.success(`"${book.title}" has been deleted`);
    navigate('/books');
  };

  const isAvailable = book.availableCopies > 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Back Button */}
        <Button asChild variant="ghost" size="sm">
          <Link to="/books">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Books
          </Link>
        </Button>

        {/* Book Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cover Image */}
          <div className="lg:col-span-1">
            <div className="aspect-[3/4] rounded-xl overflow-hidden shadow-xl">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Info */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <div className="flex flex-wrap items-center gap-3 mb-3">
                <Badge variant="outline">{book.category}</Badge>
                {isAvailable ? (
                  <span className="badge-available">
                    {book.availableCopies} Available
                  </span>
                ) : (
                  <span className="badge-borrowed">All Copies Borrowed</span>
                )}
              </div>
              <h1 className="font-serif text-4xl font-bold mb-2">{book.title}</h1>
              <p className="text-xl text-muted-foreground">by {book.author}</p>
            </div>

            <p className="text-lg leading-relaxed">{book.description}</p>

            {/* Meta Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Hash className="w-4 h-4" />
                  <span className="text-sm">ISBN</span>
                </div>
                <p className="font-medium">{book.isbn}</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm">Total Copies</span>
                </div>
                <p className="font-medium">{book.totalCopies}</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <User className="w-4 h-4" />
                  <span className="text-sm">Borrowed</span>
                </div>
                <p className="font-medium">{book.totalCopies - book.availableCopies}</p>
              </div>
              <div className="bg-muted rounded-lg p-4">
                <div className="flex items-center gap-2 text-muted-foreground mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">Added</span>
                </div>
                <p className="font-medium">{format(book.createdAt, 'MMM yyyy')}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {user?.role === 'student' && isAvailable && (
                <Button onClick={handleBorrow} variant="accent" size="lg">
                  <BookOpen className="w-5 h-5 mr-2" />
                  Borrow This Book
                </Button>
              )}
              {isAdmin && (
                <>
                  <Button asChild variant="outline" size="lg">
                    <Link to={`/books/${book.id}/edit`}>
                      <Edit className="w-5 h-5 mr-2" />
                      Edit Book
                    </Link>
                  </Button>
                  <Button onClick={handleDelete} variant="destructive" size="lg">
                    <Trash2 className="w-5 h-5 mr-2" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Borrow History (Admin Only) */}
        {isAdmin && borrowHistory.length > 0 && (
          <div className="bg-card rounded-xl shadow-md border border-border/50 overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-serif text-xl font-bold">Borrow History</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">User</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Borrow Date</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Due Date</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Return Date</th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {borrowHistory.map((record) => (
                    <tr key={record.id} className="hover:bg-muted/30">
                      <td className="px-6 py-4">
                        <p className="font-medium">{record.user?.name}</p>
                        <p className="text-sm text-muted-foreground">{record.user?.email}</p>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {format(record.borrowDate, 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {format(record.dueDate, 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {record.returnDate ? format(record.returnDate, 'MMM d, yyyy') : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={
                            record.status === 'returned'
                              ? 'badge-available'
                              : record.status === 'overdue'
                              ? 'badge-overdue'
                              : 'badge-borrowed'
                          }
                        >
                          {record.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
