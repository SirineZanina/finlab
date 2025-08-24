export type CalendarDatePickerProps = {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  className?: string;
  yearRange?: number;
  showTodayButton?: boolean;
  closeOnSelect?: boolean;
  dateFormat?: string;
  minDate?: Date;
}
