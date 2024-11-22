import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import {
  Activity,
  Pill,
  Moon,
  FileText,
  Download,
  LogOut,
  Menu,
} from 'lucide-react';

function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);

  const navigation = [
    { name: 'Crises', href: '/crises', icon: Activity },
    { name: 'Medications', href: '/medications', icon: Pill },
    { name: 'Sleep', href: '/sleep', icon: Moon },
    { name: 'Notes', href: '/notes', icon: FileText },
    { name: 'Export', href: '/export', icon: Download },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-indigo-600 lg:hidden">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="text-white font-semibold">Wendy's Health Tracker</div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white p-2"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      <div className="flex h-screen">
        <aside
          className={`${
            isMobileMenuOpen ? 'block' : 'hidden'
          } lg:block lg:w-64 bg-white border-r border-gray-200 fixed lg:sticky top-0 h-screen overflow-y-auto`}
        >
          <div className="px-6 py-6">
            <h1 className="text-2xl font-bold text-indigo-600 hidden lg:block">
              Wendy's Health
            </h1>
            <div className="mt-6">
              <div className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`${
                        location.pathname === item.href
                          ? 'bg-indigo-50 text-indigo-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      } group flex items-center px-3 py-2 text-sm font-medium rounded-md`}
                    >
                      <Icon
                        className={`${
                          location.pathname === item.href
                            ? 'text-indigo-600'
                            : 'text-gray-400 group-hover:text-gray-500'
                        } mr-3 h-5 w-5 flex-shrink-0`}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <button
                onClick={logout}
                className="ml-2 p-2 text-gray-400 hover:text-gray-500"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;