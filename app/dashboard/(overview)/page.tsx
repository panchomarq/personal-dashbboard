import CardWrapper from '@/app/ui/dashboard/cards';
import LatestIncomes from '@/app/ui/dashboard/latest-incomes';
import LatestOutcomes from '@/app/ui/dashboard/latest-outcomes';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import {
  RevenueChartSkeleton,
  LatestInvoicesSkeleton,
  CardsSkeleton,
} from '@/app/ui/skeletons';
import { fetchCardData } from '@/app/lib/data';

export default async function Page() {
  const { total } =
    await fetchCardData();

  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-2">
        <Suspense fallback={<CardsSkeleton />}>
          <CardWrapper />
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<RevenueChartSkeleton />}></Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          {<LatestIncomes />}
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          {<LatestOutcomes />}
        </Suspense>
      </div>
    </main>
  );
}
