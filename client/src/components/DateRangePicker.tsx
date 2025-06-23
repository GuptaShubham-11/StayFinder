'use client';

import * as React from 'react';
import { format, isWithinInterval } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  disabledDates?: { from: Date; to: Date }[];
  disabled?: (date: Date) => boolean;
}

export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  value,
  onChange,
  disabledDates = [],
  disabled,
}) => {
  const formatted =
    value.from && value.to
      ? `${format(value.from, 'MMM dd')} - ${format(value.to, 'MMM dd')}`
      : 'Pick a date';

  const isDateDisabled = (date: Date) => {
    // If custom disabled callback is provided, run that check first
    if (disabled && disabled(date)) return true;

    // Check if the date falls within any unavailable range
    return disabledDates.some((range) =>
      isWithinInterval(date, { start: range.from, end: range.to })
    );
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal bg-bg text-txt hover:bg-muted',
            !value.from && !value.to && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatted}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-bg text-txt border-border">
        <Calendar
          mode="range"
          selected={value}
          onSelect={(range: any) => {
            if (range?.from && range?.to) {
              onChange(range);
            }
          }}
          numberOfMonths={2}
          disabled={isDateDisabled}
        />
      </PopoverContent>
    </Popover>
  );
};
