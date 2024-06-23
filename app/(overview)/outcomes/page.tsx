"use client"
import  IncomeForm  from '@/components/ui/IncomeForm';

export default function page() {
  return (
    <main>
      <h1 className="mb-4 text-xl md:text-2xl"></h1>
      <div>
        <IncomeForm clients={undefined} />
      </div>
    </main>
  );
}
