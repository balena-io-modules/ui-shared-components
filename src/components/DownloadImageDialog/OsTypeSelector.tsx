import {
	Badge,
	Box,
	InputLabel,
	MenuItem,
	Select,
	SelectProps,
	Tooltip,
	Typography,
} from '@mui/material';
import { getOsTypeName } from './utils';
import ArticleIcon from '@mui/icons-material/Article';
import { MUILinkWithTracking } from '../MUILinkWithTracking';
import { OsTypesEnum } from './models';
import { Chip } from '../Chip';

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
			>
				<Typography variant="body1">{getOsTypeName(osType.slug)}</Typography>
				<Box>
					{!osType.supportedForDeviceType && (
						<Chip label="no versions yet" color="blue" />
					)}
					{!osType.supportedForApp && (
						<Chip label="production and enterprise plan only" color="orange" />
					)}
				</Box>
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
		<Box display="flex" flexDirection="column" flex={1}>
			<InputLabel
				htmlFor="newAppApplicationType"
				sx={{ display: 'flex', alignItems: 'center', mb: 2 }}
			>
				Select OS type{' '}
				<MUILinkWithTracking
					sx={{ height: 14 }}
					href="https://www.balena.io/docs/reference/OS/extended-support-release"
				>
					<ArticleIcon sx={{ width: 14, height: 14, marginLeft: 1 }} />
				</MUILinkWithTracking>
			</InputLabel>
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
					return !osType.disabled && onSelectedOsTypeChange(osType.slug);
				}}
			>
				{selectOsTypes.map((option) => (
					<MenuItem value={option.slug} key={option.slug}>
						<OsTypeOption osType={option} />
					</MenuItem>
				))}
			</Select>
		</Box>
	);
};
