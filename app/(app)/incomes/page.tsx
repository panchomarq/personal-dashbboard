'use client';

import {
  fetchCardData,
  fetchLatestIncomes,
  fetchLatestOutcomes,
} from '@/lib/data';
import {
  LatestIncome,
  LatestOutcome,
} from '@/lib/types/definitions';
import LatestIncomes from '@/components/dashboard/LatestIncomes';
import LatestOutcomes from '@/components/dashboard/LatestOutcomes';
import { Button } from '@/components/ui/Button';
import { LatestInvoicesSkeleton } from '@/components/ui/Skeletons';
import { Suspense, useEffect, useState } from 'react';

export default function Page() {
  const [latestIncomeData, setLatestIncomeData] = useState<
    LatestIncome[] | null
  >(null);
  const [latestOutcomeData, setLatestOutcomeData] = useState<
    LatestOutcome[] | null
  >(null);
  const [currentCurrency, setCurrentCurrency] = useState<'ARS' | 'USD'>('ARS');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cardResponse, latestIncomes, latestOutcomes] = await Promise.all(
          [fetchCardData(), fetchLatestIncomes(), fetchLatestOutcomes()],
        );

        setLatestIncomeData(latestIncomes.data);
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
        <Button variant="link">asasdasd</Button>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          {latestIncomeData ? (
            <LatestIncomes
              incomeData={latestIncomeData}
              value={''}
              currency={'ARS'}
              currentCurrency={currentCurrency}
            />
          ) : (
            <LatestInvoicesSkeleton />
          )}
        </Suspense>

      </div>
    </main>
  );
}
