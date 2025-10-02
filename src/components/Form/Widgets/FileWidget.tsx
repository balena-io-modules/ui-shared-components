import type {
	Accept,
	DropzoneOptions,
	ErrorCode,
	FileRejection,
} from 'react-dropzone';
import { useDropzone } from 'react-dropzone';
import {
	Typography,
	InputLabel,
	Stack,
	type SxProps,
	Link,
	LinearProgress,
	Box,
	useMediaQuery,
	useTheme,
} from '@mui/material';
import type { WidgetProps } from '@rjsf/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IconButtonWithTracking, Tooltip } from '../../..';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { IconDefinition } from '@fortawesome/free-solid-svg-icons';
import {
	faCircleExclamation,
	faFile,
	faFileImage,
	faTrash,
	faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { useRandomUUID } from '../../../hooks/useRandomUUID';
import uniq from 'lodash/uniq';
import { token } from '../../../utils/token';

const restingStyle: SxProps = {
	borderColor: token('color.border'),
	borderWidth: '1px',
	backgroundColor: token('color.bg'),
};

const hoverStyle: SxProps = {
	borderColor: token('color.border.strong'),
	borderWidth: '1px',
	backgroundColor: token('color.bg'),
	'.browse-files-text': { textDecoration: 'none' },
};

const disabledStyle: SxProps = {
	borderColor: token('color.border.strong'),
	borderWidth: '1px',
	backgroundColor: token('color.bg'),
	opacity: '40%',
};

const dragStyle: SxProps = {
	borderColor: token('color.border.accent.strong'),
	borderWidth: '2px',
	backgroundColor: token('color.bg.accent'),
};

// These are just the ones we use in the dashboard at the moment
// (excluding XML which is a pro icon, for which we just default to faFile)
// we can add more as we get the usecases
// TODO: Add the XML pro icon when we have support for pro icons in this repo
const getFileTypeIcon = (fileType: string) => {
	switch (fileType) {
		case 'image/png':
		case 'image/jpg':
		case 'image/jpeg':
			return faFileImage;
		default:
			return faFile;
	}
};

const fileSizeToReadable = (size: number) => {
	const i = Math.floor(Math.log(size) / Math.log(1024));
	const readableFileSize = size / Math.pow(1024, i);
	if (Number.isNaN(readableFileSize)) {
		return '';
	}
	return `${readableFileSize.toFixed(2)}${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
};

type AcceptedFile = File & {
	loadingPercentage?: number;
	base64Data?: string;
};

// Improve error messages from react-dropzone
const getErrorMessage = (
	code: ErrorCode | string | undefined,
	message: string,
	maxSize: number,
) => {
	switch (code) {
		case 'file-too-large':
			return `File is larger than ${fileSizeToReadable(maxSize)}`;
		default:
			return message;
	}
};

export interface OnFileReadParams {
	dataUrl: string;
	uploadedFile: File;
}

type FileWidgetProps = WidgetProps & {
	// TODO: Currently it's not officially supported to raise errors via a custom widget's onChange, any attempt to do so would be a workaround
	// See: https://github.com/rjsf-team/react-jsonschema-form/issues/2718
	// There is a PR open to address this, so we should keep an eye on it and revisit this widget's "error-raising" when it's merged
	// See: https://github.com/rjsf-team/react-jsonschema-form/pull/4188
	onChange: (params?: OnFileReadParams) => void;
	value?: OnFileReadParams | string;
};

type UIOptions = {
	accept?: Accept;
	maxSize?: number;
	disabled?: boolean;
	disabledReason?: string;
	browseResourceName?: string;
	variant?: 'large' | 'small';
	uploadIcon?: IconDefinition;
	descriptiveText?: string;
	hideUploadedFiles?: boolean;
};

export const FileWidget = ({
	onChange,
	multiple,
	schema,
	uiSchema,
}: FileWidgetProps) => {
	const [files, setFiles] = useState<AcceptedFile[]>([]);
	const [filesWithDataUrl, setFilesWithDataUrl] = useState<OnFileReadParams[]>(
		[],
	);
	const [errorFiles, setErrorFiles] = useState<FileRejection[]>([]);
	const theme = useTheme();
	const mobile = useMediaQuery(theme.breakpoints.down('md'));
	const formId = useRandomUUID();

	const fileUploadId = useMemo(() => `file-upload-${formId}`, [formId]);

	const options = uiSchema?.['ui:options'] as UIOptions | undefined;
	const accept = options?.accept;
	const maxSize = options?.maxSize;
	const disabled = options?.disabled;
	const disabledReason = options?.disabledReason;
	const browseResourceName = options?.browseResourceName;
	const isSmall = options?.variant === 'small';
	const uploadIcon = options?.uploadIcon;
	const descriptiveText = options?.descriptiveText;
	const hideUploadedFiles = options?.hideUploadedFiles;

	const onDrop = useCallback<NonNullable<DropzoneOptions['onDrop']>>(
		(acceptedFiles: AcceptedFile[], rejectedFiles) => {
			acceptedFiles.forEach((file) => {
				const reader = new FileReader();
				reader.onerror = () => {
					rejectedFiles.push({
						file,
						errors: [{ code: '', message: 'Failed to upload' }],
					});
				};
				reader.onloadstart = () => {
					file.loadingPercentage = 0;
				};
				reader.onprogress = (event) => {
					file.loadingPercentage = Math.floor(
						(100 * event.loaded) / event.total,
					);
				};
				reader.onloadend = () => {
					delete file.loadingPercentage;
					if (typeof reader.result !== 'string' || !reader.result || !file) {
						return;
					}
					const base64Data = reader.result.split(',')[1];
					file.base64Data = base64Data;
					const dataUrl = `data:${file.type};name=${file.name};base64,${base64Data}`;
					setFilesWithDataUrl((prev) => [
						...prev,
						{
							dataUrl,
							uploadedFile: file,
						},
					]);
				};
				reader.readAsDataURL(file);
			});
			if (multiple) {
				setFiles([...files, ...acceptedFiles]);
			} else {
				setFiles(acceptedFiles.length ? [acceptedFiles[0]] : []);
			}
			setErrorFiles(rejectedFiles);
		},
		[setFiles, files, multiple],
	);

	useEffect(() => {
		if (filesWithDataUrl.length && filesWithDataUrl.length === files.length) {
			// NOTE: JSONSchema array data-url does not expect objects but only strings[]
			// see: https://github.com/rjsf-team/react-jsonschema-form/blob/297dac059fdf64fd1453bebb8366f0602c722f90/packages/utils/src/schema/isFilesArray.ts#L24
			// Check if possibile to always pass only strings (dataUrls) and not objects when not multiple.
			if (multiple) {
				onChange(
					filesWithDataUrl.map((fileWithDataUrl) => fileWithDataUrl.dataUrl),
				);
				return;
			}
			// If not multiple, the schema accept an object and we can pass it directly
			// if not necessary, in a major release we can change it to pass only the dataUrl string and unify the behaviour
			onChange(filesWithDataUrl[0]);
		}
	}, [files, filesWithDataUrl, multiple, onChange]);

	const removeFile = useCallback(
		(index: number) => {
			const newFiles = [...files];
			newFiles.splice(index, 1);
			setFiles(newFiles);
			if (multiple) {
				onChange(
					newFiles
						.filter((file) => file.loadingPercentage === null)
						.map(
							(file) =>
								`data:${file.type};name=${file.name};base64,${file.base64Data}`,
						),
				);
				return;
			}
			onChange();
		},
		[files, setFiles, multiple, onChange],
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		maxSize,
		accept,
		multiple: !!multiple,
		useFsAccessApi: false,
		disabled,
		noDrag: false,
	});

	return (
		<Tooltip title={disabledReason}>
			<Box
				sx={{
					'.dropzone': {
						...(disabled
							? disabledStyle
							: isDragActive
								? dragStyle
								: restingStyle),
						'.browse-files-text': { textDecoration: 'underline' },
						...(!disabled && { '&:hover': hoverStyle }),
					},
				}}
			>
				{schema.title && (
					<InputLabel htmlFor={fileUploadId}>{schema.title}</InputLabel>
				)}
				<Stack
					id={fileUploadId}
					className="dropzone"
					sx={{
						borderStyle: 'dashed',
						borderRadius: token('shape.borderRadius.md'),
						flexDirection: 'column',
						alignItems: 'center',
						justifyContent: 'center',
						cursor: disabled ? 'default' : 'pointer',
						gap: 3,
						p: isSmall ? 4 : 5,
					}}
					{...getRootProps()}
				>
					<input type="file" {...getInputProps()} />
					<Stack
						direction={isSmall ? 'row' : 'column'}
						gap={isSmall ? 1 : 3}
						alignItems="center"
					>
						{/* TODO: remove `uploadIcon` prop when we are able to have pro icons in ui shared */}
						<FontAwesomeIcon
							icon={isSmall ? faUpload : (uploadIcon ?? faUpload)}
							{...(isSmall
								? { size: 'lg' }
								: // TODO: icon sizes need to be properly added to the design tokens
									{ fontSize: '48px' })}
						/>
						<Typography variant="bodyLg">
							Drag and drop or{' '}
							<Typography
								className="browse-files-text"
								variant="bodyLg"
								component={Link}
							>
								browse {browseResourceName ? `${browseResourceName} ` : ''}
								files
							</Typography>
						</Typography>
					</Stack>
					{!!descriptiveText && (
						<Typography color={token('color.text.subtle')} component="p">
							{descriptiveText}
						</Typography>
					)}
				</Stack>
				<Stack gap={2}>
					<Stack direction="row" justifyContent="space-between" gap={3}>
						<Typography color={token('color.text.subtle')}>
							{accept == null
								? ''
								: `Supported formats: ${uniq(
										Object.values(accept)
											// The values of accept are arrays of file types, take them and flatten them
											.flat()
											// Remove the dot from the file type and capitalize it
											.map((fileType) => fileType.slice(1).toUpperCase()),
									).join(', ')}`}
						</Typography>
						{maxSize != null && (
							<Typography color={token('color.text.subtle')} align="right">
								Maximum size: {fileSizeToReadable(maxSize)}
							</Typography>
						)}
					</Stack>

					{hideUploadedFiles && !!errorFiles.length && (
						<Stack color={token('color.text.danger')} gap={1}>
							{errorFiles
								.flatMap((errorFile) => errorFile.errors)
								.map((error) =>
									getErrorMessage(
										error.code,
										error.message,
										maxSize ?? Infinity,
									),
								)}
						</Stack>
					)}
					{!hideUploadedFiles && (
						<Stack gap={1}>
							{files.map((file, index) => (
								<Stack
									direction="row"
									justifyContent="space-between"
									alignItems="center"
									gap={2}
									bgcolor={token('color.bg')}
									p={3}
									borderRadius={token('shape.borderRadius.md')}
									{...(mobile && { flexWrap: 'wrap' })}
									key={file.name}
								>
									<Stack
										direction="row"
										{...(mobile && { justifyContent: 'space-between' })}
										gap={2}
										alignItems="center"
										width="100%"
									>
										<Stack
											direction="row"
											gap={2}
											alignItems="center"
											maxWidth="45%"
										>
											<FontAwesomeIcon icon={getFileTypeIcon(file.type)} />
											<Typography
												{...(mobile
													? { maxWidth: '100%' }
													: { width: '150px' })}
												noWrap
											>
												{file.name}
											</Typography>
										</Stack>
										{file.loadingPercentage != null && (
											<LinearProgress
												variant="determinate"
												value={file.loadingPercentage}
												sx={{
													width: mobile ? '100%' : '150px',
													...(mobile && { maxWidth: '45%' }),
													height: '8px',
												}}
											/>
										)}
									</Stack>
									<Stack
										direction="row"
										{...(mobile
											? { justifyContent: 'space-between', width: '100%' }
											: { gap: 2 })}
										alignItems="center"
									>
										<Stack direction="row" gap={2}>
											<Typography color={token('color.text.subtle')}>
												{file.type}
											</Typography>
											<Typography color={token('color.text.subtle')}>
												{fileSizeToReadable(file.size)}
											</Typography>
										</Stack>
										<IconButtonWithTracking
											eventName="FileWidget: Delete uploaded file"
											aria-label="Delete uploaded file"
											onClick={() => {
												removeFile(index);
											}}
											// So that the Button padding does not affect the Stack padding
											sx={{ p: '0' }}
										>
											<FontAwesomeIcon icon={faTrash} />
										</IconButtonWithTracking>
									</Stack>
								</Stack>
							))}
							{errorFiles.map(({ file, errors }) => (
								<Stack
									gap={1}
									bgcolor={token('color.bg')}
									p={3}
									borderRadius={token('shape.borderRadius.md')}
									border="1px solid"
									borderColor={token('color.border.danger')}
									key={file.name}
								>
									<Stack
										direction="row"
										justifyContent="space-between"
										alignItems="center"
										gap={2}
									>
										<Stack
											direction="row"
											gap={2}
											alignItems="center"
											width="100%"
										>
											<FontAwesomeIcon icon={getFileTypeIcon(file.type)} />
											<Typography>{file.name}</Typography>
										</Stack>
										<Stack direction="row" gap={2} alignItems="center">
											<Typography color={token('color.text.subtle')}>
												{file.type}
											</Typography>
											<Typography color={token('color.text.subtle')}>
												{fileSizeToReadable(file.size)}
											</Typography>
										</Stack>
									</Stack>
									<Stack gap={1}>
										{errors.map((error) => (
											<Stack
												gap={2}
												color={token('color.text.danger')}
												direction="row"
												alignItems="center"
												key={error.message}
											>
												<FontAwesomeIcon icon={faCircleExclamation} />
												{getErrorMessage(
													error.code,
													error.message,
													maxSize ?? Infinity,
												)}
											</Stack>
										))}
									</Stack>
								</Stack>
							))}
						</Stack>
					)}
				</Stack>
			</Box>
		</Tooltip>
	);
};
