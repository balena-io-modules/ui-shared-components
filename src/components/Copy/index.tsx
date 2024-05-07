import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Tooltip } from '@mui/material';
import React, { useEffect, useState } from 'react';

export interface CopyProps {
	copy: string | undefined;
	onClick?: () => void;
}

export interface CopyPropsWithChildren extends CopyProps {
	children: React.ReactNode;
	variant?: 'absolute' | 'adjacent';
}

export const copyToClipboard = async (text: string): Promise<void> => {
	try {
		await navigator.clipboard.writeText(text);
	} catch (err) {
		console.error('Failed to copy text: ', err);
	}
};

export const Copy = ({
	copy,
	onClick,
	...props
}: CopyProps | CopyPropsWithChildren) => {
	let closeTooltipTimeout: ReturnType<typeof setInterval> | null = null;
	const [open, setOpen] = useState(false);

	useEffect(() => {
		if (!closeTooltipTimeout) {
			return;
		}
		return clearTimeout(closeTooltipTimeout);
	}, [closeTooltipTimeout]);

	const handleTooltipOpen = () => {
		setOpen(true);
		closeTooltipTimeout = setTimeout(() => setOpen(false), 1000);
	};

	const copyClick = React.useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			handleTooltipOpen();
			onClick?.();
			// TODO: Just to make TS happy. This will never happen because we return null if there is no copy prop
			if (copy) {
				copyToClipboard(copy);
			}
		},
		[onClick, copy],
	);

	if (!copy) {
		return null;
	}

	const copyComponent = (
		<Tooltip
			title="Copied!"
			disableFocusListener
			disableHoverListener
			disableTouchListener
			open={open}
			PopperProps={{
				disablePortal: true,
			}}
			placement="top"
		>
			<FontAwesomeIcon
				icon={faCopy}
				onClick={copyClick}
				className="copy"
				size="sm"
				style={{
					cursor: 'pointer',
					...('variant' in props &&
						props.variant === 'absolute' && {
							position: 'absolute',
						}),
				}}
			/>
		</Tooltip>
	);

	if (!('children' in props)) {
		return copyComponent;
	}

	const { children, variant = 'adjacent' } = props;

	if (variant === 'adjacent') {
		return (
			<Box
				sx={{
					display: 'flex',
					alignItems: 'flex-start',
					'.copy': { display: 'none' },
					// TODO: consider what to do about the shifting content when the copy icon appears
					'&:hover': { '.copy': { display: 'block' } },
					gap: 1,
					width: 'fit-content',
					maxWidth: '100%',
				}}
			>
				{children}
				{copyComponent}
			</Box>
		);
	}

	const randomUUID = crypto.randomUUID();

	return (
		<Box
			sx={{
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				'.copy': {
					display: 'none',
				},
				'&:hover': {
					[`.copy-children-container-${randomUUID}`]: {
						opacity: 0.4,
						transition: 'opacity 250ms',
					},
					'.copy': { display: 'block' },
					cursor: 'pointer',
				},
			}}
			onClick={copyClick}
		>
			<Box className={`copy-children-container-${randomUUID}`}>{children}</Box>
			{copyComponent}
		</Box>
	);
};
