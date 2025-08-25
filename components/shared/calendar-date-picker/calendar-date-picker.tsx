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
import { useMemo, useState, useCallback, useEffect } from 'react';
import { CalendarDatePickerProps } from './calendar-date-picker.types';

const MONTHS: readonly string[] = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

// Extended props to include error state
interface ExtendedCalendarDatePickerProps extends CalendarDatePickerProps {
  error?: boolean;
  errorMessage?: string;
}

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
  error = false,
  errorMessage,
} : ExtendedCalendarDatePickerProps) => {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const fallbackDate = useMemo(() => new Date(), []);
  const initDate = value instanceof Date ? value : fallbackDate;

  const [displayMonth, setDisplayMonth] = useState<number>(() => {
    return initDate.getMonth();
  });
  const [displayYear, setDisplayYear] = useState<number>(() => {
    return initDate.getFullYear();
  });

  // Sync display state when value changes externally
  useEffect(() => {
    if (value && value instanceof Date) {
      setDisplayMonth(value.getMonth());
      setDisplayYear(value.getFullYear());
    }
  }, [value]);

  const currentYear: number = new Date().getFullYear();

  // Fixed year range calculation - ensure we have proper range for past dates
  const years = useMemo<number[]>(() => {
    const minYear = minDate?.getFullYear() ?? (currentYear - yearRange);
    const start = Math.min(minYear, currentYear - yearRange);

    // Generate years from start up to current year (inclusive)
    return Array.from({ length: currentYear - start + 1 }, (_, i) => start + i)
      .reverse(); // Most recent first for better UX
  }, [currentYear, yearRange, minDate]);

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

  const handleCalendarMonthChange = useCallback((month: Date) => {
    setDisplayMonth(month.getMonth());
    setDisplayYear(month.getFullYear());
  }, []);

  // Fixed date validation with consistent normalization
  const getDisabledDates = useCallback((date: Date): boolean => {
    if (disabled) return true;

    // Normalize dates to start of day for consistent comparison
    const today = new Date();
    today.setHours(23, 59, 59, 999); // End of today

    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0); // Start of check date

    // Disable future dates (after today)
    if (checkDate > today) return true;

    // Check minimum date
    if (minDate) {
      const minCheck = new Date(minDate);
      minCheck.setHours(0, 0, 0, 0);
      if (checkDate < minCheck) return true;
    }

    return false;
  }, [disabled, minDate]);

  const displayDate = useMemo<Date>(() => new Date(displayYear, displayMonth), [displayYear, displayMonth]);

  const isTodayDisabled = useMemo<boolean>(() => getDisabledDates(new Date()), [getDisabledDates]);

  // Filter available months and years based on constraints
  const availableMonths = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYearValue = today.getFullYear();

    return MONTHS.map((month, index) => ({
      name: month,
      value: index,
      disabled: displayYear === currentYearValue && index > currentMonth
    }));
  }, [displayYear]);

  const availableYears = useMemo(() => {
    return years.filter(year => year <= currentYear);
  }, [years, currentYear]);

  return (
    <div className="w-full">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant='outline'
            className={cn(
              'w-full justify-start text-left font-normal',
              !value && 'text-muted-foreground',
              // Error styling - red border and background tint
              error && [
                'border-red-500 bg-red-50/50 text-red-900',
                'hover:border-red-600 hover:bg-red-50/70',
                'focus:border-red-500 focus:ring-red-500/20',
                'dark:bg-red-950/20 dark:text-red-100 dark:border-red-600',
                'dark:hover:bg-red-950/30 dark:hover:border-red-500'
              ],
              className
            )}
          >
            <CalendarIcon className={cn(
              'mr-2 h-4 w-4',
              error && 'text-red-500 dark:text-red-400'
            )} />
            {format(value ?? fallbackDate, dateFormat)}
            <ChevronDown className={cn(
              'ml-auto h-4 w-4 opacity-50',
              error && 'text-red-500 dark:text-red-400'
            )} />
          </Button>
        </PopoverTrigger>

        <PopoverContent className='w-auto p-0' align='start'>
          <div className='p-3'>
            {/* Month and Year Selectors */}
            <div className='flex items-center justify-between space-x-2 mb-3'>
              <Select
                value={displayMonth.toString()}
                onValueChange={handleMonthChange}
              >
                <SelectTrigger className='w-[130px] cursor-pointer'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableMonths.map((month) => (
                    <SelectItem
                      key={month.name}
                      value={month.value.toString()}
                      className='cursor-pointer'
                      disabled={month.disabled}
                    >
                      {month.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={displayYear.toString()}
                onValueChange={handleYearChange}
              >
                <SelectTrigger className='w-[100px] cursor-pointer'>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {availableYears.map((year) => (
                    <SelectItem key={year} value={year.toString()} className='cursor-pointer'>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Calendar */}
            <Calendar
              mode='single'
              selected={value}
              onSelect={handleDateSelect}
              month={displayDate}
              onMonthChange={handleCalendarMonthChange}
              disabled={getDisabledDates}
              defaultMonth={displayDate}
            />

            {/* Today Button */}
            {showTodayButton && (
              <div className='border-t pt-3'>
                <Button
                  variant='outline'
                  size='sm'
                  className='w-full'
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

      {/* Error message */}
      {error && errorMessage && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  );
};

export default CalendarDatePicker;
