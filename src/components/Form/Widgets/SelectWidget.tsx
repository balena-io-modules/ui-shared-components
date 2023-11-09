import {
	FormControl,
	Autocomplete,
	TextField,
	InputLabel,
} from '@mui/material';
import { WidgetProps } from '@rjsf/utils';

export const SelectWidget = ({
	id,
	label,
	value,
	disabled,
	name,
	placeholder,
	onChange,
	multiple,
	options,
	required,
}: WidgetProps) => {
	const change = (_event: any, { value }: any) => {
		return onChange(value === '' ? options.emptyValue : value);
	};

	const { enumOptions, enumDisabled } = options;
	if (!Array.isArray(enumOptions)) {
		return null;
	}
	const sanitizedEnumDisabled = Array.isArray(enumDisabled)
		? enumDisabled
		: null;
	const selectOptions = enumOptions.map((option) => {
		return {
			...option,
			disabled:
				sanitizedEnumDisabled != null &&
				sanitizedEnumDisabled.includes(option.value),
		};
	});

	return (
		<FormControl>
			<InputLabel htmlFor={id} required={required}>
				{label}
			</InputLabel>
			<Autocomplete
				fullWidth
				id={id}
				value={
					value !== undefined
						? selectOptions.find((option) => option.value === value)
						: undefined
				}
				{...{
					name,
					placeholder,
					multiple,
				}}
				disabled={disabled}
				options={selectOptions}
				getOptionLabel={(option) => option.label}
				getOptionDisabled={(option) => option.disabled}
				renderInput={(params) => <TextField {...params} />}
				onChange={change}
				disableClearable
			/>
		</FormControl>
	);
};
