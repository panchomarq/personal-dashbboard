import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CurrencyToggleProps {
  currentCurrency: 'ARS' | 'USD';
  onCurrencyChange: (newCurrency: 'ARS' | 'USD') => void;
}

const CurrencyToggle: React.FC<CurrencyToggleProps> = ({ currentCurrency, onCurrencyChange }) => {
  const [toggle, setToggle] = useState<boolean>(currentCurrency === 'USD');

  const handleToggle = () => {
    const newCurrency = currentCurrency === 'ARS' ? 'USD' : 'ARS';
    onCurrencyChange(newCurrency);
    setToggle(!toggle);
  };

  useEffect(() => {
    setToggle(currentCurrency === 'USD');
  }, [currentCurrency]);

  return (
    <div className="flex h-6 w-12 cursor-pointer rounded-full border border-teal-400 p-[1px]" onClick={handleToggle}>
      <motion.div
        className={`h-5 w-5 rounded-full ${toggle ? 'bg-teal-400' : 'bg-teal-400'}`}
        layout
        transition={{ type: 'spring', stiffness: 700, damping: 30 }}
      />
    </div>
  );
};

export default CurrencyToggle;