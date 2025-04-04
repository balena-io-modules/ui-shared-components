import {
	Box,
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
	Tooltip,
	Typography,
} from '@mui/material';
import { MUILinkWithTracking } from '../MUILinkWithTracking';
import { getOsVariantDisplayText } from './utils';
import type { VersionSelectionOptions } from './version';
import { Lightbulb } from '@mui/icons-material';
import { token } from '../../utils/token';

const variantInfo: {
	[Key in BuildVariant]: {
		title: React.ReactElement;
		description: React.ReactElement;
	};
} = {
	dev: {
		title: (
			<Box display="flex" gap={1} flexDirection="row" alignItems="center">
				<Typography>{getOsVariantDisplayText('dev')}</Typography>
				<Typography
					variant="bodySm"
					color={token('color.text')}
					alignItems="center"
					display="flex"
				>
					<Lightbulb sx={{ width: 14, height: 14 }} />
					Recommended for first time users
				</Typography>
			</Box>
		),
		description: (
			<>
				Development images should be used when you are developing an application
				and want to use the fast{' '}
				<MUILinkWithTracking href="https://balena.io/docs/development/local-mode/">
					local mode
				</MUILinkWithTracking>{' '}
				workflow{' '}
				<strong>This variant should never be used in production.</strong>
			</>
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
};

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
			<FormLabel>Select edition</FormLabel>
			<RadioGroup
				aria-labelledby="variant-radio-buttons-group"
				name="developmentMode"
				key="varian"
				value={variant === 'dev'}
				onChange={(event) => {
					onVariantChange(event.target.value === 'true');
				}}
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
							<Box display="flex" flexDirection="column">
								<FormControlLabel
									sx={{ opacity: isDisabled ? 0.4 : 1 }}
									disabled={isDisabled}
									value={isDev}
									control={<Radio />}
									label={variantInfo[buildVariant].title}
								/>
								<Typography
									sx={{ opacity: isDisabled ? 0.4 : 1 }}
									variant="bodySm"
								>
									{variantInfo[buildVariant].description}
								</Typography>
							</Box>
						</Tooltip>
					);
				})}
			</RadioGroup>
		</FormControl>
	);
};
