'use client';

import React, { useState, useEffect } from 'react';
import { Suspense } from 'react';
import {
  CardsSkeleton,
} from '@/components/ui/Skeletons';
import { fetchCardData, fetchCardData2 } from '@/lib/data';
import { FinancialRecord } from '@/lib/types/definitions';
import CardWrapper from '@/components/dashboard/CardWrapper';
import { motion } from 'framer-motion';
import MyDatePickers  from '@/components/ui/MyDatePickers';

export default function Page() {
  const [cardData, setCardData] = useState<FinancialRecord[]>();
  const [currentCurrency, setCurrentCurrency] = useState<'ARS' | 'USD'>('ARS');
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);

  const toggleCurrency = () => {
    setCurrentCurrency((prevCurrency) =>
      prevCurrency === 'ARS' ? 'USD' : 'ARS',
    );
  };
  const [toggle, setToggle] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cardResponse = await fetchCardData2(startDate, endDate);
        console.log('Response from fetchCardData2:', cardResponse); // Log the entire response

        if (cardResponse && cardResponse.total) {
          setCardData(cardResponse.total);
        } else {
          console.error('Invalid response structure:', cardResponse);
        }
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    fetchData();
  }, [startDate, endDate]);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl">Dashboard</h1>
      <div className="mb-4 flex justify-between">
        <div className="mb-4 flex">
          <MyDatePickers onChange={handleDateChange} />
        </div>
        <div
          className={`flex h-6 w-12 cursor-pointer rounded-full border border-teal-400 ${
            toggle ? 'justify-start bg-white' : 'justify-end bg-zinc-300'
          } p-[1px]`}
          onClick={() => {
            toggleCurrency(), setToggle(!toggle);
          }}
        >
          <motion.div
            className={`h-5 w-5 rounded-full ${
              toggle ? 'bg-teal-400' : 'bg-teal-400'
            }`}
            layout
            transition={{ type: 'spring', stiffness: 700, damping: 30 }}
          />
        </div>
      </div>
      <div className="grid gap-2 sm:grid-cols-1 lg:grid-cols-1">
        <Suspense fallback={<CardsSkeleton />}>
          {cardData ? (
            <CardWrapper
              cardData={cardData}
              currentCurrency={currentCurrency}
            />
          ) : (
            <CardsSkeleton />
          )}
        </Suspense>
      </div>
    </main>
  );
}