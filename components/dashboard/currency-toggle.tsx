// components/ToggleCurrencyButton.tsx

import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';

const ToggleCurrencyButton = ({ currentCurrency }: { currentCurrency: string }) => {
  const router = useRouter();

  const toggleCurrency = () => {
    const newCurrency = currentCurrency === 'ARS' ? 'USD' : 'ARS';
    router.push({
      pathname: router.pathname,
      query: { ...router.query, currency: newCurrency },
    });
  };

  return (
    <Button onClick={toggleCurrency}>
      Toggle Currency
    </Button>
  );
};

export default ToggleCurrencyButton;
