import {
	Alert,
	AlertProps,
	Avatar,
	Box,
	Button,
	Dialog,
	Grid,
	Skeleton,
	Typography,
} from '@mui/material';
import type { Dictionary } from 'balena-sdk/typings/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { FALLBACK_LOGO_UNKNOWN_DEVICE, stripVersionBuild } from './utils';
import { ImageForm } from './ImageForm';
import { ApplicationInstructions } from './ApplicationInstructions';
import { DropDownButton, DropDownButtonProps } from '../DropDownButton';
import DownloadIcon from '@mui/icons-material/Download';
import pickBy from 'lodash/pickBy';
import debounce from 'lodash/debounce';
import isEmpty from 'lodash/isEmpty';
import { DeviceType, OsTypesEnum, OsVersionsByDeviceType } from './models';
import uniq from 'lodash/uniq';

const etcherLogoBase64 =
	'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5FdGNoZXI8L3RpdGxlPgogIDxnIGlkPSJzdmdfMSIgc3Ryb2tlPSJudWxsIj4KICAgPHBhdGggaWQ9InN2Z18yIiBjbGFzcz0ic3QxIiBkPSJtNDEyLjkwMzgzLDM1OC4wNjcxM2wwLDE3MS40OTU4M2M3LjQ5MjU0LC0xLjY2NTAxIDE0LjE1MjU3LC0zLjMzMDAyIDIwLjgxMjYsLTcuNDkyNTRsMTQyLjM1ODE5LC04MS41ODUzOWMyMC44MTI2LC0xMS42NTUwNiAzMy4zMDAxNiwtMzQuMTMyNjYgMzMuMzAwMTYsLTU4LjI3NTI4bDAsLTE2Mi4zMzgyOGMwLC02LjY2MDAzIC0wLjgzMjUsLTEzLjMyMDA2IC0zLjMzMDAyLC0xOS4xNDc1OWwtMTU0LjAxMzI0LDg5LjA3NzkzYy0zMi40Njc2NiwyMi40Nzc2MSAtMzkuMTI3NjksNDMuMjkwMjEgLTM5LjEyNzY5LDY4LjI2NTMzbDAsLTAuMDAwMDF6IiBmaWxsPSIjQTVERTM3IiBzdHJva2U9Im51bGwiLz4KICAgPHBhdGggaWQ9InN2Z18zIiBjbGFzcz0ic3QyIiBkPSJtNjYyLjY1NTAzLDE2Ny40MjM3MWwtNTYuNjEwMjcsMzIuNDY3NjZjMS42NjUwMSw1LjgyNzUzIDMuMzMwMDIsMTIuNDg3NTYgMy4zMzAwMiwxOS4xNDc1OWwwLDE2My4xNzA3OWMwLDI0LjE0MjYyIC0xMy4zMjAwNiw0Ni42MjAyMiAtMzMuMzAwMTYsNTguMjc1MjhsLTE0Mi4zNTgxOSw4MS41ODUzOWMtNi42NjAwMywzLjMzMDAyIC0xMy4zMjAwNiw1LjgyNzUzIC0yMC44MTI2LDcuNDkyNTRsMCw2NC45MzUzMWM5Ljk5MDA1LC0xLjY2NTAxIDE5Ljk4MDEsLTQuOTk1MDIgMjguMzA1MTQsLTkuOTkwMDVsMTg0LjgxNTg5LC0xMDUuNzI4MDFjMjUuODA3NjIsLTE0Ljk4NTA3IDQxLjYyNTIsLTQyLjQ1NzcgNDEuNjI1MiwtNzIuNDI3ODVsMCwtMjExLjQ1NjAyYzAsLTkuMTU3NTQgLTEuNjY1MDEsLTE4LjMxNTA5IC00Ljk5NTAyLC0yNy40NzI2M2wtMC4wMDAwMSwweiIgZmlsbD0iI0M4RjE3OCIgc3Ryb2tlPSJudWxsIi8+CiAgIDxwYXRoIGlkPSJzdmdfNCIgY2xhc3M9InN0MSIgZD0ibTM5OS41ODM3NiwzMDMuOTU0MzZjOC4zMjUwNCwtMTMuMzIwMDYgMjAuODEyNiwtMjUuODA3NjIgMzkuMTI3NjksLTM2LjYzMDE4bDE1NS42NzgyNSwtODkuOTEwNDNjLTQuOTk1MDIsLTYuNjYwMDMgLTExLjY1NTA2LC0xMi40ODc1NiAtMTguMzE1MDksLTE2LjY1MDA4bC0xNDIuMzU4MTksLTgxLjU4NTM5Yy0yMC44MTI2LC0xMS42NTUwNiAtNDYuNjIwMjIsLTExLjY1NTA2IC02Ny40MzI4MiwwbC0xNDEuNTI1NjgsODEuNTg1MzljLTcuNDkyNTQsNC4xNjI1MiAtMTMuMzIwMDYsOS45OTAwNSAtMTkuMTQ3NTksMTYuNjUwMDhsMTU0Ljg0NTc1LDg5LjkxMDQzYzE4LjMxNTA5LDExLjY1NTA2IDMwLjgwMjY1LDIzLjMxMDExIDM5LjEyNzY5LDM2LjYzMDE4bC0wLjAwMDAxLDB6IiBmaWxsPSIjQTVERTM3IiBzdHJva2U9Im51bGwiLz4KICAgPHBhdGggaWQ9InN2Z181IiBjbGFzcz0ic3QyIiBkPSJtMjI0Ljc1NzkyLDE2MS41OTYxOGwxNDEuNTI1NjgsLTgxLjU4NTM5YzIwLjgxMjYsLTExLjY1NTA2IDQ2LjYyMDIyLC0xMS42NTUwNiA2Ny40MzI4MiwwbDE0Mi4zNTgxOSw4MS41ODUzOWM3LjQ5MjU0LDQuMTYyNTIgMTMuMzIwMDYsOS45OTAwNSAxOC4zMTUwOSwxNi42NTAwOGw1Ni42MTAyNywtMzIuNDY3NjZjLTYuNjYwMDMsLTkuMTU3NTQgLTE0Ljk4NTA3LC0xNi42NTAwOCAtMjQuOTc1MTIsLTIxLjY0NTFsLTE4NC44MTU4OSwtMTA3LjM5MzAyYy0yNS44MDc2MiwtMTQuOTg1MDcgLTU3LjQ0Mjc4LC0xNC45ODUwNyAtODMuMjUwNCwwbC0xODMuMTUwODgsMTA2LjU2MDUxYy05Ljk5MDA1LDUuODI3NTMgLTE4LjMxNTA5LDEzLjMyMDA2IC0yNC45NzUxMiwyMi40Nzc2MWw1Ni42MTAyNywzMi40Njc2NmM0LjE2MjUyLC02LjY2MDAzIDEwLjgyMjU1LC0xMi40ODc1NiAxOC4zMTUwOSwtMTYuNjUwMDh6IiBmaWxsPSIjQzhGMTc4IiBzdHJva2U9Im51bGwiLz4KICAgPHBhdGggaWQ9InN2Z182IiBjbGFzcz0ic3QyIiBkPSJtMzY2LjI4MzYsNTIyLjA3MDQxbC0xNDEuNTI1NjgsLTgxLjU4NTM5Yy0yMC44MTI2LC0xMS42NTUwNiAtMzMuMzAwMTYsLTM0LjEzMjY2IC0zMy4zMDAxNiwtNTguMjc1MjhsMCwtMTYzLjE3MDc5YzAsLTYuNjYwMDMgMC44MzI1LC0xMi40ODc1NiAyLjQ5NzUxLC0xOC4zMTUwOWwtNTYuNjEwMjcsLTMyLjQ2NzY2Yy0zLjMzMDAyLDkuMTU3NTQgLTQuOTk1MDIsMTcuNDgyNTggLTQuOTk1MDIsMjYuNjQwMTNsMCwyMTIuMjg4NTJjMCwyOS45NzAxNCAxNS44MTc1OCw1Ny40NDI3OCA0MS42MjUyLDcxLjU5NTM0bDE4My45ODMzOSwxMDUuNzI4MDFjOC4zMjUwNCw0Ljk5NTAyIDE4LjMxNTA5LDguMzI1MDQgMjguMzA1MTQsOS45OTAwNWwwLC02NC45MzUzMWMtNi42NjAwMywtMC44MzI1IC0xMy4zMjAwNiwtMy4zMzAwMiAtMTkuOTgwMSwtNy40OTI1NGwtMC4wMDAwMSwwLjAwMDAxeiIgZmlsbD0iI0M4RjE3OCIgc3Ryb2tlPSJudWxsIi8+CiAgIDxwYXRoIGlkPSJzdmdfNyIgY2xhc3M9InN0MSIgZD0ibTM0Ny4xMzYwMSwyODguOTY5MjlsLTE1My4xODA3NCwtODguMjQ1NDJjLTEuNjY1MDEsNS44Mjc1MyAtMi40OTc1MSwxMi40ODc1NiAtMi40OTc1MSwxOC4zMTUwOWwwLDE2My4xNzA3OWMwLDI0LjE0MjYyIDEyLjQ4NzU2LDQ2LjYyMDIyIDMzLjMwMDE2LDU4LjI3NTI4bDE0MS41MjU2OCw4MS41ODUzOWM2LjY2MDAzLDMuMzMwMDIgMTMuMzIwMDYsNS44Mjc1MyAyMC44MTI2LDcuNDkyNTRsMCwtMTcxLjQ5NTgzYy0wLjgzMjUsLTI0Ljk3NTEyIC03LjQ5MjU0LC00NS43ODc3MiAtMzkuOTYwMTksLTY5LjA5NzgzbDAsLTAuMDAwMDF6IiBmaWxsPSIjQTVERTM3IiBzdHJva2U9Im51bGwiLz4KICA8L2c+CiA8L2c+Cgo8L3N2Zz4=';

const ETCHER_OPEN_IMAGE_URL = 'https://www.balena.io/etcher/open-image-url';

export interface FormModel {
	appId: number;
	deviceType: DeviceType;
	version: string;
	network: string;
	developmentMode?: boolean;
	appUpdatePollInterval?: number;
	wifiSsid?: string;
	wifiKey?: string;
	provisioningKeyName?: string;
	provisioningKeyExpiryDate?: string;
}

const getUniqueOsTypes = (
	osVersions: OsVersionsByDeviceType,
	deviceTypeSlug: string | undefined,
) => {
	if (
		isEmpty(osVersions) ||
		!deviceTypeSlug ||
		isEmpty(osVersions[deviceTypeSlug])
	) {
		return [];
	}

	return uniq(osVersions[deviceTypeSlug].map((x) => x.osType));
};

const generateImageUrl = (
	model: Omit<FormModel, 'deviceType'> & { deviceType: string },
	downloadUrl: string,
) => {
	// TODO check if possible to edit Etcher to avoid a double encode on the version.
	if (model.version) {
		model.version = encodeURIComponent(model.version);
	}
	if (model.network === 'ethernet') {
		model.wifiSsid = undefined;
		model.wifiKey = undefined;
	}
	const queryParams = Object.entries(model)
		.map(([key, value]) => (!!value ? `${key}=${value}` : null))
		.filter((param) => !!param)
		.join('&');
	return `${downloadUrl}?${queryParams}`;
};

const flashWithEtcher = (
	model: FormModel,
	downloadUrl: string,
	authToken?: string,
) => {
	const modelCopy = { ...model, deviceType: model.deviceType.slug };
	const imageUrl = generateImageUrl(modelCopy, downloadUrl);
	const axiosConfig = {
		method: 'POST',
		url: imageUrl,
		...(authToken && {
			headers: {
				Authorization: `Bearer ${authToken}`,
			},
		}),
		data: pickBy(modelCopy, (value) => !!value),
	};
	// TODO: Check how to remove from resin site the decode and avoid this double encodeURIComponent on a stringified obj
	const stringifiedAxiosConfig = encodeURIComponent(
		JSON.stringify(axiosConfig),
	);
	window.open(
		`${ETCHER_OPEN_IMAGE_URL}?imageUrl=${encodeURIComponent(
			stringifiedAxiosConfig,
		)}`,
		'_blank',
	);
};

const downlaodOS = async (model: FormModel, downloadUrl: string) => {
	const modelCopy = { ...model, deviceType: model.deviceType.slug };
	const url = generateImageUrl(modelCopy, downloadUrl);
	window.open(url);
};

const debounceDownloadSize = debounce(
	async (
		getDownloadSize: NonNullable<DownloadImageModalProps['getDownloadSize']>,
		deviceType: DeviceType,
		rawVersion: string,
		setDownloadSize: (value: string | null) => void,
	) => {
		try {
			setDownloadSize((await getDownloadSize(deviceType, rawVersion)) ?? null);
		} catch {
			setDownloadSize(null);
		}
	},
	200,
	{
		trailing: true,
		leading: false,
	},
);

export interface DownloadImageModalProps {
	open: boolean;
	applicationId: number;
	releaseId?: number;
	compatibleDeviceTypes: DeviceType[] | undefined;
	initialDeviceType: DeviceType;
	initialOsVersions?: OsVersionsByDeviceType;
	isInitialDefault?: boolean;
	downloadUrl: string;
	onDownloadStart?: (downloadConfigOnly: boolean, model: FormModel) => void;
	getSupportedOsVersions?: () => Promise<OsVersionsByDeviceType>;
	getSupportedOsTypes?: (
		applicationId: number,
		deviceTypeSlug: string,
	) => Promise<string[]>;
	downloadConfig?: (model: FormModel) => Promise<void>;
	getDownloadSize?: (
		deviceType: DeviceType,
		rawVersion: string | null,
	) => Promise<string> | undefined;
	getDockerArtifact: (deviceTypeSlug: string, rawVersion: string) => string;
	hasEsrVersions?: (deviceTypeSlugs: string[]) => Promise<Dictionary<boolean>>;
	onClose: () => void;
	modalActions?: DropDownButtonProps['items'];
	authToken?: string;
}

export const DownloadImageModal: React.FC<DownloadImageModalProps> = ({
	open,
	applicationId,
	releaseId,
	compatibleDeviceTypes,
	initialDeviceType,
	initialOsVersions,
	isInitialDefault,
	downloadUrl,
	onDownloadStart,
	getSupportedOsVersions,
	getSupportedOsTypes,
	downloadConfig,
	getDownloadSize,
	getDockerArtifact,
	hasEsrVersions,
	onClose,
	modalActions,
	authToken,
}) => {
	const [rawVersion, setRawVersion] = useState<string | null>(null);
	const [formModel, setFromModel] = useState({
		appId: applicationId,
		releaseId,
		deviceType: initialDeviceType,
		version: rawVersion ?? '',
		network: 'ethernet',
		appUpdatePollInterval: 10,
		wifiSsid: undefined,
		wifiKey: undefined,
		provisioningKeyName: undefined,
		provisioningKeyExpiryDate: undefined,
	});

	const [osVersions, setOsVersions] = useState<OsVersionsByDeviceType>(
		initialOsVersions ?? {},
	);
	const [osType, setOsType] = useState<string>();
	const [osTypes, setOsTypes] = useState<string[]>(
		getUniqueOsTypes(osVersions, initialDeviceType?.slug),
	);

	const [deviceTypeHasEsr, setDeviceTypeHasEsr] = useState<Dictionary<boolean>>(
		initialDeviceType?.slug
			? {
					[initialDeviceType.slug]: osTypes.includes(OsTypesEnum.ESR),
			  }
			: {},
	);
	const [isDownloadingConfig, setIsDownloadingConfig] = useState(false);
	const [isFetching, setIsFetching] = useState(isEmpty(osVersions));
	const [downloadSize, setDownloadSize] = useState<string | null>(null);
	const hasDockerImageDownload = useMemo(
		() => formModel.deviceType?.yocto?.deployArtifact === 'docker-image',
		[formModel.deviceType?.yocto?.deployArtifact],
	);

	const [downloadConfigOnly, setDownloadConfigOnly] = useState(
		hasDockerImageDownload,
	);

	const logoSrc = useMemo(
		() =>
			formModel.deviceType?.logo ??
			formModel.deviceType?.logoUrl ??
			FALLBACK_LOGO_UNKNOWN_DEVICE,
		[formModel.deviceType?.logo, formModel.deviceType?.logoUrl],
	);
	const defaultDisplayName = useMemo(
		() => formModel.deviceType?.name ?? '-',
		[formModel.deviceType?.name],
	);

	const actions: DropDownButtonProps['items'] = useMemo(() => {
		const startDownload = (downloadConfigOnly: boolean) => {
			if (typeof onDownloadStart === 'function') {
				onDownloadStart(downloadConfigOnly, formModel);
			}
			setDownloadConfigOnly(downloadConfigOnly);
		};

		const actions: DropDownButtonProps['items'] = [
			...(modalActions ?? []),
			{
				eventName: 'Flash With Etcher Clicked',
				eventProperties: {
					appId: formModel.appId,
					releaseId: formModel.releaseId,
					downloadUrl,
				},
				onClick: () => flashWithEtcher(formModel, downloadUrl, authToken),
				children: (
					<>
						<img width="20px" alt="etcher" src={etcherLogoBase64} /> Flash
					</>
				),
				disabled: hasDockerImageDownload,
				tooltip: hasDockerImageDownload
					? 'This image is deployed to docker so you can only download its config'
					: 'Etcher v1.7.2 or greater is required',
			},
			{
				eventName: 'Download balenaOS Clicked',
				eventProperties: {
					appId: formModel.appId,
					releaseId: formModel.releaseId,
					downloadUrl,
				},
				onClick: async () => await downlaodOS(formModel, downloadUrl),
				children: (
					<>
						<DownloadIcon /> Download balenaOS{' '}
						{rawVersion && downloadSize ? ` (~${downloadSize})` : ''}
					</>
				),
				disabled: hasDockerImageDownload,
				tooltip: hasDockerImageDownload
					? 'This image is deployed to docker so you can only download its config'
					: '',
			},
		];

		if (!!downloadConfig) {
			actions.push({
				eventName: 'Download Configuration File Only',
				eventProperties: {
					appId: formModel.appId,
					releaseId: formModel.releaseId,
				},
				onClick: async () => {
					if (downloadConfigOnly && downloadConfig) {
						setIsDownloadingConfig(true);
						await downloadConfig(formModel);
						setIsDownloadingConfig(false);
					}
					startDownload(true);
				},
				children: (
					<>
						<DownloadIcon /> Download configuration file only
					</>
				),
			});
		}

		return actions satisfies DropDownButtonProps['items'];
	}, [
		authToken,
		downloadConfig,
		downloadConfigOnly,
		downloadSize,
		downloadUrl,
		formModel,
		hasDockerImageDownload,
		modalActions,
		onDownloadStart,
		rawVersion,
	]);

	useEffect(() => {
		if (!rawVersion || !getDownloadSize) {
			setDownloadSize(null);
			return;
		}

		// Debounce as the version changes right after the devicetype does, resulting in multiple requests.
		debounceDownloadSize(
			getDownloadSize,
			formModel.deviceType,
			rawVersion,
			setDownloadSize,
		);
	}, [formModel.deviceType, getDownloadSize, rawVersion]);

	useEffect(() => {
		if (!compatibleDeviceTypes || !getSupportedOsVersions) {
			return;
		}
		// const applicationType = getExpanded(application.application_type);
		// as soon as the modal opens, start fetching the osVersions for all
		// the compatible device types
		getSupportedOsVersions()
			.then(setOsVersions)
			.catch((e) => {
				console.error(e);
			})
			.finally(() => setIsFetching(false));
	}, [compatibleDeviceTypes, applicationId, getSupportedOsVersions]);

	useEffect(() => {
		if (!getSupportedOsTypes) {
			return;
		}
		// Fetch the supported os types, so we can show the appropriate values in the Select box.
		// We only want to do it once, and we rely on the cached data here.
		getSupportedOsTypes(applicationId, formModel.deviceType.slug).then(
			setOsTypes,
		);
	}, [formModel.deviceType.slug, applicationId, getSupportedOsTypes]);

	useEffect(() => {
		if (!compatibleDeviceTypes || !hasEsrVersions) {
			return;
		}
		hasEsrVersions(compatibleDeviceTypes.map((dt) => dt.slug)).then(
			setDeviceTypeHasEsr,
		);
	}, [compatibleDeviceTypes, hasEsrVersions]);

	useEffect(() => {
		const osTypes = getUniqueOsTypes(osVersions, formModel.deviceType.slug);
		if (!osTypes.length) {
			return;
		}
		if (!!osType) {
			if (!osTypes.includes(osType)) {
				setOsType(osTypes[0]);
			}
		} else {
			setOsType(
				osTypes.includes(OsTypesEnum.ESR) ? OsTypesEnum.ESR : osTypes[0],
			);
		}
	}, [formModel.deviceType.slug, osType, osVersions]);

	const setRawVersionCallback = useCallback(
		(osVersion: string) => setRawVersion(osVersion),
		[],
	);
	const setOsTypeCallback = useCallback(
		(osType: string) => setRawVersion(osType),
		[],
	);

	const handleChange = useCallback(
		(key: keyof FormModel, value: FormModel[keyof FormModel]) => {
			setFromModel((oldState) => ({
				...oldState,
				[key]: value,
			}));
		},
		[],
	);

	return (
		<Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
			<Box p={4}>
				<Box
					height="32px"
					display="flex"
					alignItems="center"
					justifyContent="space-between"
				>
					<Typography variant="h5" display="flex" alignItems="center">
						<Avatar
							variant="square"
							alt={defaultDisplayName}
							src={logoSrc}
							sx={{ mr: 2 }}
						/>
						Add new device
					</Typography>
					<Button
						color="customGrey"
						onClick={onClose}
						sx={{ minHeight: 0, minWidth: 0, px: 0 }}
					>
						<CloseIcon />
					</Button>
				</Box>
				<Grid container py={3} spacing={4}>
					<Grid item xs={12} sm={12} md={6} lg={7}>
						{(isFetching || isDownloadingConfig) && (
							<Skeleton variant="rectangular" height="200px" />
						)}
						{!isFetching && (
							<>
								{isEmpty(osVersions) && (
									<Alert color="warning">
										No OS versions available for download
									</Alert>
								)}
								{!!osType && !!compatibleDeviceTypes && (
									<ImageForm
										applicationId={applicationId}
										releaseId={releaseId}
										compatibleDeviceTypes={compatibleDeviceTypes}
										osVersions={osVersions}
										isInitialDefault={isInitialDefault}
										hasEsrVersions={deviceTypeHasEsr[formModel.deviceType.slug]}
										osType={osType}
										osTypes={osTypes}
										model={formModel}
										onSelectedVersionChange={setRawVersionCallback}
										onSelectedOsTypeChange={setOsTypeCallback}
										onChange={handleChange}
									/>
								)}
							</>
						)}
					</Grid>
					<Grid item xs={12} sm={12} md={6} lg={5}>
						<ApplicationInstructions
							deviceType={formModel.deviceType}
							templateData={{
								dockerImage: rawVersion
									? getDockerArtifact(
											formModel.deviceType.slug,
											stripVersionBuild(rawVersion),
									  )
									: '',
							}}
						/>
					</Grid>
				</Grid>
				{(formModel.deviceType.imageDownloadAlerts ?? []).map((alert) => {
					return (
						<Alert
							key={alert.message}
							sx={{ mb: 3 }}
							color={alert.type as AlertProps['color']}
						>
							{alert.message}
						</Alert>
					);
				})}

				<Box display="flex">
					<DropDownButton
						className="e2e-download-image-submit"
						items={actions}
					/>
				</Box>
			</Box>
		</Dialog>
	);
};
