import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { mockBooks, mockBorrowRecords, mockUsers, mockCategories } from '@/data/mockData';
import { StatCard } from '@/components/dashboard/StatCard';
import {
  BookOpen,
  Users,
  TrendingUp,
  AlertTriangle,
  PieChart,
  BarChart3,
  Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function Reports() {
  // Calculate statistics
  const totalBooks = mockBooks.reduce((acc, book) => acc + book.totalCopies, 0);
  const totalBorrowed = mockBorrowRecords.filter(
    (r) => r.status === 'approved' || r.status === 'overdue'
  ).length;
  const overdueCount = mockBorrowRecords.filter((r) => r.status === 'overdue').length;
  const totalReturned = mockBorrowRecords.filter((r) => r.status === 'returned').length;

  // Category distribution
  const categoryStats = mockCategories.map((cat) => ({
    name: cat.name,
    count: mockBooks.filter((b) => b.category === cat.name).length,
  }));

  // User activity
  const userActivity = mockUsers
    .map((user) => ({
      ...user,
      borrowCount: mockBorrowRecords.filter((r) => r.userId === user.id).length,
    }))
    .sort((a, b) => b.borrowCount - a.borrowCount)
    .slice(0, 5);

  const handleExport = (type: string) => {
    toast.success(`Exporting ${type} report...`);
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="page-header">Reports & Analytics</h1>
            <p className="page-subtitle">Library statistics and performance insights</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => handleExport('summary')}>
              <Download className="w-4 h-4 mr-2" />
              Export Summary
            </Button>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Books"
            value={totalBooks}
            icon={BookOpen}
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Active Users"
            value={mockUsers.length}
            icon={Users}
            variant="accent"
          />
          <StatCard
            title="Total Transactions"
            value={mockBorrowRecords.length}
            icon={TrendingUp}
            variant="success"
          />
          <StatCard
            title="Overdue Books"
            value={overdueCount}
            icon={AlertTriangle}
            variant="destructive"
          />
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Distribution */}
          <div className="bg-card rounded-xl shadow-md border border-border/50 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <PieChart className="w-5 h-5 text-accent" />
                <h2 className="font-serif text-xl font-bold">Books by Category</h2>
              </div>
            </div>
            <div className="space-y-4">
              {categoryStats.map((cat) => {
                const percentage = Math.round((cat.count / mockBooks.length) * 100);
                return (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{cat.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {cat.count} books ({percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Borrowing Summary */}
          <div className="bg-card rounded-xl shadow-md border border-border/50 p-6">
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-5 h-5 text-accent" />
              <h2 className="font-serif text-xl font-bold">Borrowing Summary</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-success/10 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-success">{totalReturned}</p>
                <p className="text-sm text-muted-foreground">Books Returned</p>
              </div>
              <div className="bg-warning/10 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-warning">{totalBorrowed}</p>
                <p className="text-sm text-muted-foreground">Currently Borrowed</p>
              </div>
              <div className="bg-destructive/10 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-destructive">{overdueCount}</p>
                <p className="text-sm text-muted-foreground">Overdue</p>
              </div>
              <div className="bg-accent/10 rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-accent">
                  {mockBorrowRecords.filter((r) => r.status === 'pending').length}
                </p>
                <p className="text-sm text-muted-foreground">Pending Requests</p>
              </div>
            </div>
          </div>
        </div>

        {/* Most Active Users */}
        <div className="bg-card rounded-xl shadow-md border border-border/50 overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="font-serif text-xl font-bold">Most Active Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                    Rank
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">
                    Total Borrows
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {userActivity.map((user, index) => (
                  <tr key={user.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <span
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                          index === 0
                            ? 'bg-accent text-accent-foreground'
                            : index === 1
                            ? 'bg-muted text-foreground'
                            : index === 2
                            ? 'bg-warning/20 text-warning'
                            : 'bg-muted/50 text-muted-foreground'
                        }`}
                      >
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-medium text-primary">
                            {user.name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize">{user.role}</td>
                    <td className="px-6 py-4 font-bold">{user.borrowCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
