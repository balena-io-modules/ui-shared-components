import {
	Avatar,
	Box,
	Button,
	Checkbox,
	Chip,
	Collapse,
	Divider,
	FormControl,
	FormControlLabel,
	FormLabel,
	InputAdornment,
	InputLabel,
	MenuItem,
	Radio,
	RadioGroup,
	Select,
	TextField,
	Tooltip,
	Typography,
	IconButton,
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
	getPreferredVersionOpts,
	transformVersions,
	VersionSelectionOptions,
} from './version';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { OsTypeSelector } from './OsTypeSelector';
import { BuildVariant, VariantSelector } from './VariantSelector';
import { DownloadImageFormModel } from '.';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArticleIcon from '@mui/icons-material/Article';
import { MUILinkWithTracking } from '../MUILinkWithTracking';
import { DeviceType, Dictionary, OsVersionsByDeviceType } from './models';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FALLBACK_LOGO_UNKNOWN_DEVICE } from './utils';
import { ChipProps } from '../Chip';

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
	onSelectedDeviceTypeChange: (deviceType: DeviceType) => void;
	onChange: (
		key: keyof DownloadImageFormModel,
		value: DownloadImageFormModel[keyof DownloadImageFormModel],
	) => void;
}

export const ImageForm: React.FC<ImageFormProps> = memo(
	({
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
		onSelectedDeviceTypeChange,
		onChange,
	}) => {
		const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
		const [showPassword, setShowPassword] = useState(false);
		const [version, setVersion] = useState<
			VersionSelectionOptions | undefined
		>();
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
				setVersion(preferred);
			}
		};

		const handleSelectedDeviceTypeChange = useCallback(
			(deviceType: DeviceType) => {
				if (
					model.deviceType.slug === deviceType.slug ||
					!compatibleDeviceTypes
				) {
					return;
				}

				const newDeviceType = compatibleDeviceTypes.find(
					(cdt) => cdt.slug === deviceType.slug,
				);
				if (!newDeviceType) {
					return;
				}
				onSelectedDeviceTypeChange(newDeviceType);
				setVersion(undefined);
			},
			[
				compatibleDeviceTypes,
				model.deviceType.slug,
				onSelectedDeviceTypeChange,
			],
		);

		useEffect(() => {
			if (!version) {
				const newVersion =
					versionSelectionOpts.find((ver) => ver.isRecommended) ??
					versionSelectionOpts[0];
				onChange('version', newVersion?.value);
				setVersion(newVersion);
				return;
			}

			const versionWithVariant = version.hasPrebuiltVariants
				? version.rawVersions[variant]
				: version.rawVersion;
			if (versionWithVariant) {
				onChange('version', versionWithVariant);
				onChange('developmentMode', variant === 'dev');
			}

			if (version.hasPrebuiltVariants && !version.rawVersions[variant]) {
				setVariant(variant === 'dev' ? 'prod' : 'dev');
			}
		}, [version, variant, onChange, versionSelectionOpts]);

		return (
			<Box
				action={downloadUrl}
				method="post"
				component="form"
				noValidate
				autoComplete="off"
				p={2}
				ref={formElement}
			>
				<input type="hidden" name="_token" value={authToken} />
				<input type="hidden" name="appId" value={applicationId} />
				<input type="hidden" name="fileType" value=".zip" />
				<Box py={3} display="flex" flexWrap="wrap" gap={2}>
					{compatibleDeviceTypes && compatibleDeviceTypes.length > 1 && (
						<Box display="flex" flexDirection="column" flex="1" maxWidth="100%">
							<InputLabel
								htmlFor="device-type-select"
								sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
							>
								Select device type{' '}
								<Tooltip title="Applications can support any devices that share the same architecture as their default device type.">
									<HelpIcon
										color="info"
										sx={{ fontSize: '1rem', marginLeft: 1 }}
									/>
								</Tooltip>
							</InputLabel>
							<Select
								fullWidth
								id="device-type-select"
								value={model.deviceType.slug}
								inputProps={{
									name: 'deviceType',
								}}
								renderValue={(dt) => (
									<DeviceTypeItem
										deviceType={
											compatibleDeviceTypes.find((c) => c.slug === dt)!
										}
									/>
								)}
								onChange={(event) => {
									return handleSelectedDeviceTypeChange(
										compatibleDeviceTypes.find(
											(c) => c.slug === event?.target.value,
										)!,
									);
								}}
							>
								{compatibleDeviceTypes?.map((dt) => {
									return (
										<MenuItem
											value={dt.slug}
											key={dt.slug}
											sx={{ maxWidth: '100%' }}
										>
											<Avatar
												variant="square"
												src={dt.logo ?? FALLBACK_LOGO_UNKNOWN_DEVICE}
												sx={{ mr: 3, width: '20px', height: '20px' }}
											/>
											<Typography noWrap>{dt.name}</Typography>
										</MenuItem>
									);
								})}
							</Select>
						</Box>
					)}
					{(!isInitialDefault || osType) &&
						hasEsrVersions &&
						model.deviceType && (
							<OsTypeSelector
								supportedOsTypes={osTypes}
								hasEsrVersions={hasEsrVersions ?? false}
								selectedOsTypeSlug={osType}
								onSelectedOsTypeChange={(ot) => {
									onSelectedOsTypeChange(ot);
									setVersion(undefined);
									onChange('version', undefined);
								}}
							/>
						)}
				</Box>
				{!isInitialDefault && model.version && (
					<Box display="flex" flexWrap="wrap" maxWidth="100%">
						<Box display="flex" flexDirection="column" maxWidth="100%" flex={1}>
							<InputLabel
								sx={{ mb: 2 }}
								htmlFor="e2e-download-image-versions-list"
							>
								Select version
							</InputLabel>
							<Select
								fullWidth
								id="e2e-download-image-versions-list"
								value={model.version}
								inputProps={{
									name: 'version',
								}}
								onChange={(event) => {
									const version = versionSelectionOpts.find(
										(v) => v.value === event.target.value,
									);
									setVersion(version);
									onChange('version', version?.value);
								}}
								placeholder="Choose a version..."
								renderValue={() => {
									return <VersionSelectItem option={version} />;
								}}
							>
								{versionSelectionOpts?.map((option, index) => {
									return (
										<MenuItem key={index} value={option.value}>
											<VersionSelectItem option={option} />
										</MenuItem>
									);
								})}
							</Select>
						</Box>
						{showAllVersionsToggle && (
							<Box
								mx={2}
								display="flex"
								alignItems="center"
								alignSelf="flex-end"
								// TODO: find a better way to center the checkbox with the input only (without label)
								height={54}
							>
								<Checkbox
									id="e2e-show-all-versions-check"
									checked={showAllVersions}
									onChange={handleShowAllVersions}
								/>
								<Typography>Show outdated versions</Typography>
							</Box>
						)}
					</Box>
				)}
				{(!isInitialDefault || !variant) && (
					<Box sx={{ mt: 3 }}>
						<VariantSelector
							version={version}
							variant={variant}
							onVariantChange={(variant) => {
								setVariant(variant ? 'dev' : 'prod');
							}}
						/>
					</Box>
				)}
				<Divider variant="fullWidth" sx={{ my: 3, borderStyle: 'dashed' }} />
				<Box display="flex" flexDirection="column">
					<FormControl>
						<FormLabel id="network-radio-buttons-group-label">
							Network
						</FormLabel>
						<RadioGroup
							aria-labelledby="network-radio-buttons-group-label"
							value={model.network}
							name="network"
							onChange={(event) => onChange('network', event.target.value)}
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
						<>
							<InputLabel htmlFor="device-wifi-ssid" sx={{ mb: 2 }}>
								WiFi SSID
							</InputLabel>
							<TextField
								value={model.wifiSsid}
								id="device-wifi-ssid"
								inputProps={{
									name: 'wifiSsid',
									autocomplete: 'wifiSsid-auto-complete',
								}}
								onChange={(event) => onChange('wifiSsid', event.target.value)}
							/>
							<InputLabel htmlFor="device-wifi-password" sx={{ my: 2 }}>
								Wifi Passphrase
							</InputLabel>
							<TextField
								type={showPassword ? 'text' : 'password'}
								id="device-wifi-password"
								value={model.wifiKey}
								inputProps={{
									name: 'wifiKey',
								}}
								// InputProps and inputProps are different https://mui.com/material-ui/api/text-field/#TextField-prop-InputProps
								InputProps={{
									endAdornment: (
										<InputAdornment position="end">
											<IconButton
												onClick={() => setShowPassword((show) => !show)}
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
								}}
								onChange={(event) => onChange('wifiKey', event.target.value)}
							/>
						</>
					)}
				</Box>
				<Divider variant="fullWidth" sx={{ my: 3, borderStyle: 'dashed' }} />
				<Button
					onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
					variant="outlined"
					sx={{ mb: 2 }}
				>
					{showAdvancedSettings ? <RemoveIcon /> : <AddIcon />} Advanced
					settings
				</Button>
				<Collapse in={showAdvancedSettings} collapsedSize={0}>
					<Box display="flex" flexDirection="column">
						<FormControl>
							<FormLabel htmlFor="poll-interval-label" sx={{ display: 'flex' }}>
								Check for updates every X minutes{' '}
								<MUILinkWithTracking
									href={POLL_INTERVAL_DOCS}
									sx={{
										display: 'flex',
										alignItems: 'center',
										height: '1.5rem',
									}}
								>
									<ArticleIcon sx={{ ml: 1, fontSize: '1.15rem' }} />
								</MUILinkWithTracking>
							</FormLabel>
							<TextField
								id="poll-interval-label"
								aria-labelledby="poll-interval-label"
								value={model.appUpdatePollInterval}
								inputProps={{
									name: 'appUpdatePollInterval',
									autocomplete: 'appUpdatePollInterval-auto-complete',
								}}
								onChange={(event) =>
									onChange('appUpdatePollInterval', event.target.value)
								}
							/>
						</FormControl>
						<InputLabel htmlFor="provision-key-name" sx={{ my: 2 }}>
							Provisioning Key name
						</InputLabel>
						<TextField
							name="provisioningKeyName"
							id="provision-key-name"
							value={model.provisioningKeyName ?? ''}
							inputProps={{
								name: 'provisioningKeyName',
								autocomplete: 'provisioningKeyName-auto-complete',
							}}
							onChange={(event) =>
								onChange('provisioningKeyName', event.target.value)
							}
						/>
						<InputLabel htmlFor="provision-key-expiring" sx={{ my: 2 }}>
							Provisioning Key expiring on
						</InputLabel>
						<TextField
							type="date"
							id="provision-key-expiring"
							value={model.provisioningKeyExpiryDate ?? ''}
							inputProps={{
								name: 'provisioningKeyExpiryDate',
								autocomplete: 'provisioningKeyExpiryDate-auto-complete',
							}}
							onChange={(event) =>
								onChange('provisioningKeyExpiryDate', event.target.value)
							}
						/>
					</Box>
				</Collapse>
			</Box>
		);
	},
);

const DeviceTypeItem: React.FC<{ deviceType: DeviceType }> = ({
	deviceType,
}) => {
	return (
		<Box display="flex">
			<Avatar
				variant="square"
				src={deviceType.logo ?? FALLBACK_LOGO_UNKNOWN_DEVICE}
				sx={{ mr: 3, width: '20px', height: '20px' }}
			/>
			<Typography noWrap>{deviceType.name}</Typography>
		</Box>
	);
};

export const VersionSelectItem = ({ option }: any) => {
	return (
		<Tooltip title={option.knownIssueList ?? undefined}>
			<Box
				display="flex"
				alignItems="center"
				gap={2}
				flexWrap="nowrap"
				maxWidth="100%"
			>
				<Box>{option.title}</Box>
				{!!option.line && (
					<Chip label={option.line} color={lineMap[option.line]} />
				)}
				{!!option.isRecommended && (
					<Chip
						label="recommended"
						sx={{
							height: 20,
							backgroundColor: '#CAFECD',
						}}
					/>
				)}
				{!!option.knownIssueList && (
					<Box alignItems="center" flex={1} display="contents">
						<WarningAmberIcon color="warning" />
						<Typography noWrap>{option.knownIssueList}</Typography>
					</Box>
				)}
			</Box>
		</Tooltip>
	);
};
