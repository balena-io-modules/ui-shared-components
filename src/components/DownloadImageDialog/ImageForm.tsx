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
	Switch,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import type { VersionSelectionOptions } from './version';
import { getPreferredVersionOpts, transformVersions } from './version';
import { OsTypeSelector } from './OsTypeSelector';
import type { BuildVariant } from './VariantSelector';
import { VariantSelector } from './VariantSelector';
import type { DownloadImageFormModel } from '.';
import ArticleIcon from '@mui/icons-material/Article';
import { MUILinkWithTracking } from '../MUILinkWithTracking';
import type { DeviceType, Dictionary, OsVersionsByDeviceType } from './models';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FALLBACK_LOGO_UNKNOWN_DEVICE } from './utils';
import type { ChipProps } from '../Chip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faChevronRight,
	faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import * as semver from 'balena-semver';
import { Callout } from '../Callout';
import { getFromLocalStorage, setToLocalStorage } from '../../utils/storage';
import { NewChip } from '../NewChip';
import { useAnalyticsContext } from '../../contexts/AnalyticsContext';
import { token } from '../../utils/token';

const POLL_INTERVAL_DOCS =
	'https://www.balena.io/docs/reference/supervisor/bandwidth-reduction/#side-effects--warnings';
const SECURE_BOOT_AND_FULL_DISK_ENCRYPTION_DOCS =
	'https://docs.balena.io/reference/OS/secure-boot-and-full-disk-encryption/overview/';

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
	onChange: (
		key: keyof DownloadImageFormModel,
		value: DownloadImageFormModel[keyof DownloadImageFormModel],
	) => void;
}

export const GENERIC_X86_SLUG = 'generic-amd64';
export const GENERIC_X86_MINIMUM_SUPPORTED_SECUREBOOT_VERSION = '5.3.15';

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
	const { state } = useAnalyticsContext();

	const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
	const [
		showSecureBootConfirmationDialog,
		setShowSecureBootConfirmationDialog,
	] = useState(false);
	const [dontShowSecureBootWarningAgain, setDontShowSecureBootWarningAgain] =
		useState(false);
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

	const supportsSecureBoot = useMemo(() => {
		return (
			model.deviceType.slug === GENERIC_X86_SLUG &&
			semver.gte(
				model.version,
				GENERIC_X86_MINIMUM_SUPPORTED_SECUREBOOT_VERSION,
			)
		);
	}, [model.deviceType.slug, model.version]);

	const secureBootDontShowAgainKey = `${model.deviceType.slug}_secureboot_warning_do_not_show_again`;

	const dismissSecureBootWarning = useCallback(
		(accepted: boolean, dontShowAgain: boolean) => {
			setShowSecureBootConfirmationDialog(false);
			state.webTracker?.track(
				'Application Add Device Modal Hide Secure Boot Warning',
				{ accepted, dontShowAgain },
			);
			setDontShowSecureBootWarningAgain(false);
		},
		[state.webTracker],
	);

	const handleVariantChange = useCallback(
		(v: typeof variant) => {
			setVariant(v);
			onChange('developmentMode', v === 'dev');
		},
		[onChange],
	);

	const handleVersionChange = useCallback(
		(ver: typeof version) => {
			ver ??=
				versionSelectionOpts.find((v) => v.isRecommended) ??
				versionSelectionOpts[0];
			if (ver?.hasPrebuiltVariants) {
				const rawVersionForVariant = ver.rawVersions[variant];
				if (rawVersionForVariant) {
					onChange('version', rawVersionForVariant);
					setVersion(ver);
				} else {
					handleVariantChange(variant === 'dev' ? 'prod' : 'dev');
				}
				return;
			}
			onChange('version', ver?.rawVersion);
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
			onChange('deviceType', newDeviceType);
		},
		[compatibleDeviceTypes, model.deviceType.slug, onChange],
	);

	const recommendedVersion = useMemo(
		() => versionSelectionOpts.find((v) => !v.knownIssueList?.length)?.value,
		[versionSelectionOpts],
	);

	return (
		<>
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
												<HelpIcon color="info" sx={{ fontSize: '1rem' }} />
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
														model.deviceType.logo ??
														FALLBACK_LOGO_UNKNOWN_DEVICE
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
								onChange('network', event.target.value);
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
									onChange('wifiSsid', event.target.value);
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
													{showPassword ? <VisibilityOff /> : <Visibility />}
												</IconButton>
											</InputAdornment>
										),
									},
								}}
								onChange={(event) => {
									onChange('wifiKey', event.target.value);
								}}
								label="Wifi Passphrase"
							/>
						</Stack>
					)}
				</Stack>
				{supportsSecureBoot && (
					<>
						<Divider
							variant="fullWidth"
							sx={{ my: 3, borderStyle: 'dashed' }}
						/>
						<FormControl>
							<FormLabel id="secure-boot-and-full-disk-encryption-label">
								<Stack direction="row" alignItems="center" gap={1}>
									<Typography variant="titleSm">
										Secure Boot and Full Disk Encryption
									</Typography>
									{/* TODO: Pick an actualy expiry date */}
									<NewChip expiryTimestamp="2025-06-01" />
								</Stack>
							</FormLabel>
							<FormControlLabel
								control={
									<Switch
										onClick={(event) => {
											if (
												!model.secureboot &&
												!getFromLocalStorage(secureBootDontShowAgainKey)
											) {
												event.preventDefault();
												setShowSecureBootConfirmationDialog(true);
												if (state.webTracker) {
													state.webTracker.track(
														'Application Add Device Modal Show Secure Boot Warning',
													);
												}
											}
										}}
										onChange={(event) => {
											onChange('secureboot', event.target.checked);
										}}
										checked={model.secureboot}
									/>
								}
								label={
									<Stack direction="row">
										<Typography>
											Enable Secure Boot and Full Disk Encryption
										</Typography>
										<MUILinkWithTracking
											eventProperties={{
												source:
													'Application Add Device Modal Secure Boot Doc Icon',
											}}
											href={SECURE_BOOT_AND_FULL_DISK_ENCRYPTION_DOCS}
											sx={{
												display: 'flex',
												alignItems: 'center',
												height: '1.5rem',
											}}
										>
											<ArticleIcon sx={{ ml: 1, fontSize: '1.15rem' }} />
										</MUILinkWithTracking>
									</Stack>
								}
							/>
						</FormControl>
					</>
				)}
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
								onChange('appUpdatePollInterval', event.target.value);
							}}
							label={
								<Stack direction="row" alignItems="center" gap={1}>
									Check for updates every X minutes{' '}
									<MUILinkWithTracking
										eventProperties={{
											source:
												'Application Add Device Modal Poll Interval Doc Icon',
										}}
										href={POLL_INTERVAL_DOCS}
										sx={{
											display: 'flex',
											alignItems: 'center',
											height: '1.5rem',
										}}
									>
										<ArticleIcon sx={{ ml: 1, fontSize: '1.15rem' }} />
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
								onChange('provisioningKeyName', event.target.value);
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
								onChange('provisioningKeyExpiryDate', event.target.value);
							}}
							label="Provisioning Key expiring on"
						/>
					</AccordionDetails>
				</Accordion>
			</Stack>
			<Dialog
				open={showSecureBootConfirmationDialog}
				onClose={() => {
					dismissSecureBootWarning(false, dontShowSecureBootWarningAgain);
				}}
			>
				<DialogTitle>Enabling Secure Boot and Full Disk Encryption</DialogTitle>
				<DialogContent>
					<Stack>
						Enabling Secure Boot and Full Disk Encryption has important
						implications:
						<ul>
							<li>
								The image you are about to download is{' '}
								<MUILinkWithTracking
									eventProperties={{
										source:
											"Application Add Device Modal Secure Boot Warning signed with balena's main platform key Link",
									}}
									href="https://docs.balena.io/reference/OS/secure-boot-and-full-disk-encryption/overview/#keys-and-certificates-in-secure-boot"
								>
									signed with balena&apos;s main platform key
								</MUILinkWithTracking>
							</li>
							<li>
								Full Disk Encryption (FDE): All data on the disk will be
								encrypted with a unique key per device, ensuring that data
								extraction or retrieval from a powered-off device is impossible.
							</li>
							<li>
								Secure Boot: Ensures only OS images signed by balena can unlock
								the disks and access data stored on the device. Hardened Mode
								Limitations:
								<ul>
									<li>Unsigned kernel modules cannot be loaded.</li>
									<li>Boot parameters cannot be modified.</li>
									<li>
										Debugging early boot processes is practically impossible.
									</li>
								</ul>
							</li>
						</ul>
						<Typography>
							If you need to load out-of-tree kernel drivers or require a unique
							signing key,{' '}
							<MUILinkWithTracking
								eventProperties={{
									source:
										'Application Add Device Modal Secure Boot Warning Contact Us Link',
								}}
								href="mailto:sales@balena.io"
								target="_self"
							>
								contact us
							</MUILinkWithTracking>{' '}
							to discuss your specific requirements.
						</Typography>
						<MUILinkWithTracking
							eventProperties={{
								source:
									'Application Add Device Modal Secure Boot Warning Learn More Link',
							}}
							href="https://docs.balena.io/reference/OS/secure-boot-and-full-disk-encryption/overview/"
						>
							Learn more about Secure Boot and Full Disk Encryption.
						</MUILinkWithTracking>
						<FormControlLabel
							control={
								<Checkbox
									onChange={(event) => {
										setDontShowSecureBootWarningAgain(event.target.checked);
									}}
								/>
							}
							label="Don't show me this warning again for this device type"
							sx={{ mt: 2 }}
						/>
					</Stack>
				</DialogContent>
				<DialogActions>
					<Button
						aria-label="Go back and do not acknowledge Secure Boot and Full Disk Encryption warning"
						onClick={() => {
							dismissSecureBootWarning(false, dontShowSecureBootWarningAgain);
						}}
						variant="outlined"
						color="secondary"
					>
						Cancel
					</Button>
					<Button
						aria-label="Acknowledge Secure Boot and Full Disk Encryption warning"
						onClick={() => {
							onChange('secureboot', true);
							if (dontShowSecureBootWarningAgain) {
								setToLocalStorage(secureBootDontShowAgainKey, 'true');
							}
							dismissSecureBootWarning(true, dontShowSecureBootWarningAgain);
						}}
					>
						I understand and acknowledge
					</Button>
				</DialogActions>
			</Dialog>
		</>
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
		<Stack flexWrap="wrap" maxWidth="100%" rowGap={1}>
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
