import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Clock,
  History,
  Settings,
  LogOut,
  BookPlus,
  FileText,
  Library,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const adminLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/books', icon: BookOpen, label: 'Books' },
  { to: '/books/add', icon: BookPlus, label: 'Add Book' },
  { to: '/borrow-requests', icon: Clock, label: 'Borrow Requests' },
  { to: '/users', icon: Users, label: 'Users' },
  { to: '/history', icon: History, label: 'Borrow History' },
  { to: '/reports', icon: FileText, label: 'Reports' },
];

const studentLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'My Dashboard' },
  { to: '/books', icon: BookOpen, label: 'Browse Books' },
  { to: '/my-books', icon: Library, label: 'My Borrowed Books' },
  { to: '/history', icon: History, label: 'My History' },
];

export function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const links = user?.role === 'student' ? studentLinks : adminLinks;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => {
              // only auto-close on small screens (mobile). On desktop keep collapsed/expanded state.
              try {
                if (window.matchMedia && window.matchMedia('(max-width: 767px)').matches) {
                  setIsOpen(false);
                }
              } catch (e) {
                // fallback: do not change state
              }
            }}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground flex flex-col z-40 transition-all duration-300 ease-in-out",
          // width: full when open, narrow when collapsed (desktop);
          isOpen ? "w-64 translate-x-0" : "w-20 -translate-x-full md:translate-x-0"
        )}
      >
        {/* Header: show full logo when open, only toggle when collapsed */}
        <div className="p-4 border-b border-sidebar-border flex items-center">
          {isOpen ? (
            <Link to="/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-sidebar-primary-foreground" />
              </div>
              <div className="ml-3 transition-all">
                <h1 className="font-serif font-bold text-lg">LibraryHub</h1>
                <p className="text-xs text-sidebar-foreground/60 capitalize">{user?.role} Portal</p>
              </div>
            </Link>
          ) : (
            // collapsed: no logo or text, keep header compact
            <div className="w-full" />
          )}

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="ml-auto p-2 rounded-md hover:bg-sidebar-border transition-colors"
            aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.to;
          return (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => {
                // do not open sidebar on desktop when a link is clicked; only auto-close on small screens
                try {
                  if (window.matchMedia && window.matchMedia('(max-width: 767px)').matches) {
                    setIsOpen(false);
                  }
                } catch (e) {
                  // ignore
                }
              }}
              className={cn(
                'sidebar-link flex items-center',
                // center icons when collapsed; normal layout when open
                !isOpen ? 'justify-center' : 'justify-start',
                isActive && 'sidebar-link-active'
              )}
            >
                <Icon className="w-5 h-5" />
                <span className={cn(isOpen ? 'ml-3 transition-all' : 'hidden')}>{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-sidebar-border">
        <div className={cn('flex items-center gap-3 mb-4', !isOpen && 'justify-center')}>
          <div className="w-10 h-10 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sm font-medium">{user?.name?.charAt(0)}</span>
          </div>
          {isOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-xs text-sidebar-foreground/60 truncate">{user?.email}</p>
            </div>
          )}
        </div>
        <button
          onClick={() => {
            logout();
            try {
              if (window.matchMedia && window.matchMedia('(max-width: 767px)').matches) {
                setIsOpen(false);
              }
            } catch (e) {
              // ignore
            }
          }}
          className={cn('sidebar-link w-full text-destructive hover:bg-destructive/10', !isOpen && 'justify-center')}
        >
          <LogOut className="w-5 h-5" />
          {isOpen && <span className="ml-3">Sign Out</span>}
        </button>
      </div>
      </aside>
    </>
  );
}
