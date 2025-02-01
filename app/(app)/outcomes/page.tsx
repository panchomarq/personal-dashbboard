'use client';

import LatestOutcomes from '@/components/dashboard/LatestOutcomes';
import { LatestInvoicesSkeleton } from '@/components/ui/Skeletons';
import { fetchLatestOutcomes } from '@/lib/data';
import { LatestOutcome } from '@/lib/types/definitions';
import { Suspense, useEffect, useState } from 'react';

export default function Page() {
  const [latestOutcomeData, setLatestOutcomeData] = useState<
    LatestOutcome[] | null
  >(null);
  const [currentCurrency, setCurrentCurrency] = useState<'ARS' | 'USD'>('ARS');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const latestOutcomes = await fetchLatestOutcomes();
        setLatestOutcomeData(latestOutcomes);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl"></h1>
      <div>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          {latestOutcomeData ? (
            <LatestOutcomes outcomeData={latestOutcomeData} />
          ) : (
            <LatestInvoicesSkeleton />
          )}
        </Suspense>
      </div>
    </main>
  );
}
