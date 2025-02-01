
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface DateRangePickerProps {
  onChange: (dates: [Date | null, Date | null]) => void;
  minDate: Date;
  maxDate: Date;
  style?: React.CSSProperties;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onChange, minDate, maxDate, style }) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    onChange(dates);
  };

  return (
    <div className="p-4 border border-gray-300 rounded-md">
      <DatePicker
        selected={startDate}
        onChange={handleChange}
        startDate={startDate ?? undefined}
        endDate={endDate ?? undefined}
        selectsRange
        monthsShown={2}
      />
    </div>
  );
};

export default DateRangePicker;
