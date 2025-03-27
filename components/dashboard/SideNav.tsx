'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { 
  ChevronRightIcon, 
  ChevronLeftIcon, 
  LayoutDashboard, 
  ArrowDownLeft, 
  ArrowUpRight,
  LogOut,
  CreditCardIcon
} from 'lucide-react';
import LogoDashboard from '@/components/sidebar/LogoDashboard';

export default function SideNav() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  // Navigation links configuration
  const navItems = [
    {
      name: 'Dashboard',
      href: '/',
      icon: <LayoutDashboard size={20} />,
    },
    {
      name: 'Transactions',
      href: '/transactions',
      icon: <CreditCardIcon size={20} />,
    },
    {
      name: 'Outcomes',
      href: '/outcomes',
      icon: <ArrowDownLeft size={20} />,
    },
    {
      name: 'Incomes',
      href: '/incomes',
      icon: <ArrowUpRight size={20} />,
    },
  ];

  // Function to handle sign out
  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div 
      className={`h-full flex flex-col bg-white transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Logo and collapse button */}
      <div className="flex items-center justify-between p-4 border-b border-navy-900">
        <div className="flex items-center overflow-hidden">
          <LogoDashboard fill="#205781" width="24px" height="24px" />
          <h1 
            className={`text-xl font-bold ml-2 text-navy-900 whitespace-nowrap transition-opacity duration-300 ${
              isCollapsed ? 'opacity-0 w-0' : 'opacity-100'
            }`}
          >
            Financial This
          </h1>
        </div>
        <button
          onClick={toggleSidebar}
          className="p-1 rounded-full hover:bg-navy-100 text-navy-900 flex-shrink-0"
          aria-label={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? <ChevronRightIcon size={20} /> : <ChevronLeftIcon size={20} />}
        </button>
      </div>

      {/* Navigation links */}
      <nav className="flex-grow mt-6 overflow-hidden">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link 
                  href={item.href}
                  className={`
                    flex items-center px-3 py-2 rounded-md text-sm
                    ${isActive 
                      ? 'bg-navy-100 text-navy-900 font-medium' 
                      : 'text-slate hover:bg-navy-50 hover:text-navy-900'}
                    ${isCollapsed ? 'justify-center' : ''}
                  `}
                >
                  <span className={`${isActive ? 'text-navy-900' : 'text-navy-700'} flex-shrink-0`}>
                    {item.icon}
                  </span>
                  <span 
                    className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${
                      isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User account section */}
      <div className="p-4 border-t border-navy-900">
        <button
          onClick={handleSignOut}
          className={`
            flex items-center px-3 py-2 rounded-md text-sm text-navy-900 
            hover:bg-navy-100 w-full
            ${isCollapsed ? 'justify-center' : ''}
          `}
        >
          <LogOut size={20} className="flex-shrink-0" />
          <span 
            className={`ml-3 whitespace-nowrap transition-opacity duration-300 ${
              isCollapsed ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
            }`}
          >
            Sign Out
          </span>
        </button>
      </div>
    </div>
  );
}