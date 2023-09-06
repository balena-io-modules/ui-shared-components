import {
	Alert,
	FormControl,
	FormControlLabel,
	FormLabel,
	Radio,
	RadioGroup,
	Typography,
} from '@mui/material';
import { MUILinkWithTracking } from '../MUILinkWithTracking';
import { BuildVariant } from './ImageForm';
import { getOsVariantDisplayText } from './utils';
import { VersionSelectionOptions } from './version';

interface VaraintSelectorProps {
	version: VersionSelectionOptions | undefined;
	onVariantChange: (variant: BuildVariant) => void;
	variant: BuildVariant;
}

const BuildVariants = ['dev', 'prod'] as const;

export const VariantSelector: React.FC<VaraintSelectorProps> = ({
	version,
	variant,
	onVariantChange,
}) => {
	return (
		<FormControl>
			<FormLabel>Select edition</FormLabel>
			<RadioGroup
				aria-labelledby="vairnat-radio-buttons-group"
				name="varaint-controlled-radio-buttons-group"
				value={variant}
				onChange={(event) =>
					onVariantChange(event.target.value as BuildVariant)
				}
			>
				{BuildVariants.map((buildVariant) => {
					const label = (
						<Typography fontWeight="bold">
							{getOsVariantDisplayText(buildVariant)}
						</Typography>
					);
					const isDev = buildVariant === 'dev';
					return (
						<>
							<FormControlLabel
								disabled={
									version == null ||
									(version.hasPrebuiltVariants &&
										!version.rawVersions[buildVariant])
								}
								value={buildVariant}
								control={<Radio />}
								label={
									isDev ? (
										<>
											{label}
											<Alert sx={{ ml: 3 }} color="info">
												Recommended for first time users
											</Alert>
										</>
									) : (
										label
									)
								}
							/>
							{isDev ? (
								<Typography variant="smallText" mt={1} mb={3}>
									Development images should be used when you are developing an
									application and want to use the fast{' '}
									<MUILinkWithTracking
										href="https://balena.io/docs/development/local-mode/"
										target="_blank"
									>
										local mode
									</MUILinkWithTracking>{' '}
									workflow{' '}
									<strong>
										This variant should never be used in production.
									</strong>
								</Typography>
							) : (
								<Typography variant="smallText" mt={1}>
									Production images are ready for production deployments, but
									don't offer easy access for local development.
								</Typography>
							)}
						</>
					);
				})}
			</RadioGroup>
		</FormControl>
	);
};
