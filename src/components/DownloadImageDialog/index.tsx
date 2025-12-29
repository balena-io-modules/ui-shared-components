import {
	Avatar,
	DialogActions,
	DialogContent,
	Divider,
	Grid,
	Stack,
	Typography,
} from '@mui/material';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
	FALLBACK_LOGO_UNKNOWN_DEVICE,
	isUrlAccessible,
	stripVersionBuild,
} from './utils';
import {
	GENERIC_X86_MINIMUM_SUPPORTED_SECUREBOOT_VERSION,
	GENERIC_X86_SLUG,
	ImageForm,
} from './ImageForm';
import { ApplicationInstructions } from './ApplicationInstructions';
import type { DropDownButtonProps } from '../DropDownButton';
import { DropDownButton } from '../DropDownButton';

import { pickBy, debounce } from 'es-toolkit';
import type { DeviceType, Dictionary, OsVersionsByDeviceType } from './models';
import { OsTypesEnum } from './models';
import { uniq } from '../../utils/arrays';
import { enqueueSnackbar } from 'notistack';
import { DialogWithCloseButton } from '../DialogWithCloseButton';
import type { CalloutProps } from '../Callout';
import { Callout } from '../Callout';
import { Spinner } from '../Spinner';
import { faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as semver from 'balena-semver';
import { isObjectEmpty } from '../../utils/objects';

const etcherLogoBase64 =
	'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KIDxnPgogIDx0aXRsZT5FdGNoZXI8L3RpdGxlPgogIDxnIGlkPSJzdmdfMSIgc3Ryb2tlPSJudWxsIj4KICAgPHBhdGggaWQ9InN2Z18yIiBjbGFzcz0ic3QxIiBkPSJtNDEyLjkwMzgzLDM1OC4wNjcxM2wwLDE3MS40OTU4M2M3LjQ5MjU0LC0xLjY2NTAxIDE0LjE1MjU3LC0zLjMzMDAyIDIwLjgxMjYsLTcuNDkyNTRsMTQyLjM1ODE5LC04MS41ODUzOWMyMC44MTI2LC0xMS42NTUwNiAzMy4zMDAxNiwtMzQuMTMyNjYgMzMuMzAwMTYsLTU4LjI3NTI4bDAsLTE2Mi4zMzgyOGMwLC02LjY2MDAzIC0wLjgzMjUsLTEzLjMyMDA2IC0zLjMzMDAyLC0xOS4xNDc1OWwtMTU0LjAxMzI0LDg5LjA3NzkzYy0zMi40Njc2NiwyMi40Nzc2MSAtMzkuMTI3NjksNDMuMjkwMjEgLTM5LjEyNzY5LDY4LjI2NTMzbDAsLTAuMDAwMDF6IiBmaWxsPSIjQTVERTM3IiBzdHJva2U9Im51bGwiLz4KICAgPHBhdGggaWQ9InN2Z18zIiBjbGFzcz0ic3QyIiBkPSJtNjYyLjY1NTAzLDE2Ny40MjM3MWwtNTYuNjEwMjcsMzIuNDY3NjZjMS42NjUwMSw1LjgyNzUzIDMuMzMwMDIsMTIuNDg3NTYgMy4zMzAwMiwxOS4xNDc1OWwwLDE2My4xNzA3OWMwLDI0LjE0MjYyIC0xMy4zMjAwNiw0Ni42MjAyMiAtMzMuMzAwMTYsNTguMjc1MjhsLTE0Mi4zNTgxOSw4MS41ODUzOWMtNi42NjAwMywzLjMzMDAyIC0xMy4zMjAwNiw1LjgyNzUzIC0yMC44MTI2LDcuNDkyNTRsMCw2NC45MzUzMWM5Ljk5MDA1LC0xLjY2NTAxIDE5Ljk4MDEsLTQuOTk1MDIgMjguMzA1MTQsLTkuOTkwMDVsMTg0LjgxNTg5LC0xMDUuNzI4MDFjMjUuODA3NjIsLTE0Ljk4NTA3IDQxLjYyNTIsLTQyLjQ1NzcgNDEuNjI1MiwtNzIuNDI3ODVsMCwtMjExLjQ1NjAyYzAsLTkuMTU3NTQgLTEuNjY1MDEsLTE4LjMxNTA5IC00Ljk5NTAyLC0yNy40NzI2M2wtMC4wMDAwMSwweiIgZmlsbD0iI0M4RjE3OCIgc3Ryb2tlPSJudWxsIi8+CiAgIDxwYXRoIGlkPSJzdmdfNCIgY2xhc3M9InN0MSIgZD0ibTM5OS41ODM3NiwzMDMuOTU0MzZjOC4zMjUwNCwtMTMuMzIwMDYgMjAuODEyNiwtMjUuODA3NjIgMzkuMTI3NjksLTM2LjYzMDE4bDE1NS42NzgyNSwtODkuOTEwNDNjLTQuOTk1MDIsLTYuNjYwMDMgLTExLjY1NTA2LC0xMi40ODc1NiAtMTguMzE1MDksLTE2LjY1MDA4bC0xNDIuMzU4MTksLTgxLjU4NTM5Yy0yMC44MTI2LC0xMS42NTUwNiAtNDYuNjIwMjIsLTExLjY1NTA2IC02Ny40MzI4MiwwbC0xNDEuNTI1NjgsODEuNTg1MzljLTcuNDkyNTQsNC4xNjI1MiAtMTMuMzIwMDYsOS45OTAwNSAtMTkuMTQ3NTksMTYuNjUwMDhsMTU0Ljg0NTc1LDg5LjkxMDQzYzE4LjMxNTA5LDExLjY1NTA2IDMwLjgwMjY1LDIzLjMxMDExIDM5LjEyNzY5LDM2LjYzMDE4bC0wLjAwMDAxLDB6IiBmaWxsPSIjQTVERTM3IiBzdHJva2U9Im51bGwiLz4KICAgPHBhdGggaWQ9InN2Z181IiBjbGFzcz0ic3QyIiBkPSJtMjI0Ljc1NzkyLDE2MS41OTYxOGwxNDEuNTI1NjgsLTgxLjU4NTM5YzIwLjgxMjYsLTExLjY1NTA2IDQ2LjYyMDIyLC0xMS42NTUwNiA2Ny40MzI4MiwwbDE0Mi4zNTgxOSw4MS41ODUzOWM3LjQ5MjU0LDQuMTYyNTIgMTMuMzIwMDYsOS45OTAwNSAxOC4zMTUwOSwxNi42NTAwOGw1Ni42MTAyNywtMzIuNDY3NjZjLTYuNjYwMDMsLTkuMTU3NTQgLTE0Ljk4NTA3LC0xNi42NTAwOCAtMjQuOTc1MTIsLTIxLjY0NTFsLTE4NC44MTU4OSwtMTA3LjM5MzAyYy0yNS44MDc2MiwtMTQuOTg1MDcgLTU3LjQ0Mjc4LC0xNC45ODUwNyAtODMuMjUwNCwwbC0xODMuMTUwODgsMTA2LjU2MDUxYy05Ljk5MDA1LDUuODI3NTMgLTE4LjMxNTA5LDEzLjMyMDA2IC0yNC45NzUxMiwyMi40Nzc2MWw1Ni42MTAyNywzMi40Njc2NmM0LjE2MjUyLC02LjY2MDAzIDEwLjgyMjU1LC0xMi40ODc1NiAxOC4zMTUwOSwtMTYuNjUwMDh6IiBmaWxsPSIjQzhGMTc4IiBzdHJva2U9Im51bGwiLz4KICAgPHBhdGggaWQ9InN2Z182IiBjbGFzcz0ic3QyIiBkPSJtMzY2LjI4MzYsNTIyLjA3MDQxbC0xNDEuNTI1NjgsLTgxLjU4NTM5Yy0yMC44MTI2LC0xMS42NTUwNiAtMzMuMzAwMTYsLTM0LjEzMjY2IC0zMy4zMDAxNiwtNTguMjc1MjhsMCwtMTYzLjE3MDc5YzAsLTYuNjYwMDMgMC44MzI1LC0xMi40ODc1NiAyLjQ5NzUxLC0xOC4zMTUwOWwtNTYuNjEwMjcsLTMyLjQ2NzY2Yy0zLjMzMDAyLDkuMTU3NTQgLTQuOTk1MDIsMTcuNDgyNTggLTQuOTk1MDIsMjYuNjQwMTNsMCwyMTIuMjg4NTJjMCwyOS45NzAxNCAxNS44MTc1OCw1Ny40NDI3OCA0MS42MjUyLDcxLjU5NTM0bDE4My45ODMzOSwxMDUuNzI4MDFjOC4zMjUwNCw0Ljk5NTAyIDE4LjMxNTA5LDguMzI1MDQgMjguMzA1MTQsOS45OTAwNWwwLC02NC45MzUzMWMtNi42NjAwMywtMC44MzI1IC0xMy4zMjAwNiwtMy4zMzAwMiAtMTkuOTgwMSwtNy40OTI1NGwtMC4wMDAwMSwwLjAwMDAxeiIgZmlsbD0iI0M4RjE3OCIgc3Ryb2tlPSJudWxsIi8+CiAgIDxwYXRoIGlkPSJzdmdfNyIgY2xhc3M9InN0MSIgZD0ibTM0Ny4xMzYwMSwyODguOTY5MjlsLTE1My4xODA3NCwtODguMjQ1NDJjLTEuNjY1MDEsNS44Mjc1MyAtMi40OTc1MSwxMi40ODc1NiAtMi40OTc1MSwxOC4zMTUwOWwwLDE2My4xNzA3OWMwLDI0LjE0MjYyIDEyLjQ4NzU2LDQ2LjYyMDIyIDMzLjMwMDE2LDU4LjI3NTI4bDE0MS41MjU2OCw4MS41ODUzOWM2LjY2MDAzLDMuMzMwMDIgMTMuMzIwMDYsNS44Mjc1MyAyMC44MTI2LDcuNDkyNTRsMCwtMTcxLjQ5NTgzYy0wLjgzMjUsLTI0Ljk3NTEyIC03LjQ5MjU0LC00NS43ODc3MiAtMzkuOTYwMTksLTY5LjA5NzgzbDAsLTAuMDAwMDF6IiBmaWxsPSIjQTVERTM3IiBzdHJva2U9Im51bGwiLz4KICA8L2c+CiA8L2c+Cgo8L3N2Zz4=';

const ETCHER_OPEN_IMAGE_URL = 'https://www.balena.io/etcher/open-image-url';

export enum ActionType {
	flash = 'flash',
	downloadOs = 'download_os',
	downloadConfigFile = 'download_config_file',
}

// This interface should only have properties that are intended to be part of the payload to Etcher
export interface DownloadImageFormModel {
	appId: number;
	releaseId: number | undefined;
	deviceType: DeviceType;
	version: string;
	network: 'ethernet' | 'wifi';
	secureboot: boolean;
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
		isObjectEmpty(osVersions) ||
		!deviceTypeSlug ||
		osVersions[deviceTypeSlug]?.length === 0
	) {
		return [];
	}

	return uniq(osVersions[deviceTypeSlug].map((x) => x.osType));
};

const generateImageUrl = (
	model: Omit<DownloadImageFormModel, 'deviceType'> & { deviceType: string },
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
		.map(([key, value]) => (value ? `${key}=${value}` : null))
		.filter((param) => !!param)
		.join('&');
	return `${downloadUrl}?${queryParams}`;
};

const flashWithEtcher = (
	model: DownloadImageFormModel,
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

const getInitialState = (
	deviceType: DeviceType,
	applicationId: number,
	releaseId: number | undefined,
): DownloadImageFormModel => ({
	appId: applicationId,
	releaseId,
	deviceType,
	version: '',
	network: 'ethernet',
	secureboot: false,
	developmentMode: false,
	appUpdatePollInterval: 10,
	wifiSsid: undefined,
	wifiKey: undefined,
	provisioningKeyName: undefined,
	provisioningKeyExpiryDate: undefined,
});

const debounceDownloadSize = debounce(
	async (
		getDownloadSize: NonNullable<DownloadImageDialogProps['getDownloadSize']>,
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
);

export interface DownloadImageDialogProps {
	open: boolean;
	applicationId: number;
	releaseId?: number;
	compatibleDeviceTypes: DeviceType[] | null;
	initialDeviceType: DeviceType;
	initialOsVersions?: OsVersionsByDeviceType;
	isInitialDefault?: boolean;
	downloadUrl: string;
	onDownloadStart?: (
		model: DownloadImageFormModel,
		actionType: ActionType,
	) => void;
	getSupportedOsVersions?: () => Promise<OsVersionsByDeviceType>;
	getSupportedOsTypes?: (
		applicationId: number,
		deviceTypeSlug: string,
	) => Promise<string[]>;
	downloadConfig?: (model: DownloadImageFormModel) => Promise<void>;
	getDownloadSize?: (
		deviceType: DeviceType,
		rawVersion: string | null,
	) => Promise<string> | undefined;
	getDockerArtifact: (deviceTypeSlug: string, rawVersion: string) => string;
	hasEsrVersions?: (deviceTypeSlugs: string[]) => Promise<Dictionary<boolean>>;
	onClose: () => void;
	dialogActions?: DropDownButtonProps['items'];
	authToken?: string;
	onFieldChange?: (fields: { [key: string]: any }) => void;
}

export const DownloadImageDialog = ({
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
	onFieldChange,
	dialogActions,
	authToken,
}: DownloadImageDialogProps) => {
	const formElement = useRef<HTMLFormElement | null>(null);
	const [formModel, setFormModel] = useState(
		getInitialState(initialDeviceType, applicationId, releaseId),
	);

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
	const [isFetching, setIsFetching] = useState(isObjectEmpty(osVersions));
	const [downloadSize, setDownloadSize] = useState<string | null>(null);
	const [isValidatingUrl, setIsValidatingUrl] = useState(false);

	const defaultDisplayName = useMemo(
		() => formModel.deviceType?.name ?? '-',
		[formModel.deviceType?.name],
	);

	const withUrlValidation = useCallback(
		(action: () => void) => async () => {
			setIsValidatingUrl(true);
			const modelCopy = { ...formModel, deviceType: formModel.deviceType.slug };
			const finalUrl = generateImageUrl(modelCopy, downloadUrl);
			const isAccessible = await isUrlAccessible(finalUrl, authToken);
			setIsValidatingUrl(false);
			if (!isAccessible) {
				enqueueSnackbar({
					key: 'balena_download_image_modal',
					variant: 'error',
					message:
						"We're currently experiencing some issues. Please contact support or try again later.",
					preventDuplicate: true,
				});
				return;
			}
			action();
		},
		[downloadUrl, formModel, authToken],
	);

	const actions: DropDownButtonProps['items'] = useMemo(() => {
		const dropDownButtonActions: DropDownButtonProps['items'] = [
			...(dialogActions ?? []),
			{
				eventName: 'Flash With Etcher Clicked',
				eventProperties: {
					appId: formModel.appId,
					releaseId: formModel.releaseId,
					downloadUrl,
				},
				onClick: withUrlValidation(() => {
					onDownloadStart?.(formModel, ActionType.flash);
					flashWithEtcher(formModel, downloadUrl, authToken);
				}),
				children: (
					<>
						<img width="20px" alt="etcher" src={etcherLogoBase64} /> Flash
					</>
				),
				tooltip: {
					title: 'Etcher v1.7.2 or greater is required',
					placement: 'top',
				},
			},
			{
				eventName: 'Download balenaOS Clicked',
				eventProperties: {
					appId: formModel.appId,
					releaseId: formModel.releaseId,
					downloadUrl,
				},
				onClick: withUrlValidation(() => {
					if (!formElement?.current) {
						return;
					}
					onDownloadStart?.(formModel, ActionType.downloadOs);
					formElement.current.submit();
				}),
				children: (
					<>
						<FontAwesomeIcon icon={faDownload} /> Download balenaOS{' '}
						{formModel.version && downloadSize ? ` (~${downloadSize})` : ''}
					</>
				),
			},
		];

		if (downloadConfig) {
			dropDownButtonActions.push({
				eventName: 'Download Configuration File Only',
				eventProperties: {
					appId: formModel.appId,
					releaseId: formModel.releaseId,
				},
				onClick: async () => {
					onDownloadStart?.(formModel, ActionType.downloadConfigFile);
					await downloadConfig(formModel);
				},
				children: (
					<>
						<FontAwesomeIcon icon={faDownload} /> Download configuration file
						only
					</>
				),
			});
		}

		return dropDownButtonActions satisfies DropDownButtonProps['items'];
	}, [
		authToken,
		downloadConfig,
		downloadSize,
		downloadUrl,
		formModel,
		dialogActions,
		onDownloadStart,
		withUrlValidation,
	]);

	useEffect(() => {
		if (!formModel.version || !getDownloadSize) {
			setDownloadSize(null);
			return;
		}

		// Debounce as the version changes right after the devicetype does, resulting in multiple requests.
		debounceDownloadSize(
			getDownloadSize,
			formModel.deviceType,
			formModel.version,
			setDownloadSize,
		);
	}, [formModel.deviceType, getDownloadSize, formModel.version]);

	useEffect(() => {
		if (!compatibleDeviceTypes || !getSupportedOsVersions) {
			return;
		}
		// as soon as the dialog opens, start fetching the osVersions for all
		// the compatible device types
		getSupportedOsVersions()
			.then((data) => {
				setOsVersions(data);
			})
			.catch((e) => {
				enqueueSnackbar({
					key: 'dwim-supported-os-version',
					variant: 'error',
					message: 'Something went wrong while fetching OS versions',
					preventDuplicate: true,
				});
				console.error(e);
			})
			.finally(() => {
				setIsFetching(false);
			});
	}, [compatibleDeviceTypes, applicationId, getSupportedOsVersions]);

	useEffect(() => {
		if (!getSupportedOsTypes) {
			return;
		}
		// Fetch the supported os types, so we can show the appropriate values in the Select box.
		// We only want to do it once, and we rely on the cached data here.
		void getSupportedOsTypes(applicationId, formModel.deviceType.slug).then(
			(data) => {
				setOsTypes(data);
			},
		);
	}, [formModel.deviceType.slug, applicationId, getSupportedOsTypes]);

	useEffect(() => {
		if (!compatibleDeviceTypes || !hasEsrVersions) {
			return;
		}
		void hasEsrVersions(compatibleDeviceTypes.map((dt) => dt.slug)).then(
			setDeviceTypeHasEsr,
		);
	}, [compatibleDeviceTypes, hasEsrVersions]);

	useEffect(() => {
		const osTs = getUniqueOsTypes(osVersions, formModel.deviceType.slug);
		if (!osTs.length) {
			return;
		}
		if (osType) {
			if (!osTs.includes(osType)) {
				setOsType(osTs[0]);
			}
		} else {
			setOsType(osTs.includes(OsTypesEnum.ESR) ? OsTypesEnum.ESR : osTs[0]);
		}
	}, [formModel.deviceType.slug, osType, osVersions]);

	const setOsTypeCallback = useCallback((osT: string) => {
		setOsType(osT);
	}, []);

	const handleChange = useCallback(
		(updatedProps: Partial<DownloadImageFormModel>) => {
			let newFormModelState: DownloadImageFormModel;
			if (updatedProps.deviceType != null) {
				newFormModelState = getInitialState(
					updatedProps.deviceType,
					applicationId,
					releaseId,
				);
			} else {
				newFormModelState = {
					...formModel,
					secureboot:
						'version' in updatedProps &&
						formModel.deviceType.slug === GENERIC_X86_SLUG &&
						semver.lt(
							updatedProps['version'],
							GENERIC_X86_MINIMUM_SUPPORTED_SECUREBOOT_VERSION,
						)
							? false
							: formModel.secureboot,
					...updatedProps,
				};
				onFieldChange?.(newFormModelState);
			}
			setFormModel(newFormModelState);
		},
		[formModel, applicationId, releaseId, onFieldChange],
	);

	return (
		<DialogWithCloseButton
			title={
				<Stack direction="row" alignItems="center" gap={2}>
					<Avatar
						variant="square"
						alt={defaultDisplayName}
						src={formModel.deviceType?.logo ?? FALLBACK_LOGO_UNKNOWN_DEVICE}
					/>
					<Typography variant="h5">Add new device</Typography>
				</Stack>
			}
			open={open}
			onClose={onClose}
			maxWidth="lg"
			fullWidth
		>
			<DialogContent>
				<Spinner show={isValidatingUrl}>
					<Grid container spacing={[0, 0, 4]}>
						<Grid
							size={{
								xs: 12,
								sm: 12,
								md: 6,
								lg: 7,
							}}
						>
							{isFetching ? (
								<Spinner />
							) : (
								<>
									{isObjectEmpty(osVersions) && (
										<Callout severity="warning">
											No OS versions available for download
										</Callout>
									)}
									{!!osType && !!compatibleDeviceTypes && (
										<ImageForm
											applicationId={applicationId}
											releaseId={releaseId}
											compatibleDeviceTypes={compatibleDeviceTypes}
											osVersions={osVersions}
											isInitialDefault={isInitialDefault}
											hasEsrVersions={
												deviceTypeHasEsr[formModel.deviceType.slug]
											}
											formElement={formElement}
											downloadUrl={downloadUrl}
											authToken={authToken}
											osType={osType}
											osTypes={osTypes}
											model={formModel}
											onSelectedOsTypeChange={setOsTypeCallback}
											onChange={handleChange}
										/>
									)}
								</>
							)}
						</Grid>
						<Grid
							pb={0}
							size={{
								xs: 12,
								sm: 12,
								md: 6,
								lg: 5,
							}}
						>
							<Divider
								variant="fullWidth"
								sx={{
									mt: 2,
									mb: 3,
									display: {
										xs: 'block',
										sm: 'block',
										md: 'none',
									},
								}}
							/>
							<ApplicationInstructions
								deviceType={formModel.deviceType}
								templateData={{
									dockerImage: formModel.version
										? getDockerArtifact(
												formModel.deviceType.slug,
												stripVersionBuild(formModel.version),
											)
										: '',
								}}
								secureboot={formModel.secureboot}
							/>
						</Grid>
						{(formModel.deviceType.imageDownloadAlerts ?? []).map((alert) => {
							return (
								<Grid pt={0} key={alert.message} size={12}>
									<Callout
										key={alert.message}
										severity={alert.type as CalloutProps['severity']}
									>
										{alert.message}
									</Callout>
								</Grid>
							);
						})}
					</Grid>
				</Spinner>
			</DialogContent>
			<DialogActions>
				<DropDownButton
					className="e2e-download-image-submit"
					items={actions}
					disabled={isValidatingUrl}
				/>
			</DialogActions>
		</DialogWithCloseButton>
	);
};
