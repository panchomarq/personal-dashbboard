import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import { fetchCardData } from '@/app/lib/data';

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

export default async function CardWrapper() {
  const { total } = await fetchCardData();

  const outcomes = total[0].outcome;
  const incomes = total[0].income;

  return (
    <>
      <Card
        title="Outcomes"
        value={outcomes.ars}
        value2={outcomes.usd}
        type="collected"
        currency="ARS"
        currency2="USD"
      />
      <Card
        title="Incomes"
        value={incomes.ars}
        value2={incomes.usd}
        type="collected"
        currency="ARS"
        currency2="USD"
      />
    </>
  );
}

export function Card({
  title,
  value,
  value2,
  type,
  currency,
  currency2,
}: {
  title: string;
  value: number | string;
  value2: number | string;
  type: 'invoices' | 'customers' | 'pending' | 'collected';
  currency: string;
  currency2: string;
}) {
  const Icon = iconMap[type];
  const Coin = currencyMap[currency];

  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <div>
        <div
          className={`${lusitana.className} truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
        >
          <h2>{Coin ? currency : null}</h2>
          {Coin ? value : null}{' '}
        </div>
        <div
          className={`${lusitana.className} truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
        >
          <h2>{Coin ? currency2 : null}</h2>
          {Coin ? value2 : null}
        </div>
      </div>
    </div>
  );
}
