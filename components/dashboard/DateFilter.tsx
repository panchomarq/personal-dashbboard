'use client';

import React from 'react';
import { DateRange } from "react-day-picker";
import { DateRangePicker } from '@/components/ui/DateRangePicker';
import { subDays, format } from 'date-fns';

/**
 * Interface for DateFilter component
 */
interface DateFilterProps {
  onChange: (range: DateRange | undefined) => void;
  defaultValue?: DateRange;
  className?: string;
}

/**
 * DateFilter component for selecting date ranges in the dashboard
 */
const DateFilter: React.FC<DateFilterProps> = ({
  onChange,
  defaultValue = {
    from: subDays(new Date(), 30),
    to: new Date(),
  },
  className = '',
}) => {
  const handleDateRangeChange = (range: DateRange | undefined) => {
    onChange(range);
  };

  return (
    <div className={`${className}`}>
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-sm font-medium text-slate">Date Range</h3>
        {defaultValue.from && defaultValue.to && (
          <span className="text-xs text-slate/70">
            ({format(defaultValue.from, 'MMM d, yyyy')} - {format(defaultValue.to, 'MMM d, yyyy')})
          </span>
        )}
      </div>
      <DateRangePicker
        defaultValue={defaultValue}
        onChange={handleDateRangeChange}
        showTwoMonths={true}
        showPresetButtons={false}
      />
      <p className="mt-2 text-xs text-slate/70">
        Filter your financial data by selecting a date range
      </p>
    </div>
  );
};

export default DateFilter; 