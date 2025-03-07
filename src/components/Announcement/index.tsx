import * as React from 'react';
import { Typography } from '@mui/material';
import type { SlideProps, SxProps } from '@mui/material';
import {
	Box,
	Slide,
	Snackbar,
	Stack,
	styled,
	useThemeProps,
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClose } from '@fortawesome/free-solid-svg-icons/faClose';
import { shape } from '@balena/design-tokens';
import { IconButtonWithTracking } from '../IconButtonWithTracking';
import { useEffect } from 'react';
import { useAnalyticsContext } from '../../contexts/AnalyticsContext';
import type { SnackbarCloseReason } from '@mui/material/Snackbar/Snackbar';

export type AnnouncementCloseReason =
	| SnackbarCloseReason
	| 'closeButtonClick'
	| 'linkClick';

export interface AnnouncementProps {
	open?: boolean;
	onClose: (
		event: React.SyntheticEvent<any> | Event,
		reason: AnnouncementCloseReason,
	) => void;
	campaignId: string;
	children: React.ReactNode;
	illustration?: React.ReactNode;
	title: string;
	sx?: SxProps;
}

const AnnouncementRoot = styled(Box, {
	name: 'Announcement',
	slot: 'root',
})(({ theme }) => ({
	alignItems: 'center',
	backgroundColor: 'white',
	borderRadius: shape.border_radius.md.value + 'px',
	boxShadow: '0px 0px 8px 0px rgba(35, 68, 94, 0.3)', // TODO add a design token for box shadows
	display: 'flex',
	gap: theme.spacing(3),
	maxWidth: '100%',
	padding: theme.spacing(3),
	width: '100%',
}));

const AnnouncementIllustration = styled('figure', {
	name: 'Announcement',
	slot: 'illustration',
})(({ theme }) => ({
	margin: 0,
	maxWidth: 48,
	minWidth: 48,
	[theme.breakpoints.up('sm')]: {
		maxWidth: 72,
	},
	'& *': {
		width: '100%',
	},
}));

const AnnouncementTitle = styled('h3', {
	name: 'Announcement',
	slot: 'title',
})(({ theme }) => ({
	...theme.typography.bodyLg,
	margin: 0,
	display: 'flex',
	alignItems: 'center',
	gap: theme.spacing(1),
}));

const AnnouncementContent = styled(Stack, {
	name: 'Announcement',
	slot: 'content',
})(({ theme }) => ({
	flexGrow: 1,
	gap: theme.spacing(1),
	[theme.breakpoints.up('sm')]: {
		gap: theme.spacing(2),
	},
}));

function SlideTransition(props: SlideProps) {
	return <Slide {...props} direction="up" />;
}

/**
 * This component is a notification intended to be displayed in the bottom right
 * corner of the screen, usually sharing updates on the product with our users.
 *
 * This is a Themed Component as documented here: https://mui.com/material-ui/customization/creating-themed-components/.
 * As such, it can be modified in the theme.
 */
export const Announcement = React.forwardRef<HTMLDivElement, AnnouncementProps>(
	function Announcement(inProps, ref) {
		const props = useThemeProps({ props: inProps, name: 'Announcement' });
		const {
			illustration,
			campaignId,
			children,
			title,
			onClose,
			open,
			sx,
			...other
		} = props;
		const { state: analytics } = useAnalyticsContext();

		// TODO remove this event after the first campaign, when we are sure that the notification is being shown properly
		useEffect(() => {
			if (open) {
				analytics.webTracker?.track('Announcement displayed', {
					campaign_id: campaignId,
				});
			}
		}, [open, analytics.webTracker, campaignId]);

		return (
			<Snackbar
				open={open}
				anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
				TransitionComponent={SlideTransition}
				key={SlideTransition.name}
				ref={ref}
				onClose={onClose}
				sx={[
					(theme) => ({
						zIndex: theme.zIndex.drawer - 1,
						[theme.breakpoints.up('sm')]: {
							maxWidth: 350,
						},
					}),
					// See: https://mui.com/system/getting-started/the-sx-prop/#passing-the-sx-prop
					...(Array.isArray(sx) ? sx : [sx]),
				]}
			>
				<AnnouncementRoot {...other}>
					{illustration && (
						<AnnouncementIllustration>{illustration}</AnnouncementIllustration>
					)}
					<AnnouncementContent>
						<AnnouncementTitle>
							{title}
							<IconButtonWithTracking
								edge="end"
								size="small"
								eventName="Announcement dismissed"
								eventProperties={{ campaign_id: campaignId }}
								onClick={(e) => {
									onClose?.(e, 'closeButtonClick');
								}}
								sx={{ ml: 'auto', my: -1 }}
							>
								<FontAwesomeIcon icon={faClose} />
							</IconButtonWithTracking>
						</AnnouncementTitle>
						<Typography>{children}</Typography>
					</AnnouncementContent>
				</AnnouncementRoot>
			</Snackbar>
		);
	},
);
