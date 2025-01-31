// components/ui/DateRangePicker.tsx

import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { addDays } from 'date-fns';

const DateRangePicker: React.FC<{ onChange: (dates: [Date | null, Date | null]) => void }> = ({ onChange }) => {
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);

  const handleChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    onChange(dates);
  };

  return (
    <DatePicker
      selected={startDate}
      onChange={handleChange}
      startDate={startDate ?? undefined}
      endDate={endDate ?? undefined}
      excludeDates={[addDays(new Date(), 1), addDays(new Date(), 5)]}
      selectsRange
      selectsDisabledDaysInRange
      inline
    />
  );
};

export default DateRangePicker;
