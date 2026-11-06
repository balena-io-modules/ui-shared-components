import { Stack, Button, Drawer, Link, Switch, Typography } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { getFromLocalStorage, setToLocalStorage } from '../../utils/storage';

const deleteMatchingCookies = (stringsToDelete: string[]) => {
	const cookies = document.cookie.split(';');

	for (const cookie of cookies) {
		const trimmedCookie = cookie.trim();
		const eqPos = trimmedCookie.indexOf('=');
		const name = eqPos > -1 ? trimmedCookie.substr(0, eqPos) : trimmedCookie;

		for (const str of stringsToDelete) {
			if (name.includes(str)) {
				document.cookie =
					name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/';
				break;
			}
		}
	}
};

export interface Cookie {
	title: string;
	description: string;
	value: boolean;
	required?: boolean;
}

export interface CookiesBannerProps {
	show: boolean;
	cookies: Record<string, Cookie>;
	productName: string;
	removeCookies?: string[];
	onInit?: (cookies?: Record<string, Cookie>) => void;
	onChange?: (cookies: Record<string, Cookie>) => void;
	onClose?: (cookies: Record<string, Cookie>) => void;
}

export const CookiesBanner = ({
	show,
	cookies,
	productName,
	removeCookies,
	onInit,
	onChange,
	onClose,
}: CookiesBannerProps) => {
	const [showCustomizeView, setShowCustomizeView] = useState(false);
	const [internalCookies, setInternalCookies] =
		useState<CookiesBannerProps['cookies']>(cookies);
	const localStorageKey = productName + '-cookies-set';

	const handleOnChange = useCallback(
		(key: keyof typeof cookies) => {
			const newCookies = { ...cookies };
			setInternalCookies((oldState) => {
				newCookies[key].value = !oldState[key].value;
				onChange?.(newCookies);
				return { ...oldState, ...newCookies };
			});
		},
		[cookies, onChange],
	);

	const [localStorageCookies, setLocalStorageCookies] = useState<
		Record<string, Cookie> | undefined
	>(() => getFromLocalStorage(localStorageKey));

	const handleSaveOrAcceptAll = useCallback(() => {
		const newCookies: Record<string, Cookie> = { ...cookies };

		for (const cookieKey of Object.keys(cookies)) {
			newCookies[cookieKey].value = !showCustomizeView
				? true
				: internalCookies[cookieKey].value;
		}
		setToLocalStorage(localStorageKey, newCookies);
		onClose?.(newCookies);
		setLocalStorageCookies(newCookies);
	}, [localStorageKey, showCustomizeView, internalCookies, cookies, onClose]);

	const handleReject = useCallback(() => {
		const newCookies: Record<string, Cookie> = { ...cookies };
		for (const cookieKey of Object.keys(cookies)) {
			newCookies[cookieKey].value = false;
		}
		setToLocalStorage(localStorageKey, newCookies);
		setInternalCookies(newCookies);
		onClose?.(newCookies);
		setLocalStorageCookies(newCookies);
	}, [cookies, localStorageKey, onClose]);

	useEffect(() => {
		onInit?.(localStorageCookies);
		// eslint-disable-next-line @eslint-react/exhaustive-deps -- We only want to run this on mount
	}, []);

	if (!show || !!localStorageCookies) {
		return null;
	}

	if (removeCookies?.length && document.cookie) {
		deleteMatchingCookies(removeCookies);
	}

	return (
		<Drawer anchor="bottom" open={show}>
			<Stack sx={{ p: 4 }}>
				{showCustomizeView ? (
					<Stack>
						{Object.entries(internalCookies).map(([key, cookie]) => (
							<Stack
								key={key}
								sx={{
									flexDirection: 'row',
									alignItems: 'center',
									mb: 3,
								}}
							>
								<Stack sx={{ width: '90%' }}>
									<Typography variant="h5">{cookie.title}</Typography>
									<Typography variant="body1">{cookie.description}</Typography>
								</Stack>
								<Stack direction="row">
									<Switch
										checked={cookie.value}
										onChange={() => {
											handleOnChange(key);
										}}
										disabled={cookie.required}
									/>
								</Stack>
							</Stack>
						))}
					</Stack>
				) : (
					<Stack sx={{ flexDirection: 'row', justifyContent: 'center' }}>
						<Typography variant="body1">
							We use cookies to enhance your browsing experience and analyze our
							traffic. By clicking &quot;Accept All&quot; you consent to our use
							of cookies. Read more about our{' '}
							<Link href="https://www.balena.io/privacy-policy" target="_blank">
								privacy policy
							</Link>
							.
						</Typography>
					</Stack>
				)}
				<Stack
					sx={{
						flexDirection: 'row',
						mt: 4,
						ml: 'auto',
						justifyContent: 'space-around',
						width: '400px',
					}}
				>
					<Button variant="outlined" onClick={handleReject}>
						Reject all
					</Button>
					<Button
						variant="outlined"
						onClick={() => {
							setShowCustomizeView(!showCustomizeView);
						}}
					>
						{showCustomizeView ? 'Back' : 'Customize'}
					</Button>
					<Button variant="contained" onClick={handleSaveOrAcceptAll}>
						{showCustomizeView ? 'Save selection' : 'Accept all'}
					</Button>
				</Stack>
			</Stack>
		</Drawer>
	);
};
