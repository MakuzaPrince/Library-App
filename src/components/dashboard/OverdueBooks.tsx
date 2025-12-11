import { BorrowRecord } from '@/types/library';
import { mockBooks, mockUsers } from '@/data/mockData';
import { format, differenceInDays } from 'date-fns';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface OverdueBooksProps {
  records: BorrowRecord[];
}

export function OverdueBooks({ records }: OverdueBooksProps) {
  const overdueRecords = records.filter(r => r.status === 'overdue');

  if (overdueRecords.length === 0) {
    return (
      <div className="bg-card rounded-xl shadow-md border border-border/50 p-6">
        <h2 className="font-serif text-xl font-bold mb-4">Overdue Books</h2>
        <div className="text-center py-8">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-success/10 flex items-center justify-center">
            <span className="text-xl">✓</span>
          </div>
          <p className="text-muted-foreground">No overdue books</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-xl shadow-md border border-destructive/20 overflow-hidden">
      <div className="p-6 border-b border-border bg-destructive/5">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-destructive" />
          <h2 className="font-serif text-xl font-bold">Overdue Books</h2>
          <span className="ml-auto badge-overdue">{overdueRecords.length} overdue</span>
        </div>
      </div>
      <div className="divide-y divide-border">
        {overdueRecords.map((record) => {
          const book = mockBooks.find(b => b.id === record.bookId);
          const user = mockUsers.find(u => u.id === record.userId);
          const daysOverdue = differenceInDays(new Date(), record.dueDate);

          return (
            <div key={record.id} className="p-4 flex items-center gap-4">
              <img
                src={book?.coverImage}
                alt={book?.title}
                className="w-12 h-16 object-cover rounded"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{book?.title}</p>
                <p className="text-sm text-muted-foreground">
                  {user?.name}
                </p>
                <p className="text-xs text-destructive">
                  {daysOverdue} days overdue • Due: {format(record.dueDate, 'MMM d')}
                </p>
              </div>
              <Button variant="outline" size="sm">
                Send Reminder
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
