export type UserRole = 'admin' | 'librarian' | 'student';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  avatar?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  description: string;
  coverImage: string;
  totalCopies: number;
  availableCopies: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface BorrowRecord {
  id: string;
  bookId: string;
  userId: string;
  borrowDate: Date;
  dueDate: Date;
  returnDate?: Date;
  renewalCount: number;
  status: 'pending' | 'approved' | 'returned' | 'overdue';
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  bookCount: number;
}

export interface DashboardStats {
  totalBooks: number;
  totalUsers: number;
  currentlyBorrowed: number;
  overdueBooks: number;
  pendingRequests: number;
}
