'use client';

import { useState, FormEvent } from 'react';
import { Button } from './Button';

export default function IncomeForm() {
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get('name') as string,
      date: formData.get('date') as string,
      category: formData.get('category') as string,
      currency: formData.get('currency') as string,
      ars: parseFloat(formData.get('ars') as string),
      tasa: parseFloat(formData.get('tasa') as string),
      usd: parseFloat(formData.get('usd') as string),
    };

    try {
      const response = await fetch('/api/add-income', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert('Income created successfully');
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating income:', error);
      alert('Error creating income. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-md bg-gray-50 p-4 md:p-6">
        {/* Income Name */}
        <div className="mb-4">
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Name
          </label>
          <div className="relative">
            <input
              id="name"
              name="name"
              placeholder='"Luis Medina"'
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              required
            />
          </div>
        </div>
        {/* Income Date */}
        <div className="mb-4">
          <label htmlFor="date" className="mb-2 block text-sm font-medium">
            Date
          </label>
          <div className="relative">
            <input
              id="date"
              name="date"
              type="date"
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              required
            />
          </div>
        </div>
        {/* Income Category */}
        <div className="mb-4">
          <label htmlFor="category" className="mb-2 block text-sm font-medium">
            Category
          </label>
          <div className="relative">
            <input
              id="category"
              name="category"
              placeholder='"Salary"'
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              required
            />
          </div>
        </div>
        {/* Income Currency */}
        <div className="mb-4">
          <label htmlFor="currency" className="mb-2 block text-sm font-medium">
            Currency
          </label>
          <div className="relative">
            <input
              id="currency"
              name="currency"
              placeholder='"USD"'
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              required
            />
          </div>
        </div>
        {/* Income ARS */}
        <div className="mb-4">
          <label htmlFor="ars" className="mb-2 block text-sm font-medium">
            ARS
          </label>
          <div className="relative">
            <input
              id="ars"
              name="ars"
              type="number"
              step="0.01"
              placeholder='"1000"'
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              required
            />
          </div>
        </div>
        {/* Income Tasa */}
        <div className="mb-4">
          <label htmlFor="tasa" className="mb-2 block text-sm font-medium">
            Tasa
          </label>
          <div className="relative">
            <input
              id="tasa"
              name="tasa"
              type="number"
              step="0.01"
              placeholder='"3.5"'
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              required
            />
          </div>
        </div>
        {/* Income USD */}
        <div className="mb-4">
          <label htmlFor="usd" className="mb-2 block text-sm font-medium">
            USD
          </label>
          <div className="relative">
            <input
              id="usd"
              name="usd"
              type="number"
              step="0.01"
              placeholder='"10"'
              className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
              defaultValue=""
              required
            />
          </div>
        </div>
      </div>
      <div className="mt-4 flex justify-center gap-4">
        <Button type="submit">Submit</Button>
      </div>
    </form>
  );
}
