import { useAuth } from '@/contexts/AuthContext';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatCard } from '@/components/dashboard/StatCard';
import { RecentActivity } from '@/components/dashboard/RecentActivity';
import { OverdueBooks } from '@/components/dashboard/OverdueBooks';
import { BookGrid } from '@/components/books/BookGrid';
import { mockBooks, mockBorrowRecords, mockUsers } from '@/data/mockData';
import { BookOpen, Users, Clock, AlertTriangle, TrendingUp, Library } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin' || user?.role === 'librarian';

  // Calculate stats
  const totalBooks = mockBooks.reduce((acc, book) => acc + book.totalCopies, 0);
  const currentlyBorrowed = mockBorrowRecords.filter(r => r.status === 'approved' || r.status === 'overdue').length;
  const overdueBooks = mockBorrowRecords.filter(r => r.status === 'overdue').length;
  const pendingRequests = mockBorrowRecords.filter(r => r.status === 'pending').length;

  // Student-specific data
  const studentBorrows = mockBorrowRecords.filter(r => r.userId === user?.id);
  const studentCurrentlyBorrowed = studentBorrows.filter(r => r.status === 'approved' || r.status === 'overdue');

  if (isAdmin) {
    return (
      <DashboardLayout>
        <div className="space-y-8">
          {/* Header */}
          <div>
            <h1 className="page-header">Dashboard</h1>
            <p className="page-subtitle">Welcome back, {user?.name}. Here's what's happening today.</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="animate-slide-up opacity-0 stagger-1" style={{ animationFillMode: 'forwards' }}>
              <StatCard
                title="Total Books"
                value={totalBooks}
                icon={BookOpen}
                trend={{ value: 12, isPositive: true }}
              />
            </div>
            <div className="animate-slide-up opacity-0 stagger-2" style={{ animationFillMode: 'forwards' }}>
              <StatCard
                title="Total Users"
                value={mockUsers.length}
                icon={Users}
                trend={{ value: 8, isPositive: true }}
                variant="accent"
              />
            </div>
            <div className="animate-slide-up opacity-0 stagger-3" style={{ animationFillMode: 'forwards' }}>
              <StatCard
                title="Currently Borrowed"
                value={currentlyBorrowed}
                icon={Clock}
                variant="warning"
              />
            </div>
            <div className="animate-slide-up opacity-0 stagger-4" style={{ animationFillMode: 'forwards' }}>
              <StatCard
                title="Overdue Books"
                value={overdueBooks}
                icon={AlertTriangle}
                variant="destructive"
              />
            </div>
          </div>

          {/* Pending Requests Alert */}
          {pendingRequests > 0 && (
            <div className="bg-accent/10 border border-accent/20 rounded-xl p-4 flex items-center justify-between animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium">You have {pendingRequests} pending borrow requests</p>
                  <p className="text-sm text-muted-foreground">Review and approve student requests</p>
                </div>
              </div>
              <Button asChild variant="accent">
                <Link to="/borrow-requests">Review Requests</Link>
              </Button>
            </div>
          )}

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <RecentActivity records={mockBorrowRecords} />
            <OverdueBooks records={mockBorrowRecords} />
          </div>

          {/* Popular Books */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold">Popular Books</h2>
                <p className="text-muted-foreground">Most borrowed titles this month</p>
              </div>
              <Button asChild variant="outline">
                <Link to="/books">View All Books</Link>
              </Button>
            </div>
            <BookGrid books={mockBooks.slice(0, 4)} showActions={false} />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Student Dashboard
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="page-header">My Dashboard</h1>
          <p className="page-subtitle">Welcome back, {user?.name}. Manage your borrowed books and discover new reads.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="animate-slide-up opacity-0 stagger-1" style={{ animationFillMode: 'forwards' }}>
            <StatCard
              title="Currently Borrowed"
              value={studentCurrentlyBorrowed.length}
              icon={Library}
              variant="accent"
            />
          </div>
          <div className="animate-slide-up opacity-0 stagger-2" style={{ animationFillMode: 'forwards' }}>
            <StatCard
              title="Total Borrowed"
              value={studentBorrows.length}
              icon={TrendingUp}
            />
          </div>
          <div className="animate-slide-up opacity-0 stagger-3" style={{ animationFillMode: 'forwards' }}>
            <StatCard
              title="Available to Borrow"
              value={3 - studentCurrentlyBorrowed.length}
              icon={BookOpen}
              variant="success"
            />
          </div>
        </div>

        {/* My Borrowed Books */}
        {studentCurrentlyBorrowed.length > 0 && (
          <div className="bg-card rounded-xl shadow-md border border-border/50 overflow-hidden">
            <div className="p-6 border-b border-border">
              <h2 className="font-serif text-xl font-bold">My Borrowed Books</h2>
            </div>
            <div className="divide-y divide-border">
              {studentCurrentlyBorrowed.map((record) => {
                const book = mockBooks.find(b => b.id === record.bookId);
                const isOverdue = record.status === 'overdue';
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
                      <p className={`text-sm ${isOverdue ? 'text-destructive' : 'text-muted-foreground'}`}>
                        Due: {record.dueDate.toLocaleDateString()}
                        {isOverdue && ' (Overdue!)'}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">Renew</Button>
                      <Button variant="secondary" size="sm">Return</Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Browse Books */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="font-serif text-2xl font-bold">Discover Books</h2>
              <p className="text-muted-foreground">Explore our collection and find your next read</p>
            </div>
            <Button asChild variant="accent">
              <Link to="/books">Browse All Books</Link>
            </Button>
          </div>
          <BookGrid books={mockBooks.slice(0, 4)} />
        </div>
      </div>
    </DashboardLayout>
  );
}
