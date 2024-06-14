import { montserrat } from '@/lib/fonts';
import '@/app/ui/global.css';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.className} antialiased`} >
      <body>{children}</body>
    </html>
  );
}