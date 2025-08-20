import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { DatePickerProps } from './datePicker.types';

const DatePicker = ({
  value,
  onChange,
  disabled
} : DatePickerProps) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant='outline'
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground'
          )}>
          <CalendarIcon className='size-4' />
		  {value ? format(value, 'PPP') : <span className='text-sm '>Pick a date</span>}
		  </Button>
      </PopoverTrigger>
	  <PopoverContent>
        <Calendar
		  mode='single'
		  selected={value}
		  onSelect={onChange}
		  disabled={disabled}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
