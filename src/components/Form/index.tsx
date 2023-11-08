import Form from '@rjsf/mui';
import ajvValidator from '@rjsf/validator-ajv8';
import { FormProps as RjsFormProps } from '@rjsf/core';
import { Box, BoxProps, Button, ButtonProps } from '@mui/material';
import { PasswordWidget } from './Widgets/PasswordWidget';
import { SelectWidget } from './Widgets/SelectWidget';
import { FileWidget } from './Widgets/FileWidget';
import { Fragment } from 'react';
import { ObjectFieldTemplate } from './FieldTemplates/ObjectFieldTemplate';
import { IChangeEvent } from '@rjsf/core';
import {
	FieldTemplateProps,
	WidgetProps,
	RJSFValidationError,
	UiSchema,
	FormValidation,
} from '@rjsf/utils';
export type {
	IChangeEvent,
	FieldTemplateProps,
	WidgetProps,
	RJSFValidationError,
	UiSchema,
	FormValidation,
};

const internalWidgets: {
	[k: string]: any;
} = {
	PasswordWidget,
	SelectWidget,
	FileWidget,
};

export interface RJSFormProps
	extends Omit<RjsFormProps, 'validator' | 'onFocus' | 'onBlur'>,
		Pick<BoxProps, 'sx' | 'onFocus' | 'onBlur'>,
		Partial<Pick<RjsFormProps, 'validator'>> {
	/** If true, do not display the form submit button */
	hideSubmitButton?: boolean;
	/** Properties that are passed to the submit button, these are the same props used for the [`Button`](#button) component */
	submitButtonProps?: ButtonProps;
	/** If passed, it will show a secondary button, these are the same props used for the [`Button`](#button) component */
	actionButtons?: ButtonProps[];
}

export const RJSForm: React.FC<React.PropsWithChildren<RJSFormProps>> = ({
	hideSubmitButton,
	submitButtonProps,
	actionButtons,
	validator = ajvValidator,
	widgets,
	children,
	ref,
	sx,
	onFocus,
	onBlur,
	templates,
	...otherProps
}) => {
	// paddingY is resolving an outline glitch that is truncated when inside a container.
	return (
		<Box sx={{ paddingY: '1px', ...sx }} onFocus={onFocus} onBlur={onBlur}>
			<Form
				ref={ref}
				validator={validator}
				showErrorList={false}
				widgets={{ ...internalWidgets, ...(widgets || {}) }}
				templates={{ ObjectFieldTemplate, ...templates }}
				{...otherProps}
			>
				{/* RJSF need a child to not show the submit button https://github.com/rjsf-team/react-jsonschema-form/issues/1602  */}
				{hideSubmitButton && <Fragment />}

				{actionButtons?.map((buttonProps) => (
					<Button {...buttonProps} />
				))}

				{!hideSubmitButton && (
					<Button
						children={'Submit'}
						// TODO: remove once we migrate buttons
						disableRipple
						{...submitButtonProps}
						color="customBlue"
						variant="contained"
						type="submit"
					/>
				)}
				{children}
			</Form>
		</Box>
	);
};
