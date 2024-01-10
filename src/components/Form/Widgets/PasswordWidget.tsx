import {
	Box,
	FormControl,
	IconButton,
	InputAdornment,
	TextField,
	Typography,
} from '@mui/material';
import * as React from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { WidgetProps } from '@rjsf/utils';

const STRENGTH_TITLES = ['Very weak', 'Weak', 'Good', 'Strong', 'Very strong'];
const STRENGTH_STYLES = [
	{ width: 0 },
	{ width: '25%', backgroundColor: 'orange' },
	{ width: '50%', backgroundColor: 'yellow' },
	{ width: '75%', backgroundColor: 'green' },
	{ width: '100%', backgroundColor: 'darkgreen' },
];

export interface PasswordStrengthProps {
	password?: string;
}

const PasswordStrength = ({ password }: PasswordStrengthProps) => {
	const [strengthScore, setStrengthScore] = React.useState<
		number | undefined
	>();

	React.useEffect(() => {
		// @ts-expect-error If you wish to show a stength meter, you need to load and set `zxcvbn` to a window variable by yourself.
		const zxcvbn = window.zxcvbn;

		if (zxcvbn && password) {
			try {
				const { score } = zxcvbn(password);
				setStrengthScore(score);
			} catch {
				// Ignore any errors, as we only want to show the strength meter if it is available.
			}
		}
	}, [password]);

	if (!password || strengthScore === undefined) {
		return null;
	}

	return (
		<Box>
			<Typography>
				Password strength: <em>{STRENGTH_TITLES[strengthScore]}</em>
			</Typography>
			<Box
				sx={[
					STRENGTH_STYLES[strengthScore],
					{ height: '4px', transition: 'all ease-out 150ms' },
				]}
			/>
		</Box>
	);
};

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
	const [showPassword, setShowPassword] = React.useState(false);

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
				<PasswordStrength password={value} />
			)}
		</FormControl>
	);
};
