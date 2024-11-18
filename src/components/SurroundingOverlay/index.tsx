import { useCallback, useEffect, useRef, useState } from 'react';
import { Box, styled, type CSSObject } from '@mui/material';

const Layer = styled(Box)<Omit<SurroundingOverlayProps, 'targetElement'>>(
	({ layerColor = 'white', opacity = 0.5, theme }) => ({
		position: 'absolute',
		backgroundColor: layerColor,
		opacity,
		// Select papers, tooltips... want to appear on top of the layer so we get the smallest zIndex in the theme
		zIndex: theme.zIndex.fab,
	}),
);

const getClickedRect = (
	element: HTMLElement | null,
	container: HTMLElement | null,
) => {
	if (!element || !container) {
		return;
	}
	const rect = element.getBoundingClientRect();
	const rectContainer = container.getBoundingClientRect();
	return {
		top: rect.top - rectContainer.top,
		right: rectContainer.right - rect.right,
		bottom: rect.bottom - rectContainer.bottom,
		left: rect.left - rectContainer.left,
		width: rect.width,
		height: rect.height,
	};
};

export interface SurroundingOverlayProps {
	targetElement: HTMLElement | null;
	scrollingElement?: HTMLElement;
	layerColor?: CSSObject['color'];
	padding?: number;
	opacity?: number;
}

export const SurroundingOverlay = ({
	children,
	targetElement,
	scrollingElement,
	padding = 0,
	...otherProps
}: React.PropsWithChildren<SurroundingOverlayProps>) => {
	const containerRef = useRef<HTMLElement>(null);
	const [clickedRect, setClickedRect] =
		useState<ReturnType<typeof getClickedRect>>();

	const updateRect = useCallback(() => {
		const rect = getClickedRect(targetElement, containerRef.current);
		setClickedRect(rect);
	}, [setClickedRect, targetElement, containerRef]);

	useEffect(() => {
		window.addEventListener('resize', () => {
			updateRect();
		});
		scrollingElement?.addEventListener('scroll', () => {
			updateRect();
		});

		updateRect();

		return () => {
			window.removeEventListener('resize', () => {
				updateRect();
			});
			scrollingElement?.removeEventListener('scroll', () => {
				updateRect();
			});
		};
	}, [scrollingElement, targetElement, updateRect, containerRef]);

	return (
		<Box ref={containerRef} position="relative">
			{children}
			{clickedRect && Object.values(clickedRect).every((v) => v != null) && (
				<>
					{/* Box from top to Y */}
					<Layer
						{...otherProps}
						sx={{
							top: 0,
							left: 0,
							right: 0,
							height: clickedRect.top - padding,
						}}
					/>
					{/* Box from bottom to Y */}
					<Layer
						{...otherProps}
						sx={{
							top: clickedRect.top + clickedRect.height + padding,
							left: 0,
							right: 0,
							bottom: 0,
						}}
					/>
					{/* Box from left to X */}
					<Layer
						{...otherProps}
						sx={{
							top: clickedRect.top - padding,
							left: 0,
							height: clickedRect.height + padding * 2,
							width: clickedRect.left - padding,
						}}
					/>
					{/* Box from right to X */}
					<Layer
						{...otherProps}
						sx={{
							top: clickedRect.top - padding,
							right: 0,
							height: clickedRect.height + padding * 2,
							width: clickedRect.right - padding,
						}}
					/>
				</>
			)}
		</Box>
	);
};
