import UploadFileIcon from '@mui/icons-material/UploadFile';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import { type Accept, type DropzoneOptions, useDropzone } from 'react-dropzone';
import {
	Box,
	Typography,
	CircularProgress,
	Avatar,
	InputLabel,
	List,
	ListItem,
	ListItemText,
} from '@mui/material';
import type { WidgetProps } from '@rjsf/utils';
import { useCallback, useState } from 'react';

export interface OnFileReadSuccessParams {
	dataUrl: string;
	uploadedFile: File;
}

export interface OnFileReadErrorParams {
	uploadErrors: string[];
}

// We need to forward uploadErrors onChange because RJSF does not support widget modifying
// the default error handler.See: https://github.com/rjsf-team/react-jsonschema-form/issues/2718
export type OnFileReadParams = OnFileReadSuccessParams | OnFileReadErrorParams;

type FileWidgetProps = WidgetProps & {
	onChange: (params?: OnFileReadParams) => void;
	value?: OnFileReadParams | string;
};

export const FileWidget = ({
	onChange,
	value,
	multiple,
	...props
}: FileWidgetProps) => {
	const { schema, uiSchema } = props;

	const [loadingPercentage, setLoadingPercentage] = useState<
		number | undefined
	>(undefined);
	const [errors, setErrors] = useState<string[]>([]);

	const accept = uiSchema?.['ui:options']?.accept as Accept | undefined;
	const maxSize = uiSchema?.['ui:options']?.maxSize as number | undefined;

	const dataUrl = (
		dataUrlValue: OnFileReadParams | string,
	): string | undefined => {
		if (typeof dataUrlValue === 'string') {
			return dataUrlValue;
		}

		if ('dataUrl' in dataUrlValue) {
			return dataUrlValue.dataUrl;
		}
	};

	const isImage = (value: OnFileReadParams | string) => {
		return dataUrl(value)?.startsWith('data:image/');
	};

	const onDrop = useCallback<NonNullable<DropzoneOptions['onDrop']>>(
		(acceptedFiles, fileRejections) => {
			setErrors([]);

			if (fileRejections != null && fileRejections.length > 0) {
				const uploadErrors = fileRejections[0].errors.map(
					({ message }) => `${fileRejections[0].file.name}: ${message}`,
				);
				setErrors(uploadErrors);
				return onChange({ uploadErrors });
			}
			const dataUrls: string[] = [];
			acceptedFiles.forEach((file, i) => {
				const reader = new FileReader();
				reader.onerror = () => {
					const uploadErrors = [`Failed to upload ${file.name}`];
					setErrors(uploadErrors);
					onChange({ uploadErrors });
				};
				reader.onloadstart = () => setLoadingPercentage(0);
				reader.onprogress = (event) => {
					setLoadingPercentage(Math.floor((100 * event.loaded) / event.total));
				};
				reader.onload = () => {
					if (typeof reader.result !== 'string' || !reader.result || !file) {
						return;
					}
					const base64Data = reader.result.split(',')[1];
					const dataUrl = `data:${file.type};name=${file.name};base64,${base64Data}`;
					if (i === acceptedFiles.length - 1) {
						setLoadingPercentage(undefined);
					}
					if (!multiple) {
						onChange({
							dataUrl,
							uploadedFile: file,
						});
						return;
					}
					// NOTE: JSONSchema array data-url does not expect objects but only strings[]
					// see: https://github.com/rjsf-team/react-jsonschema-form/blob/297dac059fdf64fd1453bebb8366f0602c722f90/packages/utils/src/schema/isFilesArray.ts#L24
					dataUrls.push(dataUrl);
					onChange(dataUrls);
				};
				reader.readAsDataURL(file);
			});
		},
		[onChange, setLoadingPercentage, setErrors, multiple],
	);

	const { acceptedFiles, getRootProps, getInputProps, isDragActive } =
		useDropzone({
			onDrop,
			maxSize,
			accept,
			multiple: !!multiple,
			useFsAccessApi: false,
			noDrag: false,
			disabled: loadingPercentage !== undefined,
		});

	return (
		<>
			{schema.title && <InputLabel>{schema.title}</InputLabel>}
			<Box
				sx={{
					border: (theme) =>
						`dashed 2px ${
							errors.length !== 0
								? '#F19B9E'
								: isDragActive
								? theme.palette.primary.main
								: 'rgba(0, 0, 0, 0.23)'
						}`,
					borderRadius: '2px',
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					justifyContent: 'center',
				}}
				style={{ minHeight: '150px', cursor: 'pointer' }}
				flexDirection="column"
				alignItems="center"
				justifyContent="center"
				{...getRootProps()}
			>
				<input type="file" {...getInputProps()} />
				{loadingPercentage !== undefined && (
					<Box
						sx={{
							position: 'absolute',
							top: 0,
							left: 0,
							width: '100%',
							height: '100%',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							background: 'rgba(255, 255, 255, 0.7)',
						}}
					>
						<CircularProgress
							id="loading-progress"
							variant="determinate"
							value={loadingPercentage}
						/>
					</Box>
				)}

				<Box
					aria-busy={loadingPercentage !== undefined}
					aria-describedby="loading-progress"
					display="flex"
					alignItems="center"
					justifyContent="center"
				>
					{value ? (
						isImage(value) ? (
							<Avatar
								sx={{
									borderRadius: 0,
									height: '100px',
									width: '100px',
									backgroundSize: 'contain',
								}}
								src={dataUrl(value)}
							/>
						) : (
							<FilePresentIcon
								sx={{
									fontSize: 64,
									color: (theme) => theme.palette.grey[500],
								}}
							/>
						)
					) : (
						<UploadFileIcon
							sx={{ fontSize: 64, color: (theme) => theme.palette.grey[500] }}
						/>
					)}
					<Typography ml={2}>Drag and drop or browse files</Typography>
				</Box>
			</Box>

			{errors.length !== 0 && (
				<List sx={{ listStyleType: 'disc' }}>
					{errors.map((err) => (
						<ListItem
							sx={{
								py: 0,
							}}
						>
							<ListItemText
								sx={{
									color: (theme) => theme.palette.error.main,
								}}
							>
								<Typography fontSize="0.75rem">{err}</Typography>
							</ListItemText>
						</ListItem>
					))}
				</List>
			)}
			{acceptedFiles.map((file) => (
				<List sx={{ listStyleType: 'disc' }}>
					<ListItem
						sx={{
							py: 0,
						}}
					>
						<ListItemText sx={{ display: 'list-item' }}>
							<Typography component="span" fontWeight="bold">
								{file.name}
							</Typography>{' '}
							({file.type}, {file.size} bytes)
						</ListItemText>
					</ListItem>
				</List>
			))}
		</>
	);
};
