import UploadFileIcon from '@mui/icons-material/UploadFile';
import FilePresentIcon from '@mui/icons-material/FilePresent';
import * as React from 'react';
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
import { Input } from '@mui/base/Input';
import type { WidgetProps } from '@rjsf/utils';

export interface OnFileReadSuccessParams {
	dataUrl: string;
	uploadedFile: File;
}

type FileWidgetProps = WidgetProps & {
	onChange: (params?: OnFileReadSuccessParams) => void;
	value?: OnFileReadSuccessParams | string;
};

export const FileWidget = ({ onChange, value, ...props }: FileWidgetProps) => {
	const { schema, uiSchema } = props;

	const [loadingPercentage, setLoadingPercentage] = React.useState<
		number | undefined
	>(undefined);
	const [errors, setErrors] = React.useState<string[]>([]);

	const accept = uiSchema?.['ui:options']?.accept as Accept | undefined;
	const maxSize = uiSchema?.['ui:options']?.maxSize as number | undefined;

	const dataUrl = (dataUrlValue: OnFileReadSuccessParams | string) => {
		return typeof dataUrlValue === 'string'
			? dataUrlValue
			: dataUrlValue.dataUrl;
	};

	const isImage = (value: OnFileReadSuccessParams | string) => {
		return dataUrl(value).startsWith('data:image/');
	};

	const onDrop = React.useCallback(
		((acceptedFiles, fileRejections) => {
			setErrors([]);

			if (fileRejections != null && fileRejections.length > 0) {
				const errs = fileRejections[0].errors.map(
					({ message }) => `${fileRejections[0].file.name}: ${message}`,
				);
				setErrors(errs);
				return onChange();
			}

			acceptedFiles.forEach((file) => {
				const reader = new FileReader();
				reader.onerror = () => {
					const err = [`Failed to upload ${file.name}`];
					onChange();
					setErrors(err);
				};
				reader.onloadstart = () => setLoadingPercentage(0);
				reader.onprogress = (event) => {
					setLoadingPercentage(Math.floor((100 * event.loaded) / event.total));
				};
				reader.onload = () => {
					if (file != null && reader.result != null) {
						setLoadingPercentage(undefined);
						onChange({
							dataUrl: reader.result as string,
							uploadedFile: file,
						});
					}
				};

				reader.readAsDataURL(file);
			});
		}) as NonNullable<DropzoneOptions['onDrop']>,
		[],
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		maxSize,
		accept,
		multiple: false,
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
				<Input {...getInputProps()} />
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
					<Box>
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
					</Box>
					<Box>
						<Typography>
							<Typography variant="inherit">Drag and drop or</Typography>{' '}
							<Typography variant="inherit">browse files</Typography>
						</Typography>
					</Box>
				</Box>
			</Box>

			{errors.length !== 0 && (
				<List>
					{errors.map((err) => (
						<ListItem>
							<ListItemText
								sx={{ m: -2, color: (theme) => theme.palette.error.main }}
							>
								{err}
							</ListItemText>
						</ListItem>
					))}
				</List>
			)}
			{value && typeof value !== 'string' && (
				<List>
					<ListItem>
						<ListItemText sx={{ m: -2 }}>
							<Typography component="span" fontWeight="bold">
								{value.uploadedFile.name}
							</Typography>{' '}
							({value.uploadedFile.type}, {value.uploadedFile.size} bytes)
						</ListItemText>
					</ListItem>
				</List>
			)}
		</>
	);
};
