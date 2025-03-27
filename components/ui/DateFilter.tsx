import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { 
  startOfDay, 
  endOfDay, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear, 
  subMonths, 
  subYears 
} from 'date-fns';

/**
 * DateFilter component for filtering data by date range
 * Provides preset options and custom date range selection
 */
interface DateFilterProps {
  onChange: (dateRange: { startDate: Date | null; endDate: Date | null }) => void;
  minDate?: Date;
  maxDate?: Date;
  initialStartDate?: Date | null;
  initialEndDate?: Date | null;
  className?: string;
}

const DateFilter: React.FC<DateFilterProps> = ({
  onChange,
  minDate,
  maxDate,
  initialStartDate = null,
  initialEndDate = null,
  className = '',
}) => {
  const [startDate, setStartDate] = useState<Date | null>(initialStartDate);
  const [endDate, setEndDate] = useState<Date | null>(initialEndDate);
  const [isCustomRange, setIsCustomRange] = useState<boolean>(false);

  const handleDateChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start ? startOfDay(start) : null);
    setEndDate(end ? endOfDay(end) : null);
    onChange({ 
      startDate: start ? startOfDay(start) : null, 
      endDate: end ? endOfDay(end) : null 
    });
  };

  const applyPreset = (preset: string) => {
    setIsCustomRange(false);
    const today = new Date();
    let newStartDate: Date | null = null;
    let newEndDate: Date | null = null;

    switch (preset) {
      case 'today':
        newStartDate = startOfDay(today);
        newEndDate = endOfDay(today);
        break;
      case 'thisWeek':
        newStartDate = startOfWeek(today, { weekStartsOn: 1 });
        newEndDate = endOfWeek(today, { weekStartsOn: 1 });
        break;
      case 'thisMonth':
        newStartDate = startOfMonth(today);
        newEndDate = endOfMonth(today);
        break;
      case 'lastMonth':
        const lastMonth = subMonths(today, 1);
        newStartDate = startOfMonth(lastMonth);
        newEndDate = endOfMonth(lastMonth);
        break;
      case 'thisYear':
        newStartDate = startOfYear(today);
        newEndDate = endOfYear(today);
        break;
      case 'lastYear':
        const lastYear = subYears(today, 1);
        newStartDate = startOfYear(lastYear);
        newEndDate = endOfYear(lastYear);
        break;
      case 'custom':
        setIsCustomRange(true);
        break;
      default:
        break;
    }

    setStartDate(newStartDate);
    setEndDate(newEndDate);
    
    if (preset !== 'custom') {
      onChange({ startDate: newStartDate, endDate: newEndDate });
    }
  };

  return (
    <div className={`flex flex-col space-y-4 ${className}`}>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => applyPreset('today')}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Today
        </button>
        <button
          type="button"
          onClick={() => applyPreset('thisWeek')}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100"
        >
          This Week
        </button>
        <button
          type="button"
          onClick={() => applyPreset('thisMonth')}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100"
        >
          This Month
        </button>
        <button
          type="button"
          onClick={() => applyPreset('lastMonth')}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Last Month
        </button>
        <button
          type="button"
          onClick={() => applyPreset('thisYear')}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100"
        >
          This Year
        </button>
        <button
          type="button"
          onClick={() => applyPreset('lastYear')}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Last Year
        </button>
        <button
          type="button"
          onClick={() => applyPreset('custom')}
          className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Custom Range
        </button>
      </div>

      {isCustomRange && (
        <div className="p-4 border border-gray-300 rounded-md">
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate || undefined}
            endDate={endDate || undefined}
            selectsRange
            minDate={minDate}
            maxDate={maxDate}
            monthsShown={2}
            dateFormat="yyyy-MM-dd"
            className="w-full"
          />
        </div>
      )}

      {startDate && endDate && (
        <div className="text-sm text-gray-600 font-medium">
          Selected period: {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
        </div>
      )}
    </div>
  );
};

export default DateFilter; 