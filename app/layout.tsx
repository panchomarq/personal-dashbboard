import { lato } from '@/lib/fonts';
import '@/app/ui/global.css';
import SideNav from '@/components/dashboard/SideNav';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${lato.className} antialiased`}>
      <body className="bg-white text-slate">
        <div className="flex-col-2 flex h-screen md:flex-row md:overflow-hidden">
          <div className="flex-none border-r border-navy-900">
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
