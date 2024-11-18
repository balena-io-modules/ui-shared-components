import Form from '@rjsf/mui';
import ajvValidator from '@rjsf/validator-ajv8';
import { FormProps as RjsFormProps } from '@rjsf/core';
import { Box, BoxProps, Button, ButtonProps, styled } from '@mui/material';
import { PasswordWidget } from './Widgets/PasswordWidget';
import { SelectWidget } from './Widgets/SelectWidget';
import { FileWidget } from './Widgets/FileWidget';

import { Fragment, forwardRef } from 'react';
import { ObjectFieldTemplate } from './FieldTemplates/ObjectFieldTemplate';
import type { IChangeEvent } from '@rjsf/core';
import type RJSFCoreForm from '@rjsf/core';
import type {
	FieldTemplateProps,
	WidgetProps,
	RJSFValidationError,
	UiSchema,
	FormValidation,
	RJSFSchema,
} from '@rjsf/utils';

import { Templates } from '@rjsf/mui';

const internalWidgets: {
	[k: string]: any;
} = {
	PasswordWidget,
	SelectWidget,
	FileWidget,
};

const FormWrapper = styled('div')({
	// Target the Paper component within the array container
	'& .field-array .MuiPaper-root.MuiPaper-elevation': {
		boxShadow: 'none',
	},
});

export interface RJSFormProps
	extends Omit<RjsFormProps, 'validator' | 'onFocus' | 'onBlur'>,
		Pick<BoxProps, 'sx' | 'onFocus' | 'onBlur' | 'onClick'>,
		Partial<Pick<RjsFormProps, 'validator'>> {
	/** If true, do not display the form submit button */
	hideSubmitButton?: boolean;
	/** Properties that are passed to the submit button, these are the same props used for the [`Button`](#button) component */
	submitButtonProps?: ButtonProps;
	/** If passed, it will show a secondary button, these are the same props used for the [`Button`](#button) component */
	actionButtons?: ButtonProps[];
}

export const RJSForm = forwardRef<
	RJSFCoreForm<any, RJSFSchema, any>,
	RJSFormProps
>(
	(
		{
			hideSubmitButton,
			submitButtonProps,
			actionButtons,
			validator = ajvValidator,
			widgets,
			children,
			sx,
			onFocus,
			onBlur,
			onClick,
			templates,
			...otherProps
		},
		ref,
	) => {
		// paddingY is resolving an outline glitch that is truncated when inside a container.
		return (
			<FormWrapper>
				<Box
					sx={{ paddingY: '1px', ...sx }}
					onFocus={onFocus}
					onBlur={onBlur}
					onClick={onClick}
				>
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

						{actionButtons?.map(({ sx, ...buttonProps }, index) => (
							<Button
								sx={[
									{
										mr:
											index < actionButtons.length || !hideSubmitButton ? 1 : 0,
									},
									...(Array.isArray(sx) ? sx : [sx]),
								]}
								{...buttonProps}
							/>
						))}

						{!hideSubmitButton && (
							<Button
								children={'Submit'}
								{...submitButtonProps}
								color="primary"
								variant="contained"
								type="submit"
							/>
						)}
						{children}
					</Form>
				</Box>
			</FormWrapper>
		);
	},
);

export type {
	IChangeEvent,
	FieldTemplateProps,
	WidgetProps,
	RJSFValidationError,
	UiSchema,
	FormValidation,
};
export { Templates };
