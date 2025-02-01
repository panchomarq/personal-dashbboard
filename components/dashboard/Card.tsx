import {
  BanknotesIcon,
  ClockIcon,
  UserGroupIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';
import { montserrat } from '@/lib/fonts';
import { CardProps } from '@/lib/types/definitions';

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

const Card: React.FC<CardProps> = ({
    title,
    value,
    value2,
    currency,
    currency2,
    currentCurrency,
  }) => {
    const Coin =
      currentCurrency === 'ARS' ? currencyMap[currency] : currencyMap[currency2];
  
    return (
      <div className="rounded-xl bg-teal-100 p-2 shadow-sm">
        <div className="flex p-4">
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
        </div>
        <div>
          <div
            className={`${montserrat.className} truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}
          >
            <h2>{Coin ? currentCurrency : null}</h2> 
            {Coin ? (currentCurrency === 'ARS' ? value : value2) : null}
          </div>
        </div>
      </div>
    );
  };

  export default Card;