'use client';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useMemo, useState, useCallback } from 'react';
import { CalendarDatePickerProps } from './calendar-date-picker.types';

const MONTHS: readonly string[] = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

const CalendarDatePicker = ({
  value,
  onChange,
  disabled = false,
  className,
  yearRange = 30,
  showTodayButton = true,
  closeOnSelect = true,
  dateFormat = 'PPP',
  minDate,
} : CalendarDatePickerProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // Calculate display date based on current value or fallback to current date
  const fallbackDate = useMemo(() => new Date(), []);

  const [displayMonth, setDisplayMonth] = useState<number>(() => {
    const initDate = value instanceof Date ? value : fallbackDate;
    return initDate.getMonth();
  });
  const [displayYear, setDisplayYear] = useState<number>(() => {
    const initDate = value instanceof Date ? value : fallbackDate;
    return initDate.getFullYear();
  });

  // Generate year options with proper typing
  const currentYear: number = new Date().getFullYear();
  const years = useMemo<number[]>(() => {
    const start = Math.min(
      currentYear - yearRange,
      minDate ? minDate.getFullYear() : currentYear - yearRange
    );

    return Array.from({ length: currentYear - start + 1 }, (_, i) => start + i);
  }, [currentYear, yearRange, minDate ]);

  // Always use the state variables for display, not derived from value
  const currentDisplayMonth = displayMonth;
  const currentDisplayYear = displayYear;

  const handleDateSelect = useCallback((selectedDate: Date | undefined): void => {
    onChange?.(selectedDate);
    if (closeOnSelect && selectedDate) {
      setIsOpen(false);
    }
  }, [onChange, closeOnSelect]);

  const handleTodayClick = useCallback((): void => {
    const today = new Date();
    handleDateSelect(today);
  }, [handleDateSelect]);

  const handleMonthChange = useCallback((monthIndex: string): void => {
    const newMonth = parseInt(monthIndex, 10);
    setDisplayMonth(newMonth);
  }, []);

  const handleYearChange = useCallback((yearValue: string): void => {
    const newYear = parseInt(yearValue, 10);
    setDisplayYear(newYear);
  }, []);

  // Update display month/year when value changes
  const handleCalendarMonthChange = useCallback((month: Date) => {
    setDisplayMonth(month.getMonth());
    setDisplayYear(month.getFullYear());
  }, []);

  // Simple date validation - just check min date and future dates
  const getDisabledDates = useCallback((date: Date): boolean => {
    if (disabled) return true;

    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);

    // Check if date is in the future (when preventFutureDates is true)
    if (checkDate > today) return true;

    // Check minimum date
    if (minDate) {
      const minCheck = new Date(minDate);
      minCheck.setHours(0, 0, 0, 0);
      if (checkDate < minCheck) return true;
    }

    return false;
  }, [disabled, minDate]);

  const displayDate = useMemo<Date>(() => new Date(currentDisplayYear, currentDisplayMonth), [currentDisplayYear, currentDisplayMonth]);

  const isTodayDisabled = useMemo<boolean>(() => getDisabledDates(new Date()), [getDisabledDates]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(value ?? fallbackDate, dateFormat)}
          <ChevronDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3">
          {/* Month and Year Selectors */}
          <div className="flex items-center justify-between space-x-2 mb-3">
            <Select
              value={currentDisplayMonth.toString()}
              onValueChange={handleMonthChange}
            >
              <SelectTrigger className="w-[130px] cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MONTHS.map((month, index) => (
                  <SelectItem key={month} value={index.toString()} className="cursor-pointer">
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={currentDisplayYear.toString()}
              onValueChange={handleYearChange}
            >
              <SelectTrigger className="w-[100px] cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()} className="cursor-pointer">
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Calendar */}
          <Calendar
            mode="single"
            selected={value}
            onSelect={handleDateSelect}
            month={displayDate}
            onMonthChange={handleCalendarMonthChange}
            disabled={getDisabledDates}
          />

          {/* Today Button */}
          {showTodayButton && (
            <div className="border-t pt-3">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={handleTodayClick}
                disabled={isTodayDisabled}
              >
                Today
              </Button>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default CalendarDatePicker;
