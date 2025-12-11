import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockBorrowRecords, mockBooks, mockUsers } from '@/data/mockData';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Check, X, Clock, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';
import { BorrowRecord } from '@/types/library';

export default function BorrowRequests() {
  const [records, setRecords] = useState<BorrowRecord[]>(mockBorrowRecords);
  
  const pendingRequests = records.filter((r) => r.status === 'pending');
  const activeRequests = records.filter((r) => r.status === 'approved' || r.status === 'overdue');

  const handleApprove = (recordId: string) => {
    setRecords((prev) =>
      prev.map((r) => (r.id === recordId ? { ...r, status: 'approved' as const } : r))
    );
    toast.success('Request approved successfully');
  };

  const handleReject = (recordId: string) => {
    setRecords((prev) => prev.filter((r) => r.id !== recordId));
    toast.success('Request rejected');
  };

  const handleReturn = (recordId: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId ? { ...r, status: 'returned' as const, returnDate: new Date() } : r
      )
    );
    toast.success('Book marked as returned');
  };

  const handleRenew = (recordId: string) => {
    setRecords((prev) =>
      prev.map((r) =>
        r.id === recordId
          ? {
              ...r,
              dueDate: new Date(r.dueDate.getTime() + 14 * 24 * 60 * 60 * 1000),
              renewalCount: r.renewalCount + 1,
            }
          : r
      )
    );
    toast.success('Due date extended by 14 days');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="page-header">Borrow Requests</h1>
          <p className="page-subtitle">Manage book borrow requests and returns</p>
        </div>

        {/* Pending Requests */}
        <div className="bg-card rounded-xl shadow-md border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-warning" />
              <h2 className="font-serif text-xl font-bold">Pending Requests</h2>
            </div>
            <Badge variant="secondary">{pendingRequests.length} pending</Badge>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No pending requests
            </div>
          ) : (
            <div className="divide-y divide-border">
              {pendingRequests.map((record) => {
                const book = mockBooks.find((b) => b.id === record.bookId);
                const user = mockUsers.find((u) => u.id === record.userId);

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
                      <p className="text-sm">
                        <span className="text-muted-foreground">Requested by: </span>
                        <span className="font-medium">{user?.name}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(record.borrowDate, 'MMM d, yyyy')}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleApprove(record.id)}
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(record.id)}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Active Borrows */}
        <div className="bg-card rounded-xl shadow-md border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold">Active Borrows</h2>
            <Badge variant="secondary">{activeRequests.length} active</Badge>
          </div>

          {activeRequests.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No active borrows
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                      Book
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                      Borrower
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                      Due Date
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {activeRequests.map((record) => {
                    const book = mockBooks.find((b) => b.id === record.bookId);
                    const user = mockUsers.find((u) => u.id === record.userId);
                    const isOverdue = record.status === 'overdue';

                    return (
                      <tr key={record.id} className="hover:bg-muted/30">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={book?.coverImage}
                              alt={book?.title}
                              className="w-10 h-14 object-cover rounded"
                            />
                            <div>
                              <p className="font-medium">{book?.title}</p>
                              <p className="text-sm text-muted-foreground">{book?.author}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium">{user?.name}</p>
                          <p className="text-sm text-muted-foreground">{user?.email}</p>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {format(record.dueDate, 'MMM d, yyyy')}
                          {record.renewalCount > 0 && (
                            <span className="text-xs text-muted-foreground block">
                              (Renewed {record.renewalCount}x)
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <span className={isOverdue ? 'badge-overdue' : 'badge-borrowed'}>
                            {isOverdue ? 'Overdue' : 'Borrowed'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRenew(record.id)}
                            >
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Renew
                            </Button>
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => handleReturn(record.id)}
                            >
                              <Check className="w-4 h-4 mr-1" />
                              Return
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
