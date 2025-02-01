import { montserrat } from '@/lib/fonts';
import '@/app/ui/global.css';
import SideNav from '@/components/dashboard/SideNav';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.className} antialiased`}>
      <body>
        {' '}
        <div className="flex-col-2 flex h-screen md:flex-row md:overflow-hidden">
          <div className="w-full flex-none md:w-64">
            <SideNav />
          </div>
          <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
