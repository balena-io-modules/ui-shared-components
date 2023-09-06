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

const OsTypeOption = ({
	osType,
	bold,
}: {
	osType: OsTypeObj | undefined;
	bold?: boolean;
}) => {
	if (!osType) {
		return <Typography variant="body1">Select OS type...</Typography>;
	}
	return (
		<Box
			display="flex"
			width="100%"
			justifyContent="space-between"
			alignItems="center"
		>
			<Typography variant="body1" fontWeight={bold ? 'bold' : 'normal'}>
				{getOsTypeName(osType.slug)}
			</Typography>
			<Box>
				{!osType.supportedForDeviceType && (
					<Badge badgeContent="no versions yet" color="info" />
				)}
				{!osType.supportedForApp && (
					<Badge
						badgeContent="production and enterprise plan only"
						color="warning"
					/>
				)}
			</Box>
		</Box>
	);
};

export const OsTypeSelector = ({
	supportedOsTypes,
	hasEsrVersions,
	selectedOsTypeSlug,
	onSelectedOsTypeChange,
	...otherProps
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
		<Box display="flex" flexDirection="column" flex={1} ml={1}>
			<InputLabel sx={{ display: 'flex', mb: 2 }}>
				Select OS type{' '}
				<MUILinkWithTracking
					href="https://www.balena.io/docs/reference/OS/extended-support-release"
					height="24px"
				>
					<ArticleIcon />
				</MUILinkWithTracking>
			</InputLabel>
			<Select<(typeof selectOsTypes)[number]>
				id="newAppApplicationType"
				fullWidth
				sx={{ height: '56px' }}
				disabled={supportedOsTypes.length === 0}
				value={selectedOsType}
				label={
					<Box display="flex" width="100%" py={2} pl={3}>
						<OsTypeOption osType={selectedOsType} />
					</Box>
				}
				onChange={(event) => {
					const osType = selectOsTypes.find(
						(os) => os.slug === event.target.value,
					)!;
					return !osType.disabled && onSelectedOsTypeChange(osType.slug);
				}}
				{...otherProps}
			>
				{selectOsTypes.map((option) => (
					<MenuItem value={option.slug}>
						<Tooltip title="No ESR versions are available for this device type yet. Check the documentation for device types that already have ESR versions.">
							<OsTypeOption
								osType={option}
								bold={selectedOsTypeSlug === option.slug}
							/>
						</Tooltip>
					</MenuItem>
				))}
			</Select>
		</Box>
	);
};
