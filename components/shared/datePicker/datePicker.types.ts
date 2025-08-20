import { PropsSingle } from 'react-day-picker';

export type DatePickerProps = {
	value?: Date;
	onChange?: PropsSingle['onSelect'];
	disabled?: boolean;
}
