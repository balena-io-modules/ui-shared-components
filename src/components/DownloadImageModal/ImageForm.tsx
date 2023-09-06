import {
	Avatar,
	Box,
	Button,
	ButtonProps,
	Checkbox,
	Collapse,
	Divider,
	FormControl,
	FormControlLabel,
	FormLabel,
	InputLabel,
	MenuItem,
	Radio,
	RadioGroup,
	Select,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import {
	getPreferredVersionOpts,
	transformVersions,
	VersionSelectionOptions,
} from './version';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Truncate } from '../Truncate';
import { OsTypeSelector } from './OsTypeSelector';
import { VariantSelector } from './VariantSelector';
import { FormModel } from '.';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ArticleIcon from '@mui/icons-material/Article';
import isEqual from 'lodash/isEqual';
import { MUILinkWithTracking } from '../MUILinkWithTracking';
import { DeviceType, OsVersionsByDeviceType } from './models';

const BuildVariants = ['dev', 'prod'] as const;
export type BuildVariant = (typeof BuildVariants)[number];

const POLL_INTERVAL_DOCS =
	'https://www.balena.io/docs/reference/supervisor/bandwidth-reduction/#side-effects--warnings';

const getCategorizedVersions = (
	deviceTypeOsVersions: OsVersionsByDeviceType,
	deviceType: FormModel['deviceType'],
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

export type ModalAction = Omit<ButtonProps, 'onClick' | 'label'> & {
	label: string;
	onClick?: (event: React.MouseEvent, model: FormModel) => void;
};

interface ImageFormProps {
	applicationId: number;
	releaseId?: number;
	compatibleDeviceTypes: DeviceType[] | undefined;
	osVersions: OsVersionsByDeviceType;
	osType: string | null;
	osTypes: string[];
	isInitialDefault?: boolean;
	model: FormModel;
	hasEsrVersions?: boolean;
	onSelectedVersionChange: (osVersion: string) => void;
	onSelectedOsTypeChange: (osType: string) => void;
	onChange: (key: keyof FormModel, value: FormModel[keyof FormModel]) => void;
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
		onSelectedVersionChange,
		onSelectedOsTypeChange,
		onChange,
	}) => {
		const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
		const [version, setVersion] = useState<
			VersionSelectionOptions | undefined
		>();
		const [variant, setVariant] = useState<BuildVariant>('prod');
		const [showAllVersions, setShowAllVersions] = useState(false);
		const { selectionOpts, preferredSelectionOpts } = getCategorizedVersions(
			osVersions,
			model.deviceType,
			osType,
		);
		const versionSelectionOpts = useMemo(
			() => (showAllVersions ? selectionOpts : preferredSelectionOpts),
			[preferredSelectionOpts, selectionOpts, showAllVersions],
		);
		const showAllVersionsToggle = useMemo(
			() => preferredSelectionOpts.length < selectionOpts.length,
			[preferredSelectionOpts.length, selectionOpts.length],
		);

		const handleShowAllVersions = (e: any) => {
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
				preferredSelectionOpts?.[0];
			if (preferred) {
				setVersion(preferred);
			}
		};

		const handleSelectedDeviceTypeChange = useCallback(
			(deviceType: DeviceType) => {
				if (model.deviceType.slug === deviceType.slug) {
					return;
				}

				const newDeviceType = compatibleDeviceTypes?.find(
					(cdt) => cdt.slug === deviceType.slug,
				);
				if (!newDeviceType) {
					return;
				}

				onChange('deviceType', newDeviceType);
			},
			[compatibleDeviceTypes, model.deviceType.slug, onChange],
		);

		const handleVersionVariantChange = useCallback(
			(key: 'variant' | 'version', value: any) => {
				const unifyVariantVersion = (
					version: VersionSelectionOptions | undefined,
					variant: 'dev' | 'prod',
				) => {
					if (!version) {
						return;
					}
					const versionWithVariant = version.hasPrebuiltVariants
						? version.rawVersions[variant]
						: version.rawVersion;
					if (versionWithVariant) {
						onSelectedVersionChange(versionWithVariant);
						onChange('developmentMode', variant === 'dev');
					}

					if (version.hasPrebuiltVariants && !version.rawVersions[variant]) {
						setVariant(variant === 'dev' ? 'prod' : 'dev');
					}
				};

				if (key === 'variant') {
					unifyVariantVersion(version, value);
					return;
				}
				unifyVariantVersion(value, variant);
			},
			[onChange, onSelectedVersionChange, variant, version],
		);

		useEffect(() => {
			const newVersion =
				versionSelectionOpts.find((ver) => ver.isRecommended) ??
				versionSelectionOpts[0];
			if (isEqual(version, newVersion)) {
				return;
			}
			setVersion(newVersion);
		}, [version, versionSelectionOpts]);

		return (
			<Box component="form" noValidate autoComplete="off" p={2}>
				<Box py={3} display="flex">
					{compatibleDeviceTypes && compatibleDeviceTypes.length > 1 && (
						<Box display="flex" flexDirection="column" flex="1" mr={1}>
							<InputLabel sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
								Select device type{' '}
								<Tooltip title="Applications can support any devices that share the same architecture as their default device type.">
									<HelpIcon color="info" />
								</Tooltip>
							</InputLabel>
							<Select
								fullWidth
								sx={{ height: '56px' }}
								id="device-type-select"
								value={model.deviceType.slug}
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
										<MenuItem value={dt.slug}>
											<Avatar
												variant="square"
												src={dt.logo ?? undefined}
												sx={{ mr: 3, width: '20px', height: '20px' }}
											/>
											{dt.name}
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
								onSelectedOsTypeChange={onSelectedOsTypeChange}
							/>
						)}
				</Box>
				{(!isInitialDefault || !version) && (
					<Box display="flex">
						<Box display="flex" flexDirection="column" flex={3}>
							<InputLabel>Select version</InputLabel>
							<Select
								fullWidth
								sx={{ height: '56px' }}
								id="e2e-download-image-versions-list"
								value={version}
								onChange={(event) => {
									const version = versionSelectionOpts.find(
										(v) => v.value === event.target.value,
									);
									handleVersionVariantChange('version', version);
								}}
								placeholder="Choose a version..."
							>
								{versionSelectionOpts?.map((option, index) => {
									return (
										<MenuItem key={index} value={option.value}>
											<Tooltip title={option.knownIssueList ?? undefined}>
												{!!option.knownIssueList ? (
													<Box ml={2} display="flex">
														{option.title}
														<WarningAmberIcon color="warning" />
														<Truncate lineCamp={1}>
															{option.knownIssueList}
														</Truncate>
													</Box>
												) : (
													<>{option.title}</>
												)}
											</Tooltip>
										</MenuItem>
									);
								})}
							</Select>
						</Box>
						{showAllVersionsToggle && (
							<Box flex={1} mx={2} display="flex" alignItems="center">
								<Checkbox
									checked={showAllVersions}
									onChange={handleShowAllVersions}
								/>
								<Typography>Show outdated versions</Typography>
							</Box>
						)}
					</Box>
				)}
				{(!isInitialDefault || !variant) && (
					<VariantSelector
						version={version}
						variant={variant}
						onVariantChange={(variant) =>
							handleVersionVariantChange('variant', variant)
						}
					/>
				)}
				<Box display="flex" flexDirection="column">
					<FormControl>
						<FormLabel id="network-radio-buttons-group-label">
							Network
						</FormLabel>
						<RadioGroup
							aria-labelledby="network-radio-buttons-group-label"
							value={model.network}
							name="radio-buttons-group"
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
							<InputLabel sx={{ mb: 2 }}>WiFi SSID</InputLabel>
							<TextField
								value={model.wifiSsid}
								onChange={(event) => onChange('wifiSsid', event.target.value)}
							/>
							<InputLabel sx={{ my: 2 }}>Wifi Passphrase</InputLabel>
							<TextField
								type="password"
								value={model.wifiKey}
								onChange={(event) => onChange('wifiKey', event.target.value)}
							/>
						</>
					)}
				</Box>
				<Divider variant="fullWidth" sx={{ mt: 4, borderStyle: 'dashed' }} />
				<Button
					onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
					sx={{ mt: 3 }}
				>
					{showAdvancedSettings ? <RemoveIcon /> : <AddIcon />} Advanced
					settings
				</Button>
				<Collapse in={showAdvancedSettings} collapsedSize={0}>
					<Box display="flex" flexDirection="column">
						<FormControl>
							<FormLabel id="poll-interval-label" sx={{ display: 'flex' }}>
								Check for updates every X minutes{' '}
								<MUILinkWithTracking
									href={POLL_INTERVAL_DOCS}
									target="_blank"
									height="24px"
								>
									<ArticleIcon />
								</MUILinkWithTracking>
							</FormLabel>
							<TextField
								aria-labelledby="poll-interval-label"
								value={model.appUpdatePollInterval}
								onChange={(event) =>
									onChange('appUpdatePollInterval', event.target.value)
								}
							/>
						</FormControl>
						<InputLabel sx={{ my: 2 }}>Provisioning Key name</InputLabel>
						<TextField
							value={model.provisioningKeyName}
							onChange={(event) =>
								onChange('provisioningKeyName', event.target.value)
							}
						/>
						<InputLabel sx={{ my: 2 }}>Provisioning Key expiring on</InputLabel>
						<TextField
							type="date"
							value={model.provisioningKeyExpiryDate}
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
		<MenuItem value={deviceType.slug}>
			<Avatar
				variant="square"
				src={deviceType.logo ?? undefined}
				sx={{ mr: 3, width: '20px', height: '20px' }}
			/>
			{deviceType.name}
		</MenuItem>
	);
};
