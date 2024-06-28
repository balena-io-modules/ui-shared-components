import {
	Autocomplete,
	Chip,
	TextField,
	FormControl,
	InputLabel,
	Typography,
} from '@mui/material';
import { WidgetProps } from '@rjsf/utils';
import omit from 'lodash/omit';
import isEqual from 'lodash/isEqual';

const noneOption = {
	disabled: false,
	value: undefined,
	label: 'None',
	schema: { disabled: false, label: 'None', const: undefined },
};

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
	const includeNoneOption = !multiple && !required;
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

	if (includeNoneOption) {
		selectOptions.unshift(noneOption);
	}

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
		<FormControl>
			{/* We cannot put the label w/ required directly on the TextField because `multiple`
			 * does not fill the value of the TextField, it only adds `startAdornments` */}
			<InputLabel required={required} htmlFor={id}>
				{label}
			</InputLabel>
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
						: includeNoneOption
						? noneOption
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
				renderTags={(tagValues, getTagProps) =>
					tagValues.map((option, index) => {
						const tagProps = getTagProps({ index });
						return (
							<Chip
								label={(option as (typeof selectOptions)[number]).label}
								{...((option as (typeof selectOptions)[number]).schema?.disabled
									? omit(tagProps, 'onDelete')
									: tagProps)}
							/>
						);
					})
				}
				isOptionEqualToValue={(option, value) => isEqual(option, value)}
				getOptionLabel={(option) =>
					Array.isArray(option)
						? option.map((o) => o.label).join(', ')
						: option.label
				}
				getOptionDisabled={(option) =>
					Array.isArray(option)
						? option.some((o) => o.disabled)
						: option.disabled
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
					/>
				)}
				{...(includeNoneOption && {
					renderOption: (props, option: (typeof selectOptions)[number]) =>
						option.value === null ? (
							<Typography
								{...props}
								fontStyle="italic"
								color="text.secondary"
								component="li"
							>
								{option.label}
							</Typography>
						) : (
							<li {...props}>{option.schema?.label ?? option.label}</li>
						),
				})}
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
						if (includeNoneOption && selected.value === null) {
							return onChange(options.emptyValue);
						}
						return onChange(
							selected.value === '' ? options.emptyValue : selected.value,
						);
					}
					return onChange(options.emptyValue);
				}}
				disableClearable
				{...otherUiSchema}
			/>
		</FormControl>
	);
};
