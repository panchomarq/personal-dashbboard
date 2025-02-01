'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import OpenSidebar from '@/components/sidebar/OpenSidebar';
import CloseSidebar from '@/components/sidebar/CloseSidebar';
import SpaceDashboardIcon from '@/components/sidebar/LogoDashboard';
import AttachMoneyIcon from '@/components/sidebar/LogoMoney';
import CurrencyBitcoinIcon from '@/components/sidebar/LogoBitcoin';
import { PowerIcon } from '@heroicons/react/24/outline';
import { signOut } from 'next-auth/react';

export default function SideNav() {
  const currentPath = usePathname();
  const [isSidebarOpen, setIsOpen] = useState(true);
  const isActive = (route: string): boolean => currentPath === route;

  const sidebarVariants = {
    open: { width: '190px', transition: { duration: 0.1, stiffness: 20 } },
    closed: { width: '75px', transition: { duration: 0.1, stiffness: 20 } },
  };

  const toggleSidebar = () => {
    setIsOpen(!isSidebarOpen);
  };

  const itemVariants = {
    open: {
      opacity: 1,
      height: 'auto',
      width: '100%',
      transition: { duration: 0.15 },
    },
    closed: {
      opacity: 0,
      height: 'auto',
      width: '100%',
      transition: { duration: 0.15 },
    },
  };

  const SidebarItem: React.FC<{
    href: string;
    icon: React.JSX.Element;
    title: string;
    beta?: boolean;
    newTab?: boolean;
    enable?: boolean;
  }> = ({ href, icon, title, beta = false, newTab, enable = true }) => {
    if (!enable) return <></>;
    const active = isActive(href);
    return (
      <Link
        className={`"mb-2 md:h-40" flex h-20 items-center justify-between rounded-md p-2 ${
          active
            ? 'text-main-red-400 bg-main-red-50'
            : 'hover:bg-sky-100 hover:text-blue-600 text-gray-950'
        } ${isSidebarOpen ? 'flex-row' : 'flex-col'}`}
        href={href}
        target={newTab ? '_blank' : '_self'}
        title={`${title}`}
      >
        <div className="flex h-10 w-10 items-center rounded-md">{icon}</div>
        <motion.div
          className="font-medium line-clamp-1 w-full whitespace-nowrap px-2 text-xs"
          variants={itemVariants}
          animate={isSidebarOpen ? 'open' : 'closed'}
          initial={'closed'}
        >
          {title}
        </motion.div>
      </Link>
    );
  };

  return (
    <motion.aside
      variants={sidebarVariants}
      animate={isSidebarOpen ? 'open' : 'closed'}
      className="flex h-full flex-col gap-y-6 border-r-[1px] border-gray-200 px-6 py-5"
    >
      <button
        className="flex items-center justify-between py-1"
        onClick={toggleSidebar}
      >
        <div className="h-[100px] flex items-center" style={{ width: isSidebarOpen ? '190px' : '75px' }}>
          {isSidebarOpen && (
            <Image
              src="/trendline_logo.png"
              alt="logo"
              width={'100'}
              height={'100'}
              quality={'100'}
            />
          )}
        </div>
        <div className={'w-6 flex items-center text-gray-200'}>
          {isSidebarOpen ? (
            <CloseSidebar width={'100'} height={'100'} />
          ) : (
            <OpenSidebar width={'100'} height={'100'} />
          )}
        </div>
      </button>
      <motion.nav
        initial={false}
        className={`flex h-full w-full flex-col justify-between gap-y-6 ${
          isSidebarOpen ? 'w-30' : 'w-20'
        }`}
      >
        <motion.div className="flex flex-col justify-between align-baseline">
          <SidebarItem
            href={'/'}
            title={'Dashboard'}
            icon={<SpaceDashboardIcon width={'100'} height={'100'} />}
          />
          <SidebarItem
            href={'/outcomes'}
            title={'Outcomes'}
            icon={<AttachMoneyIcon width={'100'} height={'100'} />}
          />
          <SidebarItem
            href={'/incomes'}
            title={'Incomes'}
            icon={<CurrencyBitcoinIcon width={'100'} height={'100'} />}
          />
        </motion.div>
      </motion.nav>
      <form
        className={`flex ${isSidebarOpen ? 'justify-start' : 'justify-center'}`}
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          signOut();
        }}
      >
        <button
          className={`flex h-[48px] items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 ${
            isSidebarOpen ? 'w-30' : 'w-15'
          }`}
          type="submit"
        >
          <PowerIcon className="w-6" />
          {isSidebarOpen && (
            <div className="hidden md:block">Sign Out</div>
          )}
        </button>
      </form>
    </motion.aside>
  );
}