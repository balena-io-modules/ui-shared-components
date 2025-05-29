import type { SelectProps } from '@mui/material';
import {
	Box,
	InputLabel,
	MenuItem,
	Select,
	Tooltip,
	Typography,
	Stack,
} from '@mui/material';
import { getOsTypeName } from './utils';
import { MUILinkWithTracking } from '../MUILinkWithTracking';
import { OsTypesEnum } from './models';
import { Chip } from '../Chip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// TODO: replace with PRO version if we will have access to it
import { faFileLines } from '@fortawesome/free-solid-svg-icons';

interface OsTypeSelectorProps<T>
	extends Omit<
		SelectProps<T>,
		| 'options'
		| 'onChange'
		| 'valueKey'
		| 'disabledKey'
		| 'valueLabel'
		| 'children'
	> {
	supportedOsTypes: string[];
	hasEsrVersions: boolean;
	selectedOsTypeSlug: string | null;
	onSelectedOsTypeChange: (osType: string) => void;
}

interface OsTypeObj {
	slug: string;
	disabled: boolean;
	supportedForDeviceType: boolean;
	supportedForApp: boolean;
}

const OsTypeOption = ({ osType }: { osType: OsTypeObj | undefined }) => {
	if (!osType) {
		return <Typography variant="body1">Select OS type...</Typography>;
	}
	return (
		<Tooltip
			title={
				!osType.supportedForDeviceType
					? 'No ESR versions are available for this device type yet. Check the documentation for device types that already have ESR versions.'
					: undefined
			}
		>
			<Box
				display="flex"
				width="100%"
				justifyContent="space-between"
				alignItems="center"
				gap={1}
			>
				<Typography variant="body1">{getOsTypeName(osType.slug)}</Typography>
				{!osType.supportedForDeviceType && (
					<Chip label="no versions yet" color="blue" />
				)}
				{!osType.supportedForApp && (
					<Chip label="production and enterprise plan only" color="orange" />
				)}
			</Box>
		</Tooltip>
	);
};

export const OsTypeSelector = ({
	supportedOsTypes,
	hasEsrVersions,
	selectedOsTypeSlug,
	onSelectedOsTypeChange,
}: OsTypeSelectorProps<OsTypeObj>) => {
	const selectOsTypes = Object.values({
		default: OsTypesEnum.DEFAULT,
		ESR: OsTypesEnum.ESR,
	}).map<OsTypeObj>((osType: OsTypesEnum) => {
		const supportedForDeviceType =
			osType === OsTypesEnum.ESR ? hasEsrVersions : true;
		const supportedForApp = supportedOsTypes.includes(osType);
		const disabled = !supportedForApp || !supportedForDeviceType;

		return {
			slug: osType,
			disabled,
			supportedForDeviceType,
			supportedForApp,
		};
	});

	const selectedOsType = selectOsTypes.find(
		(osType) =>
			osType.slug === selectedOsTypeSlug && osType.supportedForDeviceType,
	);

	return (
		<Stack flex={1}>
			<Stack direction="row" alignItems="center" gap={1}>
				<InputLabel
					id="newAppApplicationType-label"
					sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
				>
					OS type
					<MUILinkWithTracking
						sx={{ height: 12 }}
						href="https://www.balena.io/docs/reference/OS/extended-support-release"
					>
						<FontAwesomeIcon icon={faFileLines} fontSize="1rem" />
					</MUILinkWithTracking>
				</InputLabel>
			</Stack>
			<Select<(typeof selectOsTypes)[number]['slug']>
				id="newAppApplicationType"
				fullWidth
				disabled={supportedOsTypes.length === 0}
				value={selectedOsType?.slug ?? OsTypesEnum.DEFAULT}
				renderValue={(selected) => (
					<Box display="flex" width="100%">
						<OsTypeOption
							osType={selectOsTypes.find((osType) => selected === osType.slug)}
						/>
					</Box>
				)}
				onChange={(event) => {
					const osType = selectOsTypes.find(
						(os) => os.slug === event.target.value,
					)!;
					if (!osType.disabled) {
						onSelectedOsTypeChange(osType.slug);
					}
				}}
				sx={{ flex: 1 }}
			>
				{selectOsTypes.map((option) => (
					// TODO: Consider adding a tooltip for the disabled options
					<MenuItem
						value={option.slug}
						key={option.slug}
						disabled={option.disabled}
					>
						<OsTypeOption osType={option} />
					</MenuItem>
				))}
			</Select>
		</Stack>
	);
};
