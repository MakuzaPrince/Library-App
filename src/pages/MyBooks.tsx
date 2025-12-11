import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockBorrowRecords, mockBooks } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { format, differenceInDays } from 'date-fns';
import { RotateCcw, CheckCircle, AlertTriangle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { BorrowRecord } from '@/types/library';

export default function MyBooks() {
  const { user } = useAuth();
  const [records, setRecords] = useState<BorrowRecord[]>(
    mockBorrowRecords.filter(
      (r) => r.userId === user?.id && (r.status === 'approved' || r.status === 'overdue' || r.status === 'pending')
    )
  );

  const handleRenewRequest = (recordId: string) => {
    toast.success('Renewal request sent. Awaiting approval.');
  };

  const handleReturnRequest = (recordId: string) => {
    toast.success('Return request submitted. Please bring the book to the library.');
  };

  const activeBooks = records.filter((r) => r.status === 'approved' || r.status === 'overdue');
  const pendingBooks = records.filter((r) => r.status === 'pending');

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="page-header">My Borrowed Books</h1>
          <p className="page-subtitle">
            Manage your current borrows and track due dates
          </p>
        </div>

        {/* Borrow Limit Info */}
        <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
            <span className="text-xl font-bold text-accent">{activeBooks.length}/3</span>
          </div>
          <div>
            <p className="font-medium">Borrowing Limit</p>
            <p className="text-sm text-muted-foreground">
              You can borrow up to 3 books at a time. You have {3 - activeBooks.length} slots available.
            </p>
          </div>
        </div>

        {/* Pending Requests */}
        {pendingBooks.length > 0 && (
          <div className="bg-card rounded-xl shadow-md border border-border/50 overflow-hidden">
            <div className="p-6 border-b border-border flex items-center gap-3">
              <Clock className="w-5 h-5 text-warning" />
              <h2 className="font-serif text-xl font-bold">Pending Requests</h2>
            </div>
            <div className="divide-y divide-border">
              {pendingBooks.map((record) => {
                const book = mockBooks.find((b) => b.id === record.bookId);
                return (
                  <div key={record.id} className="p-4 flex items-center gap-4">
                    <img
                      src={book?.coverImage}
                      alt={book?.title}
                      className="w-16 h-20 object-cover rounded-lg shadow-sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-serif font-bold truncate">{book?.title}</p>
                      <p className="text-sm text-muted-foreground">{book?.author}</p>
                      <p className="text-sm text-warning">
                        Awaiting approval from librarian
                      </p>
                    </div>
                    <span className="badge-borrowed">Pending</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Borrows */}
        <div className="bg-card rounded-xl shadow-md border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="font-serif text-xl font-bold">Currently Borrowed</h2>
          </div>

          {activeBooks.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="font-serif text-lg font-bold mb-2">No active borrows</h3>
              <p className="text-muted-foreground mb-4">
                Browse our collection and borrow your next read!
              </p>
              <Button asChild variant="accent">
                <a href="/books">Browse Books</a>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {activeBooks.map((record) => {
                const book = mockBooks.find((b) => b.id === record.bookId);
                const isOverdue = record.status === 'overdue';
                const daysLeft = differenceInDays(record.dueDate, new Date());
                const canRenew = record.renewalCount < 2;

                return (
                  <div key={record.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={book?.coverImage}
                        alt={book?.title}
                        className="w-20 h-28 object-cover rounded-lg shadow-md"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-4 mb-2">
                          <div>
                            <h3 className="font-serif text-lg font-bold">{book?.title}</h3>
                            <p className="text-muted-foreground">{book?.author}</p>
                          </div>
                          {isOverdue ? (
                            <span className="badge-overdue flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Overdue
                            </span>
                          ) : daysLeft <= 3 ? (
                            <span className="badge-borrowed flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {daysLeft} days left
                            </span>
                          ) : (
                            <span className="badge-available flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" />
                              On time
                            </span>
                          )}
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Borrowed</p>
                            <p className="font-medium">{format(record.borrowDate, 'MMM d, yyyy')}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Due Date</p>
                            <p className={`font-medium ${isOverdue ? 'text-destructive' : ''}`}>
                              {format(record.dueDate, 'MMM d, yyyy')}
                            </p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Renewals Used</p>
                            <p className="font-medium">{record.renewalCount} / 2</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">ISBN</p>
                            <p className="font-medium">{book?.isbn.slice(-8)}</p>
                          </div>
                        </div>

                        <div className="flex gap-3 mt-4">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRenewRequest(record.id)}
                            disabled={!canRenew}
                          >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            {canRenew ? 'Request Renewal' : 'Max Renewals'}
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleReturnRequest(record.id)}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Return Book
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
