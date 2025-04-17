import {
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material';
import { MUILinkWithTracking } from '../MUILinkWithTracking';
import { getOsVariantDisplayText } from './utils';
import type { VersionSelectionOptions } from './version';
import { Lightbulb } from '@mui/icons-material';
import { token } from '../../utils/token';
import { Callout } from '../Callout';

const variantInfo: (selected: BuildVariant) => {
	[Key in BuildVariant]: {
		title: React.ReactElement;
		description: React.ReactElement;
	};
} = (selected) => ({
	dev: {
		title: (
			<Stack gap={1} direction="row" alignItems="center">
				<Typography>{getOsVariantDisplayText('dev')}</Typography>
				<Typography
					variant="bodySm"
					color={token('color.text.accent')}
					alignItems="center"
					display="flex"
				>
					<Lightbulb sx={{ width: 14, height: 14 }} />
					Recommended for first time users
				</Typography>
			</Stack>
		),
		description: (
			<Stack gap={1}>
				<Typography>
					Development images should be used when you are developing an
					application and want to use the fast{' '}
					<MUILinkWithTracking href="https://balena.io/docs/development/local-mode/">
						local mode
					</MUILinkWithTracking>{' '}
					workflow.
				</Typography>
				{selected === 'dev' && (
					<Callout severity="warning" size="sm">
						This variant should never be used in production for security
						reasons.{' '}
						<MUILinkWithTracking href="https://docs.balena.io/reference/OS/overview/#development-vs-production-mode">
							Learn more
						</MUILinkWithTracking>
						.
					</Callout>
				)}
			</Stack>
		),
	},

	prod: {
		title: <Typography>{getOsVariantDisplayText('prod')}</Typography>,
		description: (
			<>
				Production images are ready for production deployments, but don&apos;t
				offer easy access for local development.
			</>
		),
	},
});

const BuildVariants = ['dev', 'prod'] as const;
export type BuildVariant = (typeof BuildVariants)[number];
interface VariantSelectorProps {
	version: VersionSelectionOptions | undefined;
	onVariantChange: (isDev: boolean) => void;
	variant: BuildVariant;
}

export const VariantSelector = ({
	version,
	variant,
	onVariantChange,
}: VariantSelectorProps) => {
	return (
		<FormControl>
			<FormLabel>
				<Typography variant="titleSm">Edition</Typography>
			</FormLabel>
			<RadioGroup
				aria-labelledby="variant-radio-buttons-group"
				name="developmentMode"
				key="variant"
				value={variant === 'dev'}
				onChange={(event) => {
					onVariantChange(event.target.value === 'true');
				}}
				sx={{ gap: 2 }}
			>
				{BuildVariants.map((buildVariant, index) => {
					const isDev = buildVariant === 'dev';
					const isDisabled =
						version == null ||
						(version.hasPrebuiltVariants && !version.rawVersions[buildVariant]);

					return (
						<Tooltip
							title={
								isDisabled
									? 'This edition is not available for the selected version'
									: undefined
							}
							key={index}
						>
							<Stack>
								<FormControlLabel
									sx={{ opacity: isDisabled ? 0.4 : 1 }}
									disabled={isDisabled}
									value={isDev}
									control={<Radio />}
									label={variantInfo(variant)[buildVariant].title}
								/>
								<Typography
									sx={{ opacity: isDisabled ? 0.4 : 1 }}
									variant="bodySm"
								>
									{variantInfo(variant)[buildVariant].description}
								</Typography>
							</Stack>
						</Tooltip>
					);
				})}
			</RadioGroup>
		</FormControl>
	);
};
