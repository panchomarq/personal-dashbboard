import React from 'react';
import { CardWrapperProps} from '@/lib/types/definitions';
import Card from './Card';

const CardWrapper: React.FC<CardWrapperProps> = ({ cardData, currentCurrency }) => {

  const outcomes = cardData[0].outcome;
  const incomes = cardData[0].income;

  return (
    <div>

      <div className="grid grid-cols-4 gap-4">
        <Card
          title="Outcomes"
          value={outcomes.ars}
          value2={outcomes.usd}
          currency="ARS"
          currency2="USD"
          currentCurrency={currentCurrency}
        />
        <Card
          title="Incomes"
          value={incomes.ars}
          value2={incomes.usd}
          currency="ARS"
          currency2="USD"
          currentCurrency={currentCurrency}
        />
      </div>
    </div>
  );
};

export default CardWrapper;
