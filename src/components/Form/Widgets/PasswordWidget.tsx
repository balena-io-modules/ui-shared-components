import {
	FormControl,
	IconButton,
	InputAdornment,
	TextField,
} from '@mui/material';
import { Suspense, lazy, useState } from 'react';
import type { WidgetProps } from '@rjsf/utils';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
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

	const change = ({ target: { value: val } }: any) => {
		onChange(value === '' ? options.emptyValue : val);
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
					((event: React.FocusEvent<HTMLInputElement>) => {
						onBlur(id, event.target.value);
					})
				}
				onFocus={
					onFocus &&
					((event: React.FocusEvent<HTMLInputElement>) => {
						onFocus(id, event.target.value);
					})
				}
				InputProps={{
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
								{showPassword ? (
									<FontAwesomeIcon icon={faEyeSlash} />
								) : (
									<FontAwesomeIcon icon={faEye} />
								)}
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
