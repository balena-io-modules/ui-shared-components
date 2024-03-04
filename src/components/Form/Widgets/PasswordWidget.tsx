import {
	FormControl,
	IconButton,
	InputAdornment,
	TextField,
} from '@mui/material';
import { Suspense, lazy, useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { WidgetProps } from '@rjsf/utils';
export interface PasswordStrengthProps {
	password?: string;
}

const PasswordStrength = lazy(async () => {
	const importedModule = await import('../PasswordStrength');
	return {
		default: importedModule.PasswordStrength,
	};
});

export const PasswordWidget = ({
	id,
	label,
	value,
	disabled,
	name,
	placeholder,
	onBlur,
	onChange,
	onFocus,
	options,
	required,
}: WidgetProps) => {
	const [showPassword, setShowPassword] = useState(false);

	const change = ({ target: { value } }: any) => {
		return onChange(value === '' ? options.emptyValue : value);
	};

	return (
		<FormControl>
			<TextField
				label={label}
				required={required}
				id={id}
				type={showPassword ? 'text' : 'password'}
				{...{
					value,
					disabled,
					name,
					placeholder,
				}}
				onChange={change}
				onBlur={
					onBlur &&
					((event: React.FocusEvent<HTMLInputElement, Element>) =>
						onBlur(id, event.target.value))
				}
				onFocus={
					onFocus &&
					((event: React.FocusEvent<HTMLInputElement, Element>) =>
						onFocus(id, event.target.value))
				}
				InputProps={{
					endAdornment: (
						<InputAdornment position="end">
							<IconButton
								onClick={() => setShowPassword((show) => !show)}
								onMouseDown={(event: React.MouseEvent<HTMLButtonElement>) => {
									event.preventDefault();
								}}
								edge="end"
							>
								{showPassword ? <VisibilityOff /> : <Visibility />}
							</IconButton>
						</InputAdornment>
					),
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
