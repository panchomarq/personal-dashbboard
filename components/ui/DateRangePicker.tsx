"use client"

import * as React from "react"
import { addDays, format, subDays } from "date-fns"
import { Calendar as CalendarIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { Calendar } from "@/components/ui/Calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/Popover"

interface DateRangePickerProps {
  className?: string
  onChange?: (date: DateRange | undefined) => void
  defaultValue?: DateRange
  showTwoMonths?: boolean
  showPresetButtons?: boolean
}

export function DateRangePicker({
  className,
  onChange,
  defaultValue = {
    from: subDays(new Date(), 30),
    to: new Date(),
  },
  showTwoMonths = true,
  showPresetButtons = true,
}: DateRangePickerProps) {
  const [date, setDate] = React.useState<DateRange | undefined>(defaultValue)

  const handleDateChange = (newDateRange: DateRange | undefined) => {
    setDate(newDateRange)
    
    if (onChange) {
      onChange(newDateRange)
    }
  }

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal bg-white text-white hover:bg-navy-100 border-navy-900",
              !date && "text-gray-300"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4 text-white" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-white border border-navy-300 shadow-md" align="start">
          {showPresetButtons && (
            <div className="flex justify-between p-3 bg-white border-b border-navy-300">
              <Button
                variant="ghost"
                size="sm"
                className="text-navy-900 hover:text-navy-900 hover:bg-navy-100"
                onClick={() => {
                  const today = new Date()
                  handleDateChange({
                    from: subDays(today, 30),
                    to: today,
                  })
                }}
              >
                Last 30 days
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-navy-900 hover:text-navy-900 hover:bg-navy-100"
                onClick={() => {
                  handleDateChange({
                    from: subDays(new Date(), 90),
                    to: new Date(),
                  })
                }}
              >
                Last 90 days
              </Button>
            </div>
          )}
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={showTwoMonths ? 2 : 1}
            className="rounded-md bg-white p-3"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center text-navy-900",
              caption_label: "text-sm font-medium text-navy-900",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-transparent p-0 opacity-70 hover:opacity-100 hover:bg-navy-100 rounded-md text-navy-900",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-navy-500 rounded-md w-9 font-normal text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm relative p-0 rounded-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal text-navy-900 aria-selected:opacity-100 rounded-md hover:bg-navy-100 flex items-center justify-center",
              day_selected: "bg-navy-900 !text-white hover:bg-navy-800 hover:!text-white focus:bg-navy-900 focus:!text-white",
              day_today: "bg-white text-navy-900 border border-navy-300",
              day_range_middle: "bg-navy-100 text-navy-900 rounded-none",
              day_hidden: "invisible",
              day_outside: "text-slate-400 opacity-50",
              day_disabled: "text-slate-400 opacity-50",
              day_range_end: "bg-navy-900 !text-white rounded-r-md",
              day_range_start: "bg-navy-900 !text-white rounded-l-md",
            }}
            components={{
              IconLeft: () => <ChevronLeftIcon className="h-4 w-4" />,
              IconRight: () => <ChevronRightIcon className="h-4 w-4" />,
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
} 