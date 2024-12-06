import { Chip } from '@mui/material';

export interface NewChipProps {
	/** ISO string date upon which to stop showing the chip */
	expiryTimestamp: string;
}

/**
 * This component will render a `New` chip which will automatically stop displaying after the given date.
 */
export const NewChip = ({ expiryTimestamp }: NewChipProps) => {
	const expiryDate = new Date(expiryTimestamp);

	if (Date.now() > expiryDate.getTime()) {
		return null;
	}

	return <Chip label="New" color="purple" />;
};
