import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Tooltip, useTheme } from '@mui/material';
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
	const [closeTooltipTimeout, setCloseTooltipTimeout] = useState<ReturnType<
		typeof setInterval
	> | null>(null);
	const [open, setOpen] = useState(false);
	const theme = useTheme();

	useEffect(() => {
		if (!closeTooltipTimeout) {
			return;
		}
		return () => clearTimeout(closeTooltipTimeout);
	}, [closeTooltipTimeout]);

	const handleTooltipOpen = () => {
		setOpen(true);
		if (closeTooltipTimeout != null) {
			clearTimeout(closeTooltipTimeout);
		}
		setCloseTooltipTimeout(setTimeout(() => setOpen(false), 1000));
	};

	const copyClick = React.useCallback(
		(e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			// TODO: Just to make TS happy. This will never happen because we return null if there is no copy prop
			if (!copy) {
				return;
			}
			handleTooltipOpen();
			onClick?.();
			copyToClipboard(copy);
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
					padding: theme.spacing(1),
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
					alignItems: 'center',
					'.copy': {
						transition: '.15s all .1s',
						opacity: 0,
						visibility: 'hidden',
					},
					'&:hover': {
						'.copy': {
							opacity: 1,
							visibility: 'visible',
						},
					},
					width: 'fit-content',
					maxWidth: '100%',
				}}
			>
				{children}
				{copyComponent}
			</Box>
		);
	}

	return (
		<Box
			sx={{
				display: 'inline-flex',
				alignItems: 'center',
				justifyContent: 'center',
				position: 'relative',
				'.copy': {
					visibility: 'hidden',
					opacity: 0,
					transition: '.15s all .1s',
				},
				'.copy-children-container': {
					transition: '.15s opacity .1s',
				},
				'&:hover': {
					'.copy-children-container': {
						opacity: 0.4,
					},
					'.copy': { visibility: 'visible', opacity: 1 },
					cursor: 'pointer',
				},
			}}
			onClick={copyClick}
		>
			<Box className="copy-children-container">{children}</Box>
			{copyComponent}
		</Box>
	);
};
