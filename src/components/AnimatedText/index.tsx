import { Collapse, Fade, Grow, Slide, Typography, Zoom } from '@mui/material';
import { useEffect, useRef, useState } from 'react';

export interface AnimatedTextProps {
	words: string[];
	animationType: 'fade' | 'slide' | 'collapse' | 'grow' | 'zoom';
	animationTimeout?: number;
}

/**
 * This component will animate the array of strings passed as words.
 */
export const AnimatedText: React.FC<AnimatedTextProps> = ({
	words,
	animationType,
	animationTimeout = 4000,
}) => {
	const [wordIndex, setWordIndex] = useState(0);
	const [showSlide, setSetShowSlide] = useState(true);
	const indexInterval = useRef<any>();
	const slideInterval = useRef<any>();

	useEffect(() => {
		const setupTimeouts = () => {
			indexInterval.current = setTimeout(() => {
				setSetShowSlide(false);
				slideInterval.current = setTimeout(() => {
					if (wordIndex + 1 === words.length) {
						setWordIndex(0);
					} else {
						setWordIndex(wordIndex + 1);
					}
					setSetShowSlide(true);
				}, animationTimeout - (animationTimeout - 1200));
			}, animationTimeout);
		};
		setupTimeouts();
		return () => {
			clearInterval(indexInterval.current);
			clearInterval(slideInterval.current);
		};
	}, [animationTimeout, wordIndex, words.length]);

	if (animationType === 'grow') {
		return (
			<Grow in={showSlide} timeout={{ enter: 800, exit: 1200 }}>
				<Typography variant="inherit" component="div" color="hubYellow.main">
					{words[wordIndex]}
				</Typography>
			</Grow>
		);
	}
	if (animationType === 'zoom') {
		return (
			<Zoom in={showSlide} timeout={{ enter: 800, exit: 1200 }}>
				<Typography variant="inherit" component="div" color="hubYellow.main">
					{words[wordIndex]}
				</Typography>
			</Zoom>
		);
	}
	if (animationType === 'slide') {
		return (
			<Slide
				direction="down"
				in={showSlide}
				timeout={{ enter: 800, exit: 1200 }}
			>
				<Typography variant="inherit" component="div" color="hubYellow.main">
					{words[wordIndex]}
				</Typography>
			</Slide>
		);
	}
	if (animationType === 'fade') {
		return (
			<Fade in={showSlide} timeout={{ enter: 800, exit: 1200 }}>
				<Typography variant="inherit" component="div" color="hubYellow.main">
					{words[wordIndex]}
				</Typography>
			</Fade>
		);
	}
	return (
		<Collapse
			orientation="horizontal"
			in={showSlide}
			timeout={{ enter: 800, exit: 1200 }}
		>
			<Typography
				variant="inherit"
				component="div"
				color="hubYellow.main"
				sx={{ overflow: 'hidden', whiteSpace: 'nowrap' }}
			>
				{words[wordIndex]}
			</Typography>
		</Collapse>
	);
};
