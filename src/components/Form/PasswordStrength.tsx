import { Box, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import zxcvbn from 'zxcvbn';

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

export const PasswordStrength = ({ password }: PasswordStrengthProps) => {
	const [strengthScore, setStrengthScore] = useState<number | undefined>();

	useEffect(() => {
		if (password?.length) {
			const { score } = zxcvbn(password);
			setStrengthScore(score);
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
