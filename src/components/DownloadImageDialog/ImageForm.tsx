import {
	Avatar,
	Box,
	Checkbox,
	Chip,
	Divider,
	FormControl,
	FormControlLabel,
	FormLabel,
	InputAdornment,
	Radio,
	RadioGroup,
	TextField,
	Tooltip,
	Typography,
	IconButton,
	Autocomplete,
	Stack,
	Accordion,
	AccordionSummary,
	AccordionDetails,
	accordionSummaryClasses,
} from '@mui/material';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import type { VersionSelectionOptions } from './version';
import { getPreferredVersionOpts, transformVersions } from './version';
import { OsTypeSelector } from './OsTypeSelector';
import type { BuildVariant } from './VariantSelector';
import { VariantSelector } from './VariantSelector';
import type { DownloadImageFormModel } from '.';
import { faFileLines } from '@fortawesome/free-solid-svg-icons/faFileLines';
import { MUILinkWithTracking } from '../MUILinkWithTracking';
import type { DeviceType, Dictionary, OsVersionsByDeviceType } from './models';
import { FALLBACK_LOGO_UNKNOWN_DEVICE } from './utils';
import type { ChipProps } from '../Chip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faChevronRight,
	faEye,
	faEyeSlash,
	faQuestionCircle,
	faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { Callout } from '../Callout';
import { token } from '../../utils/token';

const POLL_INTERVAL_DOCS =
	'https://www.balena.io/docs/reference/supervisor/bandwidth-reduction/#side-effects--warnings';

const getCategorizedVersions = (
	deviceTypeOsVersions: OsVersionsByDeviceType,
	deviceType: DownloadImageFormModel['deviceType'],
	osType: string | null,
) => {
	const osVersions = deviceTypeOsVersions[deviceType.slug] ?? [];
	const deviceOsVersions = osType
		? osVersions.filter((osVersion) => osVersion.osType === osType)
		: osVersions;

	const selectionOpts = transformVersions(deviceOsVersions);
	const preferredSelectionOpts = getPreferredVersionOpts(selectionOpts);

	return {
		selectionOpts,
		preferredSelectionOpts,
	};
};

const lineMap: Dictionary<ChipProps['color']> = {
	next: 'green',
	current: 'teal',
	sunset: 'yellow',
	outdated: 'red',
};

interface ImageFormProps {
	applicationId: number;
	releaseId?: number;
	compatibleDeviceTypes: DeviceType[] | undefined;
	osVersions: OsVersionsByDeviceType;
	osType: string | null;
	osTypes: string[];
	formElement: any;
	downloadUrl: string;
	authToken: string | undefined;
	isInitialDefault?: boolean;
	model: DownloadImageFormModel;
	hasEsrVersions?: boolean;
	onSelectedOsTypeChange: (osType: string) => void;
	// onChange needs to be passing a complete object of changes
	// since when having multipele onChange call, the subsequent ones
	// can have issues b/c of still using the original state, before the
	// previous onChange calls.
	onChange: (obj: Partial<DownloadImageFormModel>) => void;
}

export const ImageForm = memo(function ImageForm({
	compatibleDeviceTypes,
	osVersions,
	isInitialDefault,
	osType,
	osTypes,
	hasEsrVersions,
	model,
	formElement,
	downloadUrl,
	applicationId,
	authToken,
	onSelectedOsTypeChange,
	onChange,
}: ImageFormProps) {
	const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [version, setVersion] = useState<VersionSelectionOptions | undefined>();
	const [variant, setVariant] = useState<BuildVariant>('prod');
	const [showAllVersions, setShowAllVersions] = useState(false);
	const { selectionOpts, preferredSelectionOpts } = useMemo(
		() => getCategorizedVersions(osVersions, model.deviceType, osType),
		[osVersions, model.deviceType, osType],
	);
	const versionSelectionOpts = useMemo(
		() => (showAllVersions ? selectionOpts : preferredSelectionOpts),
		[preferredSelectionOpts, selectionOpts, showAllVersions],
	);
	const showAllVersionsToggle = useMemo(
		() => preferredSelectionOpts.length < selectionOpts.length,
		[preferredSelectionOpts.length, selectionOpts.length],
	);

	const handleVariantChange = useCallback(
		(newVariant: typeof variant) => {
			setVariant(newVariant);
			const newState: Partial<DownloadImageFormModel> = {
				developmentMode: newVariant === 'dev',
			};
			// For non-unified OS releases (ones w/ separate prod & dev releases)
			// we also need to update raw version string, since it's different
			// depending on the variant selected.
			if (version?.hasPrebuiltVariants) {
				const rawVersionForVariant = version.rawVersions[newVariant];
				if (rawVersionForVariant != null) {
					newState.version = rawVersionForVariant;
				}
			}
			onChange(newState);
		},
		[onChange, version],
	);

	const handleVersionChange = useCallback(
		(ver: typeof version) => {
			ver ??=
				versionSelectionOpts.find((v) => v.isRecommended) ??
				versionSelectionOpts[0];
			const newState: Partial<DownloadImageFormModel> = {
				developmentMode: variant === 'dev',
			};
			if (ver?.hasPrebuiltVariants) {
				// For non-unified OS releases (ones w/ separate prod & dev releases)
				// we need to set the correct raw version string based on the selected variant.
				const rawVersionForVariant = ver.rawVersions[variant];
				if (!rawVersionForVariant) {
					handleVariantChange(variant === 'dev' ? 'prod' : 'dev');
					return;
				}
				newState.version = rawVersionForVariant;
			} else {
				newState.version = ver?.rawVersion;
			}
			onChange(newState);
			setVersion(ver);
		},
		[versionSelectionOpts, variant, onChange, handleVariantChange],
	);

	// TODO: Revisit this as it is clearly not using hooks as intended
	useEffect(() => {
		handleVersionChange(undefined);
		// eslint-disable-next-line react-hooks/exhaustive-deps -- we only want to run this effect when the device type changes
	}, [model.deviceType, osType]);

	const handleShowAllVersions = (e: React.ChangeEvent<HTMLInputElement>) => {
		const isChecked = e.target.checked;
		setShowAllVersions(isChecked);

		if (isChecked || !version) {
			return;
		}

		const selectedValueIsPreferred = preferredSelectionOpts.some(
			(ver) => ver.value === version.value,
		);
		if (selectedValueIsPreferred) {
			return;
		}

		const preferred =
			preferredSelectionOpts.find((ver) => ver.isRecommended) ??
			preferredSelectionOpts[0];
		if (preferred) {
			handleVersionChange(preferred);
		}
	};

	const handleSelectedDeviceTypeChange = useCallback(
		(deviceType: DeviceType) => {
			if (model.deviceType.slug === deviceType.slug || !compatibleDeviceTypes) {
				return;
			}

			const newDeviceType = compatibleDeviceTypes.find(
				(cdt) => cdt.slug === deviceType.slug,
			);
			if (!newDeviceType) {
				return;
			}
			onChange({ deviceType: newDeviceType });
		},
		[compatibleDeviceTypes, model.deviceType.slug, onChange],
	);

	const recommendedVersion = useMemo(
		() => versionSelectionOpts.find((v) => !v.knownIssueList?.length)?.value,
		[versionSelectionOpts],
	);

	return (
		<Stack
			action={downloadUrl}
			method="post"
			component="form"
			noValidate
			autoComplete="off"
			ref={formElement}
			gap={3}
		>
			<input type="hidden" name="deviceType" value={model.deviceType.slug} />
			<input type="hidden" name="_token" value={authToken} />
			<input type="hidden" name="appId" value={applicationId} />
			<input type="hidden" name="fileType" value=".zip" />
			<input type="hidden" name="version" value={model.version} />
			<Stack direction="row" flexWrap="wrap" gap={2}>
				{compatibleDeviceTypes && compatibleDeviceTypes.length > 1 && (
					<Autocomplete
						fullWidth
						value={model.deviceType}
						options={compatibleDeviceTypes}
						getOptionLabel={(option) => option.name}
						renderOption={(props, option) => (
							<Box component="li" {...props}>
								<Avatar
									variant="square"
									src={option.logo ?? FALLBACK_LOGO_UNKNOWN_DEVICE}
									sx={{ mr: 3, width: '20px', height: '20px' }}
								/>
								<Typography noWrap>{option.name}</Typography>
							</Box>
						)}
						renderInput={({ InputProps, ...params }) => (
							<TextField
								{...params}
								label={
									<Stack direction="row" alignItems="center" gap={1}>
										Device type
										<Tooltip title="Applications can support any devices that share the same architecture as their default device type.">
											<FontAwesomeIcon
												icon={faQuestionCircle}
												color="info"
												fontSize="1rem"
											/>
										</Tooltip>
									</Stack>
								}
								slotProps={{
									input: {
										...InputProps,
										startAdornment: (
											<Avatar
												variant="square"
												src={
													model.deviceType.logo ?? FALLBACK_LOGO_UNKNOWN_DEVICE
												}
												sx={{ mr: 3, width: '20px', height: '20px' }}
											/>
										),
									},
								}}
							/>
						)}
						onChange={(_event, value) => {
							if (!value) {
								return;
							}
							handleSelectedDeviceTypeChange(value);
						}}
						disableClearable
						// TODO: consider whether there is a better solution than letting the width vary as you search
						slotProps={{
							popper: { sx: { width: 'fit-content' } },
						}}
						sx={{ flex: 1 }}
					/>
				)}
				{(!isInitialDefault || osType) &&
					hasEsrVersions &&
					model.deviceType && (
						<OsTypeSelector
							supportedOsTypes={osTypes}
							hasEsrVersions={hasEsrVersions ?? false}
							selectedOsTypeSlug={osType}
							onSelectedOsTypeChange={onSelectedOsTypeChange}
						/>
					)}
			</Stack>
			{!isInitialDefault && version && (
				<Stack
					direction="row"
					flexWrap="wrap"
					maxWidth="100%"
					gap={2}
					alignItems="center"
				>
					<Autocomplete
						fullWidth
						id="e2e-download-image-versions-list"
						value={version}
						getOptionLabel={(option) => option.value}
						isOptionEqualToValue={(option, value) =>
							option.value === value.value
						}
						options={versionSelectionOpts}
						onChange={(_event, ver) => {
							handleVersionChange(ver);
						}}
						placeholder="Choose a version..."
						renderOption={(props, option) => (
							<Box component="li" {...props}>
								<VersionSelectItem
									option={option}
									isRecommended={option.value === recommendedVersion}
								/>
							</Box>
						)}
						renderInput={({ InputProps, ...params }) => (
							<TextField
								{...params}
								slotProps={{
									input: {
										...InputProps,
										endAdornment: (
											<>
												{version.value === recommendedVersion && (
													<Chip
														sx={{ ml: 1 }}
														color="green"
														label="recommended"
													/>
												)}
												{!!version?.knownIssueList && (
													<Tooltip title={version.knownIssueList}>
														<FontAwesomeIcon
															icon={faTriangleExclamation}
															color={token('color.icon.warning')}
														/>
													</Tooltip>
												)}
												{InputProps.endAdornment}
											</>
										),
									},
								}}
								label="OS version"
							/>
						)}
						disableClearable
						sx={{ flex: 1 }}
					/>
					{showAllVersionsToggle && (
						<FormControlLabel
							control={
								<Checkbox
									id="e2e-show-all-versions-check"
									checked={showAllVersions}
									onChange={handleShowAllVersions}
								/>
							}
							label="Show outdated versions"
							// TODO: Find a better way to center the checkbox with the input only (without the label)
							sx={{ mt: 3 }}
						/>
					)}
				</Stack>
			)}
			<Divider variant="fullWidth" flexItem sx={{ borderStyle: 'dashed' }} />
			{(!isInitialDefault || !variant) && (
				<VariantSelector
					version={version}
					variant={variant}
					onVariantChange={(v) => {
						handleVariantChange(v ? 'dev' : 'prod');
					}}
				/>
			)}
			<Divider variant="fullWidth" flexItem sx={{ borderStyle: 'dashed' }} />
			<Stack>
				<FormControl>
					<FormLabel id="network-radio-buttons-group-label">
						<Typography variant="titleSm">Network</Typography>
					</FormLabel>
					<RadioGroup
						aria-labelledby="network-radio-buttons-group-label"
						value={model.network}
						name="network"
						onChange={(event) => {
							onChange({
								network: event.target
									.value as DownloadImageFormModel['network'],
							});
						}}
					>
						<FormControlLabel
							value="ethernet"
							control={<Radio />}
							label="Ethernet only"
						/>
						<FormControlLabel
							value="wifi"
							control={<Radio />}
							label="Wifi + Ethernet"
						/>
					</RadioGroup>
				</FormControl>
				{model.network === 'wifi' && (
					<Stack gap={3}>
						<TextField
							value={model.wifiSsid}
							id="device-wifi-ssid"
							slotProps={{
								htmlInput: {
									name: 'wifiSsid',
									autoComplete: 'wifiSsid-auto-complete',
								},
							}}
							onChange={(event) => {
								onChange({ wifiSsid: event.target.value });
							}}
							label="WiFi SSID"
						/>
						<TextField
							type={showPassword ? 'text' : 'password'}
							id="device-wifi-password"
							value={model.wifiKey}
							slotProps={{
								htmlInput: {
									name: 'wifiKey',
								},
								// input and htmlInput are different https://mui.com/material-ui/api/text-field/#text-field-prop-slotProps
								input: {
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												onClick={() => {
													setShowPassword((show) => !show);
												}}
												onMouseDown={(
													event: React.MouseEvent<HTMLButtonElement>,
												) => {
													event.preventDefault();
												}}
												edge="end"
											>
												{showPassword ? (
													<FontAwesomeIcon icon={faEyeSlash} />
												) : (
													<FontAwesomeIcon icon={faEye} />
												)}
											</IconButton>
										</InputAdornment>
									),
								},
							}}
							onChange={(event) => {
								onChange({ wifiKey: event.target.value });
							}}
							label="Wifi Passphrase"
						/>
					</Stack>
				)}
			</Stack>
			<Divider variant="fullWidth" sx={{ borderStyle: 'dashed' }} />
			<Accordion
				disableGutters
				elevation={0}
				expanded={showAdvancedSettings}
				onChange={() => {
					setShowAdvancedSettings(!showAdvancedSettings);
				}}
				sx={{
					border: 'none',
					'&::before': {
						display: 'none',
					},
					[`& .${accordionSummaryClasses.expandIconWrapper}.${accordionSummaryClasses.expanded}`]:
						{
							transform: 'rotate(90deg)',
						},
				}}
			>
				<AccordionSummary
					expandIcon={<FontAwesomeIcon icon={faChevronRight} />}
					sx={{ flexDirection: 'row-reverse', gap: 2 }}
				>
					<Typography variant="titleSm">Advanced settings</Typography>
				</AccordionSummary>
				<AccordionDetails
					sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
				>
					<TextField
						value={model.appUpdatePollInterval}
						slotProps={{
							htmlInput: {
								name: 'appUpdatePollInterval',
								autoComplete: 'appUpdatePollInterval-auto-complete',
							},
						}}
						onChange={(event) => {
							onChange({
								appUpdatePollInterval: parseInt(event.target.value, 10),
							});
						}}
						label={
							<Stack direction="row" alignItems="center" gap={1}>
								Check for updates every X minutes{' '}
								<MUILinkWithTracking
									href={POLL_INTERVAL_DOCS}
									sx={{
										display: 'flex',
										alignItems: 'center',
										height: '1.5rem',
										gap: 1,
									}}
								>
									<FontAwesomeIcon icon={faFileLines} fontSize="1.15rem" />
								</MUILinkWithTracking>
							</Stack>
						}
					/>
					<TextField
						name="provisioningKeyName"
						value={model.provisioningKeyName ?? ''}
						slotProps={{
							htmlInput: {
								name: 'provisioningKeyName',
								autoComplete: 'provisioningKeyName-auto-complete',
							},
						}}
						onChange={(event) => {
							onChange({ provisioningKeyName: event.target.value });
						}}
						label="Provisioning Key name"
					/>
					<TextField
						type="date"
						value={model.provisioningKeyExpiryDate ?? ''}
						slotProps={{
							htmlInput: {
								name: 'provisioningKeyExpiryDate',
								autoComplete: 'provisioningKeyExpiryDate-auto-complete',
							},
						}}
						onChange={(event) => {
							onChange({ provisioningKeyExpiryDate: event.target.value });
						}}
						label="Provisioning Key expiring on"
					/>
				</AccordionDetails>
			</Accordion>
		</Stack>
	);
});

// TODO: We need a better way than just copying the styling. Consider creating a component to export
const VersionSelectItem = ({
	option,
	isRecommended,
}: {
	option: {
		title: string;
		knownIssueList: string | null;
		line?: keyof typeof lineMap;
	};
	isRecommended?: boolean;
}) => {
	return (
		<Stack direction="column" flexWrap="wrap" maxWidth="100%" rowGap={1}>
			<Typography noWrap maxWidth="100%" variant="titleSm">
				{option.title}
				{!!option.line && (
					<Chip
						sx={{ ml: 1 }}
						label={option.line}
						color={lineMap[option.line]}
					/>
				)}
				{isRecommended && (
					<Chip sx={{ ml: 1 }} color="green" label="recommended" />
				)}
			</Typography>
			{!!option.knownIssueList && (
				<Callout severity="warning" size="sm">
					{option.knownIssueList}
				</Callout>
			)}
		</Stack>
	);
};
