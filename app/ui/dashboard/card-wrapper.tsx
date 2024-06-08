import React, { useState } from 'react';
import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana, montserrat } from '@/app/ui/fonts';
import { CardWrapperProps, CardProps} from '@/app/lib/definitions';

const iconMap = {
  collected: BanknotesIcon,
  customers: UserGroupIcon,
  pending: ClockIcon,
  invoices: InboxIcon,
};

const Currency = {
  ARS: 'ARS',
  USD: 'USD',
};

const currencyMap = {
  [Currency.ARS]: 'ARS',
  [Currency.USD]: 'USD',
};



const CardWrapper: React.FC<CardWrapperProps> = ({ cardData }) => {
  const [currentCurrency, setCurrentCurrency] = useState<'ARS' | 'USD'>('ARS');

  const toggleCurrency = () => {
    setCurrentCurrency((prevCurrency) => (prevCurrency === 'ARS' ? 'USD' : 'ARS'));
  };

  const outcomes = cardData[0].outcome;
  const incomes = cardData[0].income;

  return (
    <div>
      <div className='grid grid-cols-2 gap-4'>
      <Card
        title="Outcomes"
        value={outcomes.ars}
        value2={outcomes.usd}
        type="collected"
        currency="ARS"
        currency2="USD"
        currentCurrency={currentCurrency}
      />
      <Card
        title="Incomes"
        value={incomes.ars}
        value2={incomes.usd}
        type="collected"
        currency="ARS"
        currency2="USD"
        currentCurrency={currentCurrency}
      />
      </div>
    </div>
  );
};

export const Card: React.FC<CardProps> = ({
  title,
  value,
  value2,
  type,
  currency,
  currency2,
  currentCurrency,
}) => {
  const Icon = iconMap[type];
  const Coin = currentCurrency === 'ARS' ? currencyMap[currency] : currencyMap[currency2];

  return (
    <div className="rounded-xl bg-teal-100 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <div>
        <div
          className={`${montserrat.className} truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
        >
          {/* <h2>{Coin ? currentCurrency : null}</h2> */}
          {Coin ? (currentCurrency === 'ARS' ? value : value2) : null}
        </div>
      </div>
    </div>
  );
};

export default CardWrapper;