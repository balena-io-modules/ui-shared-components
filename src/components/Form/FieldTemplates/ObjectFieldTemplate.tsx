import { Grid } from '@mui/material';
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
		fieldPathId,
		schema,
		formData,
		optionalDataControl,
		onAddProperty,
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
	const showOptionalDataControlInTitle = !readonly && !disabled;
	const {
		ButtonTemplates: { AddButton },
	} = registry.templates;
	return (
		<>
			{title && (
				<TitleFieldTemplate
					id={titleId(fieldPathId)}
					title={title}
					required={required}
					schema={schema}
					uiSchema={uiSchema}
					registry={registry}
					optionalDataControl={
						showOptionalDataControlInTitle ? optionalDataControl : undefined
					}
				/>
			)}
			{description && (
				<DescriptionFieldTemplate
					id={descriptionId(fieldPathId)}
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
				{!showOptionalDataControlInTitle ? optionalDataControl : undefined}
				{properties.map((element, index) =>
					// Remove the <Grid> if the inner element is hidden as the <Grid>
					// itself would otherwise still take up space.
					element.hidden ? (
						element.content
					) : (
						<Grid
							size={{ xs: 12 }}
							// TODO: remove as soon as MUI versions are same between RJSF and our internal.
							width="100%"
							key={index}
							style={{ marginBottom: '10px' }}
							{...(uiSchema?.[element.name]?.['ui:grid']?.item ??
								uiSchema?.['ui:grid']?.[element.name] ??
								uiSchema?.['ui:grid']?.item ??
								{})}
						>
							{element.content}
						</Grid>
					),
				)}
			</Grid>
			{canExpand<T, S, F>(schema, uiSchema, formData) && (
				<Grid container justifyContent="flex-end">
					<Grid>
						<AddButton
							id={fieldPathId.$id + 'add'}
							className="rjsf-object-property-expand"
							onClick={onAddProperty}
							// eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- If `disabled` is false, we still want to disable the button if `readonly` is true
							disabled={disabled || readonly}
							uiSchema={uiSchema}
							registry={registry}
						/>
					</Grid>
				</Grid>
			)}
		</>
	);
};
