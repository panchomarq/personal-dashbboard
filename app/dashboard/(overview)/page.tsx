'use client';

import React, { useState, useEffect } from 'react';
import { Suspense } from 'react';
import { LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui-OLD/skeletons';
import { fetchCardData, fetchLatestIncomes, fetchLatestOutcomes } from '@/app/lib/data';
import { FinancialRecord, LatestIncome, LatestOutcome } from '@/app/lib/definitions';
import CardWrapper from '@/components/dashboard/card-wrapper';
import LatestIncomes from '@/components/dashboard/latest-incomes';
import LatestOutcomes from '@/components/dashboard/latest-outcomes';
export default function Page() {
  const [cardData, setCardData] = useState<FinancialRecord[] | null>(null);
  const [latestIncomeData, setLatestIncomeData] = useState<LatestIncome[] | null>(null);
  const [latestOutcomeData, setLatestOutcomeData] = useState<LatestOutcome[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cardResponse, latestIncomes, latestOutcomes] = await Promise.all([
          fetchCardData(),
          fetchLatestIncomes(),
          fetchLatestOutcomes(),
        ]);

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
      <div className="grid gap-2 sm:grid-cols-1 lg:grid-cols-1">
        <Suspense fallback={<CardsSkeleton />}>
          {cardData ? <CardWrapper cardData={cardData} /> : <CardsSkeleton />}
        </Suspense>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          {latestIncomeData ? <LatestIncomes incomeData={latestIncomeData} /> : <LatestInvoicesSkeleton />}
        </Suspense>
        <Suspense fallback={<LatestInvoicesSkeleton />}>
          {latestOutcomeData ? <LatestOutcomes outcomeData={latestOutcomeData} /> : <LatestInvoicesSkeleton />}
        </Suspense>
      </div>
    </main>
  );
}
