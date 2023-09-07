import { Box, Button, Drawer, Link, Switch, Typography } from '@mui/material';
import { useCallback, useState } from 'react';
import { getFromLocalStorage, setToLocalStorage } from '../../utils/storage';

interface Dictionary<T> {
	[key: string]: T;
}

export interface Cookie {
	title: string;
	description: string;
	value: boolean;
	required?: boolean;
}

export interface CookiesBannerProps {
	show: boolean;
	productName: string;
	cookies: Dictionary<Cookie>;
	onChange?: (cookies: Dictionary<Cookie>) => void;
	onClose?: (cookies: Dictionary<Cookie>) => void;
}

export const CookiesBanner = ({
	show,
	productName,
	cookies,
	onChange,
	onClose,
}: CookiesBannerProps) => {
	const [showCustomizeView, setShowCustomizeView] = useState(false);
	const localStorageKey = productName + '-cookies-set';

	const handleOnChange = useCallback(
		(checked: boolean, key: keyof typeof cookies) => {
			const newCookies = { ...cookies };
			newCookies[key].value = checked;
			onChange?.(newCookies);
		},
		[cookies, onChange],
	);

	const handleSaveOrAcceptAll = useCallback(() => {
		const newCookies: Dictionary<Cookie> = { ...cookies };
		if (!showCustomizeView) {
			for (const cookieKey of Object.keys(cookies)) {
				newCookies[cookieKey].value = true;
			}
		}
		setToLocalStorage(localStorageKey, newCookies);
		onClose?.(newCookies);
	}, [localStorageKey, showCustomizeView, cookies, onClose]);

	const handleReject = useCallback(() => {
		const newCookies: Dictionary<Cookie> = { ...cookies };
		for (const cookieKey of Object.keys(cookies)) {
			newCookies[cookieKey].value = false;
		}
		setToLocalStorage(localStorageKey, newCookies);
		onClose?.(newCookies);
	}, [localStorageKey, cookies, onClose]);

	const localStorageCookies = getFromLocalStorage(localStorageKey);

	if (!show || !!localStorageCookies) {
		return null;
	}

	return (
		<Drawer anchor="bottom" open={show} disableEscapeKeyDown>
			<Box display="flex" flexDirection="column" p={4}>
				{showCustomizeView ? (
					<Box display="flex" flexDirection="column">
						{Object.entries(cookies).map(([key, cookie]) => (
							<Box display="flex" alignItems="center" mb={3} key={key}>
								<Box display="flex" flexDirection="column" width="90%">
									<Typography variant="h5">{cookie.title}</Typography>
									<Typography variant="body1">{cookie.description}</Typography>
								</Box>
								<Box display="flex">
									<Switch
										checked={cookie.value}
										onChange={(_event, checked) => handleOnChange(checked, key)}
										disabled={cookie.required}
									/>
								</Box>
							</Box>
						))}
					</Box>
				) : (
					<Box display="flex" justifyContent="center">
						<Typography variant="body1">
							We use cookies to enhance your browsing experience and analyze our
							traffic. By clicking "Accept All" you consent to our use of
							cookies. Read more about our{' '}
							<Link href="https://www.balena.io/privacy-policy" target="_blank">
								privacy policy
							</Link>
							.
						</Typography>
					</Box>
				)}
				<Box
					display="flex"
					mt={4}
					ml="auto"
					justifyContent="space-around"
					width="400px"
				>
					<Button variant="outlined" onClick={handleReject}>
						Reject all
					</Button>
					<Button
						variant="outlined"
						onClick={() => setShowCustomizeView(!showCustomizeView)}
					>
						{showCustomizeView ? 'Back' : 'Customize'}
					</Button>
					<Button variant="contained" onClick={handleSaveOrAcceptAll}>
						{showCustomizeView ? 'Save selection' : 'Accept all'}
					</Button>
				</Box>
			</Box>
		</Drawer>
	);
};
