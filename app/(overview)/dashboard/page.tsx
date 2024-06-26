'use client';

import React, { useState, useEffect } from 'react';
import { Suspense } from 'react';
import { LatestInvoicesSkeleton, CardsSkeleton } from '@/components/ui/Skeletons';
import {
  fetchCardData,
  fetchLatestIncomes,
  fetchLatestOutcomes,
} from '@/lib/data';
import {
  FinancialRecord,
  LatestIncome,
  LatestOutcome,
} from '@/lib/types/definitions';
import CardWrapper from '@/components/dashboard/CardWrapper';
import LatestIncomes from '@/components/dashboard/LatestIncomes';
import LatestOutcomes from '@/components/dashboard/LatestOutcomes';

export default function Page() {
  const [cardData, setCardData] = useState<FinancialRecord[] | null>(null);
  const [latestIncomeData, setLatestIncomeData] = useState<
    LatestIncome[] | null
  >(null);
  const [latestOutcomeData, setLatestOutcomeData] = useState<
    LatestOutcome[] | null
  >(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cardResponse, latestIncomes, latestOutcomes] = await Promise.all(
          [fetchCardData(), fetchLatestIncomes(), fetchLatestOutcomes()],
        );

        setCardData(cardResponse?.total);
        setLatestIncomeData(latestIncomes);
        setLatestOutcomeData(latestOutcomes);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchData();
  }, []);

  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl">Dashboard</h1>
      <div className="flex justify-end mb-4">
      </div>
      <div className="grid gap-2 sm:grid-cols-1 lg:grid-cols-1">
        <Suspense fallback={<CardsSkeleton />}>
          {cardData ? <CardWrapper cardData={cardData} /> : <CardsSkeleton />}
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          {latestIncomeData ? (
            <LatestIncomes incomeData={latestIncomeData} />
          ) : (
            <LatestInvoicesSkeleton />
          )}
        </Suspense>
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
