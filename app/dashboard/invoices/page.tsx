"use client"

import { DashboardComponent } from '@/components/component/dashboard-component';
import { lusitana } from '@/app/ui/fonts';

export default function page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}></h1>
      <div>
        <DashboardComponent />
      </div>
    </main>
  );
}
