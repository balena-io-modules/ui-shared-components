import { Autocomplete, TextField } from '@mui/material';
import { WidgetProps } from '@rjsf/utils';
import isEqual from 'lodash/isEqual';

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
	uiSchema,
}: WidgetProps) => {
	const { inputProps, ...otherUiSchema } = uiSchema ?? {};
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

	// 	This components needs to handle two cases, single selection and multiple selections.
	// 	value, getOptionLabel, getOptionDisabled and onChange has to consider 2 scenarios following this type:
	// 	option: {
	// 	    disabled: boolean;
	// 	    value: any;
	// 	    label: string;
	// 	    schema?: RJSFSchema | undefined;
	// 	} | {
	// 	    disabled: boolean;
	// 	    value: any;
	// 	    label: string;
	// 	    schema?: RJSFSchema | undefined;
	// 	}[]

	return (
		<Autocomplete
			fullWidth
			id={id}
			value={
				Array.isArray(value)
					? selectOptions.filter((option) =>
							value.some((v) => isEqual(option.value, v)),
					  )
					: value !== undefined
					? selectOptions.find((option) => isEqual(option.value, value))
					: undefined
			}
			{...{
				name,
				placeholder,
				multiple,
			}}
			filterSelectedOptions={multiple}
			disabled={disabled}
			options={selectOptions}
			isOptionEqualToValue={(option, value) => isEqual(option, value)}
			getOptionLabel={(option) =>
				Array.isArray(option)
					? option.map((o) => o.label).join(', ')
					: option.label
			}
			getOptionDisabled={(option) =>
				Array.isArray(option) ? option.some((o) => o.disabled) : option.disabled
			}
			renderInput={(params) => (
				<TextField
					{...params}
					inputProps={{
						...params.inputProps,
						...(inputProps ?? {}),
					}}
					{...(multiple && {
						onKeyDown: (e) => {
							// Prevent deleting the last chip with backspace or delete https://github.com/mui/material-ui/issues/21129#issuecomment-636919142
							if (e.key === 'Backspace' || e.key === 'Delete') {
								e.stopPropagation();
							}
						},
					})}
					label={label}
					required={required}
				/>
			)}
			onChange={(_event, selected) => {
				if (Array.isArray(selected)) {
					const val = selected
						.map((item) => {
							if (item && typeof item === 'object' && 'value' in item) {
								return item.value;
							}
							// this case cover a wrong setup, we just return undefined
							return undefined;
						})
						.filter((v) => v !== undefined);
					return onChange(val.length > 0 ? val : options.emptyValue);
				}
				if (selected && typeof selected === 'object' && 'value' in selected) {
					return onChange(
						selected.value === '' ? options.emptyValue : selected.value,
					);
				}
				return onChange(options.emptyValue);
			}}
			disableClearable
			{...otherUiSchema}
		/>
	);
};
