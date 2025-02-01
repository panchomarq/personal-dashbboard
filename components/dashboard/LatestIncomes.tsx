import clsx from 'clsx';
import { LatestIncomeProps } from '@/lib/types/definitions';

const Currency = {
  ARS: 'ARS',
  USD: 'USD',
};

const currencyMap = {
  [Currency.ARS]: 'ARS',
  [Currency.USD]: 'USD',
};

const LatestIncomes: React.FC<LatestIncomeProps> = ({incomeData}) => {

  /*const Coin =
  currentCurrency === 'ARS' ? currencyMap[incomeData] : currencyMap[currency2];*/

  return (
    <div className="flex w-full flex-col md:col-span-4">
      <h2 className="mb-4 text-xl md:text-2xl">
        Latest Incomes
      </h2>
      <div className="flex grow flex-col justify-between rounded-xl bg-gray-50 p-4">
        {
          <div className="bg-white px-6">
            {incomeData.map((income, i) => {
              return (
                <div
                  key={income.name}
                  className={clsx(
                    'flex flex-row items-center justify-between py-4',
                    {
                      'border-t': i !== 0,
                    },
                  )}
                >
                  <div className="flex items-center">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold md:text-base">
                        {income.name}
                      </p>
                      <p className="hidden text-sm text-gray-500 sm:block">
                        {income.category}
                      </p>
                    </div>
                  </div>
                  <p
                    className="text-sm font-medium md:text-base"
                  >
                   {/* {Coin ? currentCurrency : null}{currentCurrency}*/}
                  </p>
                </div>
              );
            })}
          </div>
        }
      </div>
    </div>
  );
}

export default LatestIncomes;