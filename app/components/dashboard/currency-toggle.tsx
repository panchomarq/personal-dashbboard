import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const ToggleCurrencyButton = ({
  currentCurrency,
  onCurrencyChange,
}: {
  currentCurrency: string;
  onCurrencyChange: (newCurrency: string) => void;
}) => {
  const [toggle, setToggle] = useState(currentCurrency === 'ARS');
  const toggleCurrency = () => {
    const newCurrency = currentCurrency === 'ARS' ? 'USD' : 'ARS';
    onCurrencyChange(newCurrency);
  };

  useEffect(() => {
    setToggle(currentCurrency === 'ARS');
  }, [currentCurrency]);

  return (
  <div className="flex h-screen items-center justify-center">
    <div className="flex h-6 w-12 cursor-pointer rounded-full border border-black bg-white p-[1px]"
    onClick={toggleCurrency}>
      <motion.div
        className={`h-5 w-5 rounded-full ${toggle ? 'bg-black' : 'bg-white'}`}
        layout
        transition={{ type: 'spring', stiffness: 700, damping: 30 }}
      />
    </div>
  </div>
  );
};

export default ToggleCurrencyButton;
