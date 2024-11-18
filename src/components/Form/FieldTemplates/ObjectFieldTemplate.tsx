import Grid from '@mui/material/Grid';
import type {
	FormContextType,
	ObjectFieldTemplateProps,
	RJSFSchema,
	StrictRJSFSchema,
} from '@rjsf/utils';
import {
	canExpand,
	descriptionId,
	getTemplate,
	getUiOptions,
	titleId,
} from '@rjsf/utils';

export const ObjectFieldTemplate = <
	T = any,
	S extends StrictRJSFSchema = RJSFSchema,
	F extends FormContextType = any,
>(
	props: ObjectFieldTemplateProps<T, S, F>,
) => {
	const {
		description,
		title,
		properties,
		required,
		disabled,
		readonly,
		uiSchema,
		idSchema,
		schema,
		formData,
		onAddClick,
		registry,
	} = props;
	const uiOptions = getUiOptions<T, S, F>(uiSchema);
	const TitleFieldTemplate = getTemplate<'TitleFieldTemplate', T, S, F>(
		'TitleFieldTemplate',
		registry,
		uiOptions,
	);
	const DescriptionFieldTemplate = getTemplate<
		'DescriptionFieldTemplate',
		T,
		S,
		F
	>('DescriptionFieldTemplate', registry, uiOptions);
	const {
		ButtonTemplates: { AddButton },
	} = registry.templates;

	return (
		<>
			{title && (
				<TitleFieldTemplate
					id={titleId<T>(idSchema)}
					title={title}
					required={required}
					schema={schema}
					uiSchema={uiSchema}
					registry={registry}
				/>
			)}
			{description && (
				<DescriptionFieldTemplate
					id={descriptionId<T>(idSchema)}
					description={description}
					schema={schema}
					uiSchema={uiSchema}
					registry={registry}
				/>
			)}
			<Grid
				container
				spacing={2}
				style={{ marginTop: '10px' }}
				{...(uiSchema?.['ui:grid']?.container ?? {})}
			>
				{properties.map((element, index) =>
					element.hidden ? (
						element.content
					) : (
						<Grid
							item
							xs={12}
							key={index}
							sx={{ marginBottom: '10px' }}
							{...(uiSchema?.[element.name]?.['ui:grid']?.item ??
								uiSchema?.['ui:grid']?.[element.name] ??
								uiSchema?.['ui:grid']?.item ??
								{})}
						>
							{element.content}
						</Grid>
					),
				)}
				{canExpand<T, S, F>(schema, uiSchema, formData) && (
					<Grid container justifyContent="flex-end">
						<Grid item={true}>
							<AddButton
								className="object-property-expand"
								onClick={onAddClick(schema)}
								// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- If `disabled` is false, we still want to disable the button if `readonly` is true
								disabled={disabled || readonly}
								uiSchema={uiSchema}
								registry={registry}
							/>
						</Grid>
					</Grid>
				)}
			</Grid>
		</>
	);
};
