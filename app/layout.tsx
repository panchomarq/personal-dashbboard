import '@/app/ui/global.css';
import { montserrat } from '@/app/ui-OLD/fonts';


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={montserrat.className}>
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}