import { BorrowRecord, Book, User } from '@/types/library';
import { mockBooks, mockUsers } from '@/data/mockData';
import { format } from 'date-fns';
import { BookOpen, RotateCcw, CheckCircle, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentActivityProps {
  records: BorrowRecord[];
}

const statusConfig = {
  pending: { icon: Clock, color: 'text-warning', bg: 'bg-warning/10', label: 'Pending' },
  approved: { icon: BookOpen, color: 'text-success', bg: 'bg-success/10', label: 'Borrowed' },
  returned: { icon: CheckCircle, color: 'text-muted-foreground', bg: 'bg-muted', label: 'Returned' },
  overdue: { icon: RotateCcw, color: 'text-destructive', bg: 'bg-destructive/10', label: 'Overdue' },
};

export function RecentActivity({ records }: RecentActivityProps) {
  const getBook = (bookId: string): Book | undefined => mockBooks.find(b => b.id === bookId);
  const getUser = (userId: string): User | undefined => mockUsers.find(u => u.id === userId);

  return (
    <div className="bg-card rounded-xl shadow-md border border-border/50 overflow-hidden">
      <div className="p-6 border-b border-border">
        <h2 className="font-serif text-xl font-bold">Recent Activity</h2>
      </div>
      <div className="divide-y divide-border">
        {records.slice(0, 5).map((record) => {
          const book = getBook(record.bookId);
          const user = getUser(record.userId);
          const config = statusConfig[record.status];
          const Icon = config.icon;

          return (
            <div key={record.id} className="p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors">
              <div className={cn('w-10 h-10 rounded-full flex items-center justify-center', config.bg)}>
                <Icon className={cn('w-5 h-5', config.color)} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{book?.title}</p>
                <p className="text-sm text-muted-foreground truncate">
                  {user?.name} • {format(record.borrowDate, 'MMM d, yyyy')}
                </p>
              </div>
              <span className={cn('text-xs font-medium px-2 py-1 rounded-full', config.bg, config.color)}>
                {config.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
