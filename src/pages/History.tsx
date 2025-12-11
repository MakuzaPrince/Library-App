import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockBorrowRecords, mockBooks, mockUsers } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';
import { Search, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function History() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'librarian';

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter records based on user role
  const userRecords = isAdmin
    ? mockBorrowRecords
    : mockBorrowRecords.filter((r) => r.userId === user?.id);

  const filteredRecords = userRecords.filter((record) => {
    const book = mockBooks.find((b) => b.id === record.bookId);
    const borrower = mockUsers.find((u) => u.id === record.userId);

    const matchesSearch =
      !searchQuery ||
      book?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book?.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      borrower?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || record.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'returned':
        return <span className="badge-available">Returned</span>;
      case 'approved':
        return <span className="badge-borrowed">Borrowed</span>;
      case 'overdue':
        return <span className="badge-overdue">Overdue</span>;
      case 'pending':
        return (
          <Badge variant="outline" className="text-warning border-warning">
            Pending
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleExport = () => {
    toast.success('Export feature coming soon!');
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="page-header">{isAdmin ? 'Borrow History' : 'My History'}</h1>
            <p className="page-subtitle">
              {isAdmin
                ? 'Complete record of all library transactions'
                : 'Your borrowing history and records'}
            </p>
          </div>
          {isAdmin && (
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-5 h-5 mr-2" />
              Export CSV
            </Button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-card rounded-xl p-6 shadow-md border border-border/50">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by book title, author, or borrower..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-12"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 h-12">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="approved">Borrowed</SelectItem>
                <SelectItem value="returned">Returned</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* History Table */}
        <div className="bg-card rounded-xl shadow-md border border-border/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Book
                  </th>
                  {isAdmin && (
                    <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                      Borrower
                    </th>
                  )}
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Borrow Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Due Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Return Date
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Renewals
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredRecords.map((record) => {
                  const book = mockBooks.find((b) => b.id === record.bookId);
                  const borrower = mockUsers.find((u) => u.id === record.userId);

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
                      {isAdmin && (
                        <td className="px-6 py-4">
                          <p className="font-medium">{borrower?.name}</p>
                          <p className="text-sm text-muted-foreground">{borrower?.email}</p>
                        </td>
                      )}
                      <td className="px-6 py-4 text-sm">
                        {format(record.borrowDate, 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {format(record.dueDate, 'MMM d, yyyy')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        {record.returnDate
                          ? format(record.returnDate, 'MMM d, yyyy')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 text-sm">{record.renewalCount}</td>
                      <td className="px-6 py-4">{getStatusBadge(record.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {filteredRecords.length === 0 && (
            <div className="p-8 text-center text-muted-foreground">
              No records found
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
