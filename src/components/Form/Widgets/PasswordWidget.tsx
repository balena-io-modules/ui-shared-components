import type { TextFieldProps } from '@mui/material';
import {
	FormControl,
	IconButton,
	InputAdornment,
	TextField,
} from '@mui/material';
import { Suspense, lazy, useMemo, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import type {
	FormContextType,
	RJSFSchema,
	StrictRJSFSchema,
} from '@rjsf/utils';
import {
	ariaDescribedByIds,
	examplesId,
	getInputProps,
	labelValue,
	type WidgetProps,
} from '@rjsf/utils';
export interface PasswordStrengthProps {
	password?: string;
}

const PasswordStrength = lazy(async () => {
	const importedModule = await import('../PasswordStrength');
	return {
		default: importedModule.PasswordStrength,
	};
});

export const PasswordWidget = <
	T = any,
	S extends StrictRJSFSchema = RJSFSchema,
	F extends FormContextType = any,
>({
	id,
	name, // remove this from textFieldProps
	placeholder,
	required,
	readonly,
	disabled,
	type,
	label,
	hideLabel,
	hideError,
	value,
	onChange,
	onChangeOverride,
	onBlur,
	onFocus,
	autofocus,
	options,
	schema,
	uiSchema,
	rawErrors = [],
	errorSchema,
	formContext,
	registry,
	InputLabelProps,
	...textFieldProps
}: Omit<WidgetProps<T, S, F>, 'color'> & {
	color: TextFieldProps['color'];
}) => {
	const [showPassword, setShowPassword] = useState(false);
	const customType = useMemo(
		() => (showPassword ? 'text' : 'password'),
		[showPassword],
	);
	const inputProps = getInputProps<T, S, F>(schema, customType, options);
	// Now we need to pull out the step, min, max into an inner `inputProps` for material-ui
	const { step, min, max, ...rest } = inputProps;
	const htmlInputProps = {
		step,
		min,
		max,
		...(schema.examples ? { list: examplesId<T>(id) } : undefined),
	};
	const _onChange = ({
		target: { value: val },
	}: React.ChangeEvent<HTMLInputElement>) =>
		onChange(val === '' ? options.emptyValue : val);
	const _onBlur = ({ target }: React.FocusEvent<HTMLInputElement>) =>
		onBlur(id, target?.value);
	const _onFocus = ({ target }: React.FocusEvent<HTMLInputElement>) =>
		onFocus(id, target?.value);

	return (
		<FormControl>
			<TextField
				id={id}
				name={id}
				placeholder={placeholder}
				label={labelValue(label ?? undefined, hideLabel, undefined)}
				autoFocus={autofocus}
				required={required}
				disabled={disabled ?? readonly}
				{...rest}
				value={value || value === 0 ? value : ''}
				error={rawErrors.length > 0}
				onChange={onChangeOverride ?? _onChange}
				onBlur={_onBlur}
				onFocus={_onFocus}
				{...(textFieldProps as TextFieldProps)}
				aria-describedby={ariaDescribedByIds<unknown>(id, !!schema.examples)}
				slotProps={{
					input: {
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									onClick={() => {
										setShowPassword((show) => !show);
									}}
									onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
										event.preventDefault();
									}}
									edge="end"
								>
									{showPassword ? <VisibilityOff /> : <Visibility />}
								</IconButton>
							</InputAdornment>
						),
					},
					htmlInput: htmlInputProps,
				}}
			/>
			{options.showPasswordStrengthMeter && (
				<Suspense fallback={null}>
					<PasswordStrength password={value} />
				</Suspense>
			)}
		</FormControl>
	);
};
