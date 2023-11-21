import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import {
	FieldTemplateProps,
	FormContextType,
	RJSFSchema,
	StrictRJSFSchema,
	getTemplate,
	getUiOptions,
} from '@rjsf/utils';

export const FieldTemplate = <
	T = any,
	S extends StrictRJSFSchema = RJSFSchema,
	F extends FormContextType = any,
>(
	props: FieldTemplateProps<T, S, F>,
) => {
	const {
		id,
		children,
		classNames,
		style,
		disabled,
		displayLabel,
		hidden,
		label,
		onDropPropertyClick,
		onKeyChange,
		readonly,
		required,
		rawErrors = [],
		errors,
		help,
		description,
		rawDescription,
		schema,
		uiSchema,
		registry,
	} = props;
	const uiOptions = getUiOptions<T, S, F>(uiSchema);
	const WrapIfAdditionalTemplate = getTemplate<
		'WrapIfAdditionalTemplate',
		T,
		S,
		F
	>('WrapIfAdditionalTemplate', registry, uiOptions);

	if (hidden) {
		return <div style={{ display: 'none' }}>{children}</div>;
	}
	return (
		<WrapIfAdditionalTemplate
			classNames={classNames}
			style={style}
			disabled={disabled}
			id={id}
			label={label}
			onDropPropertyClick={onDropPropertyClick}
			onKeyChange={onKeyChange}
			readonly={readonly}
			required={required}
			schema={schema}
			uiSchema={uiSchema}
			registry={registry}
		>
			{displayLabel && rawDescription ? (
				<Typography variant="caption" color="textSecondary">
					{description}
				</Typography>
			) : null}
			<FormControl
				fullWidth={true}
				error={rawErrors.length ? true : false}
				required={required}
			>
				{children}
				{errors}
				{help}
			</FormControl>
		</WrapIfAdditionalTemplate>
	);
};
