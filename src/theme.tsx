/* eslint-disable @typescript-eslint/no-shadow */
import type {
	PaletteColor,
	PaletteColorOptions,
	TypographyStyle,
} from '@mui/material';
import { createTheme, tableCellClasses } from '@mui/material';
import type {} from '@mui/x-data-grid/themeAugmentation';
import { color, typography, shape, spacing } from '@balena/design-tokens';
import type {
	ColorTokens,
	ShapeTokens,
	SpacingTokens,
	TypographyTokens,
} from '@balena/design-tokens';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
	faCheckCircle,
	faExclamationCircle,
	faInfoCircle,
	faWarning,
	type IconDefinition,
} from '@fortawesome/free-solid-svg-icons';
import type {} from '@mui/material/themeCssVarsAugmentation';

export type Severity = 'info' | 'success' | 'warning' | 'danger';

export const severityIcons: {
	[key in Severity]: IconDefinition;
} = {
	info: faInfoCircle,
	success: faCheckCircle,
	warning: faWarning,
	danger: faExclamationCircle,
};

declare module '@mui/material/styles' {
	interface Palette {
		green: PaletteColor;
		teal: PaletteColor;
		blue: PaletteColor;
		purple: PaletteColor;
		yellow: PaletteColor;
		orange: PaletteColor;
		red: PaletteColor;
	}

	interface PaletteOptions {
		green: PaletteColorOptions;
		teal: PaletteColorOptions;
		blue: PaletteColorOptions;
		purple: PaletteColorOptions;
		yellow: PaletteColorOptions;
		orange: PaletteColorOptions;
		red: PaletteColorOptions;
	}

	interface PaletteColor {
		xlight?: string;
		light: string;
		main: string;
		dark: string;
		contrastText: string;
	}

	interface TypographyVariants {
		bodyLg: TypographyStyle;
		body: TypographyStyle;
		bodySm: TypographyStyle;
		titleLg: TypographyStyle;
		title: TypographyStyle;
		titleSm: TypographyStyle;
		display: TypographyStyle;
		codeLg: TypographyStyle;
		code: TypographyStyle;
		codeSm: TypographyStyle;
	}

	interface TypographyVariantsOptions {
		bodyLg: TypographyStyle | undefined;
		body: TypographyStyle | undefined;
		bodySm: TypographyStyle | undefined;
		titleLg: TypographyStyle | undefined;
		title: TypographyStyle | undefined;
		titleSm: TypographyStyle | undefined;
		display: TypographyStyle | undefined;
		codeLg: TypographyStyle | undefined;
		code: TypographyStyle | undefined;
		codeSm: TypographyStyle | undefined;
	}

	interface TypeText {
		primary: string;
		secondary: string;
		tertiary: string;
		disabled: string;
	}

	interface Theme {
		tokens: {
			color: ColorTokens;
			shape: ShapeTokens;
			spacing: SpacingTokens;
			typography: TypographyTokens;
		};
	}

	interface ThemeOptions {
		tokens: {
			color: ColorTokens;
			shape: ShapeTokens;
			spacing: SpacingTokens;
			typography: TypographyTokens;
		};
	}
}

declare module '@mui/material/Typography' {
	interface TypographyPropsVariantOverrides {
		bodyLg: true;
		body: true;
		bodySm: true;
		titleLg: true;
		title: true;
		titleSm: true;
		display: true;
		codeLg: true;
		code: true;
		codeSm: true;
	}
}
declare module '@mui/material/Avatar' {
	interface AvatarOwnProps {
		size?: 'xl' | 'lg' | 'md' | 'sm';
	}
}
declare module '@mui/material/Button' {
	interface ButtonPropsVariantOverrides {
		light: true;
	}
}
declare module '@mui/material/IconButton' {
	interface IconButtonOwnProps {
		variant?: 'text' | 'contained';
	}
}

declare module '@mui/material/Chip' {
	interface ChipPropsColorOverrides {
		green: true;
		teal: true;
		blue: true;
		purple: true;
		yellow: true;
		orange: true;
		red: true;
	}

	interface ChipPropsVariantOverrides {
		strong: true;
	}
}

declare module '@mui/system' {
	interface Shape {
		xs: number;
		sm: number;
		md: number;
		lg: number;
		full: number;
	}
}

export const theme = createTheme({
	cssVariables: true,
	unstable_sxConfig: {
		borderRadius: {
			themeKey: 'shape',
		},
		fontFamily: {
			themeKey: 'fontFamily',
		},
		fontWeight: {
			themeKey: 'fontWeight',
		},
	},
	tokens: {
		color,
		shape,
		typography,
		spacing,
	},
	typography: {
		fontFamily: typography.fontFamily.body.value,
		h1: {
			fontSize: '2.75rem',
			'@media (min-width:600px)': {
				fontSize: '4.25rem',
			},
			fontWeight: 'bold',
		},
		h2: {
			fontSize: '2.375rem',
			'@media (min-width:600px)': {
				fontSize: '3.125rem',
			},
			fontWeight: '600',
		},
		h3: {
			fontSize: '2rem',
			'@media (min-width:600px)': {
				fontSize: '2.375rem',
			},
			fontWeight: '600',
		},
		h4: {
			fontSize: '1.5rem',
			'@media (min-width:600px)': {
				fontSize: '2.125rem',
			},
			fontWeight: '600',
		},
		h5: {
			fontSize: '1.125rem',
			'@media (min-width:600px)': {
				fontSize: '1.5rem',
			},
		},
		h6: {
			fontSize: '1rem',
			'@media (min-width:600px)': {
				fontSize: '1.125rem',
			},
		},
		body1: {
			fontSize: '1rem',
		},
		body2: {
			fontSize: '0.875rem',
		},
		display: {
			font: typography.display.shorthand.value,
		},
		titleLg: {
			font: typography.title.lg.shorthand.value,
		},
		title: {
			font: typography.title.md.shorthand.value,
		},
		titleSm: {
			font: typography.title.sm.shorthand.value,
		},
		bodyLg: {
			font: typography.body.lg.shorthand.value,
		},
		body: {
			font: typography.body.md.shorthand.value,
		},
		bodySm: {
			font: typography.body.sm.shorthand.value,
		},
		codeLg: {
			font: typography.code.lg.shorthand.value,
		},
		code: {
			font: typography.code.md.shorthand.value,
		},
		codeSm: {
			font: typography.code.sm.shorthand.value,
		},
		overline: {
			color: color.text.subtle.value,
			// Can't use the shorthand token as `overline` is already defined by Mui
			fontFamily: typography.fontFamily.body.value,
			fontWeight: typography.overline.fontWeight.value,
			lineHeight: typography.overline.lineHeight.value,
			fontSize: typography.overline.fontSize.value,
		},
	},
	palette: {
		primary: {
			main: color.palette.blue['600'].value,
		},
		secondary: {
			light: color.palette.neutral['500'].value,
			main: color.palette.neutral['800'].value,
			dark: color.palette.neutral['1000'].value,
			contrastText: color.palette.neutral['50'].value,
		},
		error: {
			main: color.palette.red['500'].value,
			light: color.palette.red['300'].value,
			dark: color.palette.red['700'].value,
		},
		success: {
			main: color.palette.green['500'].value,
			light: color.palette.green['300'].value,
			dark: color.palette.green['700'].value,
		},
		warning: {
			main: color.palette.orange['500'].value,
			light: color.palette.orange['300'].value,
			dark: color.palette.orange['700'].value,
		},
		info: {
			main: color.palette.blue['500'].value,
			light: color.palette.blue['300'].value,
			dark: color.palette.blue['700'].value,
		},
		text: {
			primary: color.text.value,
			secondary: color.text.subtle.value,
			tertiary: color.text.subtlest.value,
		},
		grey: {
			50: color.palette.neutral['50'].value,
			100: color.palette.neutral['100'].value,
			200: color.palette.neutral['200'].value,
			300: color.palette.neutral['300'].value,
			400: color.palette.neutral['400'].value,
			500: color.palette.neutral['500'].value,
			600: color.palette.neutral['600'].value,
			700: color.palette.neutral['700'].value,
			800: color.palette.neutral['800'].value,
			900: color.palette.neutral['900'].value,
		},
		divider: color.border.subtle.value,
		action: {
			active: color.text.subtle.value,
		},
		green: {
			dark: color.palette.green[1000].value,
			main: color.palette.green[500].value,
			light: color.palette.green[50].value,
			contrastText: '#ffffff',
		},
		teal: {
			dark: color.palette.teal[1000].value,
			main: color.palette.teal[500].value,
			light: color.palette.teal[50].value,
			contrastText: '#ffffff',
		},
		blue: {
			dark: color.palette.blue[1000].value,
			main: color.palette.blue[500].value,
			light: color.palette.blue[50].value,
			contrastText: '#ffffff',
		},
		purple: {
			dark: color.palette.purple[1000].value,
			main: color.palette.purple[500].value,
			light: color.palette.purple[50].value,
			contrastText: '#ffffff',
		},
		yellow: {
			dark: color.palette.yellow[1000].value,
			main: color.palette.yellow[500].value,
			light: color.palette.yellow[50].value,
			contrastText: '#ffffff',
		},
		orange: {
			dark: color.palette.orange[1000].value,
			main: color.palette.orange[500].value,
			light: color.palette.orange[50].value,
			contrastText: '#ffffff',
		},
		red: {
			dark: color.palette.red[1000].value,
			main: color.palette.red[500].value,
			light: color.palette.red[50].value,
			contrastText: '#ffffff',
		},
	},
	// FIXME There is a bug in MUI when defining `spacing` as an array and using
	// css variables, so for now we need to specify it manually.
	// See https://github.com/mui/material-ui/issues/45500
	spacing: (factor: number) => {
		// Equivalent of [0, 4, 8, 16, 32, 64, 128], but with negative spacings included
		if (factor >= -6 && factor <= 6) {
			return Math.sign(factor) * 2 ** (Math.abs(factor) + 1);
		}
		return 0;
	},
	shape: {
		xs: shape.borderRadius.xs.value,
		sm: shape.borderRadius.sm.value,
		md: shape.borderRadius.md.value,
		lg: shape.borderRadius.lg.value,
		full: shape.borderRadius.full.value,
	},
	components: {
		MuiAccordionSummary: {
			styleOverrides: {
				root: { paddingLeft: 0, paddingRight: 0 },
			},
		},
		MuiAccordionDetails: {
			styleOverrides: {
				root: { paddingLeft: 0, paddingRight: 0 },
			},
		},
		MuiAlert: {
			defaultProps: {
				iconMapping: {
					info: <FontAwesomeIcon icon={severityIcons.info} />,
					success: <FontAwesomeIcon icon={severityIcons.success} />,
					warning: <FontAwesomeIcon icon={severityIcons.warning} />,
					error: <FontAwesomeIcon icon={severityIcons.danger} />,
				},
			},
			variants: [
				{
					props: { severity: 'info' },
					style: {
						borderColor: color.border.info.value,
						'.MuiAlert-icon': {
							color: color.icon.info.value,
						},
					},
				},
				{
					props: { severity: 'success' },
					style: {
						borderColor: color.border.success.value,
						'.MuiAlert-icon': {
							color: color.icon.success.value,
						},
					},
				},
				{
					props: { severity: 'warning' },
					style: {
						borderColor: color.border.warning.value,
						'.MuiAlert-icon': {
							color: color.icon.warning.value,
						},
					},
				},
				{
					props: { severity: 'error' },
					style: {
						borderColor: color.border.danger.value,
						'.MuiAlert-icon': {
							color: color.icon.danger.value,
						},
					},
				},
				{
					props: { variant: 'standard', severity: 'info' },
					style: {
						backgroundColor: color.bg.info.value,
						color: color.text.info.value,
					},
				},
				{
					props: { variant: 'standard', severity: 'success' },
					style: {
						backgroundColor: color.bg.success.value,
						color: color.text.success.value,
					},
				},
				{
					props: { variant: 'standard', severity: 'warning' },
					style: {
						backgroundColor: color.bg.warning.value,
						color: color.text.warning.value,
					},
				},
				{
					props: { variant: 'standard', severity: 'error' },
					style: {
						backgroundColor: color.bg.danger.value,
						color: color.text.danger.value,
					},
				},
			],
			styleOverrides: {
				root: ({ theme }) => ({
					padding: theme.spacing(3),
					fontSize: '1rem',
					border: 'solid 1px',
					a: {
						color: 'inherit',
						textDecoration: 'underline',
						fontWeight: 'bold',
						'&:hover': {
							color: 'inherit',
							textDecoration: 'none',
						},
					},
					'.MuiPaper-rounded': {
						borderRadius: '10px',
					},
				}),
				message: {
					padding: 0,
				},
				action: ({ theme }) => ({
					marginTop: theme.spacing(-2),
					marginBottom: theme.spacing(-2),
					paddingTop: 0,
				}),
				icon: ({ theme }) => ({
					padding: theme.spacing('3px', 0, 0),
					fontSize: '1rem',
				}),
			},
		},
		MuiAlertTitle: {
			styleOverrides: {
				root: {
					fontWeight: 'bold',
					marginBottom: 0,
				},
			},
		},
		MuiAvatar: {
			defaultProps: { size: 'md' },
			variants: [
				{
					props: { size: 'xl' },
					style: {
						width: 64,
						height: 64,
						fontSize: '32px',
					},
				},
				{
					props: { size: 'lg' },
					style: {
						width: 48,
						height: 48,
						fontSize: '24px',
					},
				},
				{
					props: { size: 'sm' },
					style: {
						width: 24,
						height: 24,
						fontSize: '12px',
					},
				},
			],
			styleOverrides: {
				root: {
					img: {
						objectFit: 'contain',
					},
				},
				colorDefault: {
					backgroundColor: color.bg.subtle.value,
					color: color.text.value,
				},
			},
		},
		MuiDialogTitle: {
			defaultProps: { variant: 'inherit' },
			styleOverrides: {
				root: {
					padding: '24px',
					fontSize: '24px',
				},
			},
		},
		MuiDialogContent: {
			styleOverrides: {
				root: {
					padding: '0px 24px',
					margin: '0px 0px 24px',
				},
			},
		},
		MuiDialogActions: {
			styleOverrides: {
				root: {
					padding: '0px 24px 24px',
					'&.MuiPickersLayout-actionBar': {
						padding: '8px',
					},
				},
			},
		},
		MuiCard: {
			styleOverrides: {
				root: {
					borderRadius: '10px',
					padding: '24px',
					boxShadow: 'none',
					border: `1px solid ${color.border.subtle.value}`,
				},
			},
		},
		MuiCardActionArea: {
			styleOverrides: {
				root: ({ theme }) => ({
					'&:hover': {
						boxShadow: `0 0 0 3px ${theme.vars.palette.primary.light}`, // TODO replace with token
					},
					borderRadius: '10px',
					fontFamily: 'inherit',
				}),
			},
		},
		MuiCardHeader: {
			styleOverrides: {
				root: {
					paddingLeft: 0,
					paddingRight: 0,
					paddingTop: 0,
				},
				avatar: {
					width: '56px',
					height: '56px',
				},
			},
		},
		MuiCardContent: {
			styleOverrides: {
				root: {
					padding: 0,
				},
			},
		},
		MuiCardActions: {
			styleOverrides: {
				root: {
					paddingTop: '24px',
					paddingLeft: 0,
					paddingRight: 0,
					paddingBottom: 0,
				},
			},
		},
		MuiDivider: {
			styleOverrides: {
				root: {
					borderColor: color.border.subtle.value,
				},
			},
		},
		MuiCssBaseline: {
			styleOverrides: `
				a[data-underline="false"] {
					text-decoration: none
				}
			`,
		},
		MuiButton: {
			defaultProps: {
				variant: 'contained',
				disableElevation: true,
			},
			variants: [
				{
					props: { variant: 'light', color: 'primary' },
					style: {
						color: color.text.value,
						backgroundColor: color.bg.accent.value,
						outline: `1px solid ${color.border.accent.value}`,
						outlineOffset: '-1px',
						':hover': {
							backgroundColor: color.palette.blue[100].value,
						},
					},
				},
				{
					props: { variant: 'light', color: 'secondary' },
					style: {
						color: color.text.value,
						backgroundColor: color.bg.value,
						// using `outline` instead of `border`as a hack to display borders inside
						// (thus keeping the same height as the contained variant)
						outline: `1px solid ${color.border.value}`,
						outlineOffset: '-1px',
						':hover': {
							backgroundColor: color.palette.neutral[75].value,
						},
					},
				},
				{
					props: { variant: 'light', color: 'info' },
					style: {
						color: color.text.info.value,
						backgroundColor: color.bg.info.value,
						outline: `1px solid ${color.border.info.value}`,
						outlineOffset: '-1px',
						':hover': {
							backgroundColor: color.palette.blue[100].value,
						},
					},
				},
				{
					props: { variant: 'light', color: 'success' },
					style: {
						color: color.text.success.value,
						backgroundColor: color.bg.success.value,
						outline: `1px solid ${color.border.success.value}`,
						outlineOffset: '-1px',
						':hover': {
							backgroundColor: color.palette.green[100].value,
						},
					},
				},
				{
					props: { variant: 'light', color: 'warning' },
					style: {
						color: color.text.warning.value,
						backgroundColor: color.bg.warning.value,
						outline: `1px solid ${color.border.warning.value}`,
						outlineOffset: '-1px',
						':hover': {
							backgroundColor: color.palette.orange[100].value,
						},
					},
				},
				{
					props: { variant: 'light', color: 'error' },
					style: {
						color: color.text.danger.value,
						backgroundColor: color.bg.danger.value,
						outline: `1px solid ${color.border.danger.value}`,
						outlineOffset: '-1px',
						':hover': {
							backgroundColor: color.palette.red[100].value,
						},
					},
				},
				{
					props: { variant: 'light', disabled: true },
					style: {
						color: `${color.text.value} !important`,
						outline: `1px solid ${color.border.value}`,
						outlineOffset: '-1px',
						backgroundColor: color.bg.value,
						opacity: 0.4,
					},
				},
				{
					props: { variant: 'outlined' },
					style: {
						border: 'none !important',
						outline: '1px solid',
						outlineOffset: '-1px',
					},
				},
				{
					props: { variant: 'outlined', color: 'primary' },
					style: {
						color: color.text.value,
						outlineColor: color.border.accent.value,
						outlineOffset: '-1px',
					},
				},
				{
					props: { variant: 'outlined', color: 'secondary' },
					style: {
						color: color.text.value,
						outlineColor: color.border.value,
					},
				},
				{
					props: { variant: 'outlined', color: 'info' },
					style: {
						color: color.text.info.value,
						outlineColor: color.border.info.value,
					},
				},
				{
					props: { variant: 'outlined', color: 'success' },
					style: {
						color: color.text.success.value,
						outlineColor: color.border.success.value,
					},
				},
				{
					props: { variant: 'outlined', color: 'warning' },
					style: {
						color: color.text.warning.value,
						outlineColor: color.border.warning.value,
					},
				},
				{
					props: { variant: 'outlined', color: 'error' },
					style: {
						color: color.text.danger.value,
						outlineColor: color.border.danger.value,
					},
				},
				{
					props: { variant: 'outlined', disabled: true },
					style: {
						color: `${color.text.value} !important`,
						opacity: 0.4,
					},
				},
			],
			styleOverrides: {
				root: ({ theme }) => ({
					borderRadius: '24px',
					font: typography.body.md.shorthand.value,
					padding: `${theme.spacing(2)} 20px`,
					textTransform: 'none',
				}),
				contained: ({ theme, ownerState }) => ({
					'&.Mui-disabled': {
						opacity: 0.5,
						color: 'white',
						backgroundColor: (
							theme.vars.palette[
								ownerState.color as keyof typeof theme.vars.palette
							] as PaletteColor
						).main,
					},
				}),
				text: {
					padding: 0,
					minWidth: 'none',
					userSelect: 'auto',
					'&:hover,&:focus': {
						background: 'none',
						textDecoration: 'underline',
					},
					'.MuiTouchRipple-root': {
						display: 'none',
					},
				},
				textPrimary: {
					color: color.text.accent.value,
				},
				textSecondary: {
					color: color.text.value,
				},
				textInfo: {
					color: color.text.info.value,
				},
				textSuccess: {
					color: color.text.success.value,
				},
				textWarning: {
					color: color.text.warning.value,
				},
				textError: {
					color: color.text.danger.value,
				},
				containedSecondary: {
					color: color.text.inverse.value,
					backgroundColor: color.bg.strong.value,
				},
				containedInfo: {
					color: color.text.inverse.value,
					backgroundColor: color.bg.info.strong.value,
				},
				containedSuccess: {
					color: color.text.inverse.value,
					backgroundColor: color.bg.success.strong.value,
				},
				containedWarning: {
					color: color.text.inverse.value,
					backgroundColor: color.bg.warning.strong.value,
				},
				containedError: {
					color: color.text.inverse.value,
					backgroundColor: color.bg.danger.strong.value,
				},
				startIcon: {
					' > :nth-of-type(1)': {
						fontSize: '14px',
					},
				},
				endIcon: {
					' > :nth-of-type(1)': {
						fontSize: '14px',
					},
				},
			},
		},
		MuiIconButton: {
			defaultProps: {
				variant: 'text',
			},
			variants: [
				{
					props: { variant: 'contained' },
					style: {
						color: color.icon.inverse.value,
						backgroundColor: color.bg.strong.value,
						'&:hover': {
							backgroundColor: color.bg.strong.value,
						},
					},
				},
				{
					props: { variant: 'contained', color: 'primary' },
					style: {
						backgroundColor: color.bg.accent.strong.value,
						'&:hover': {
							backgroundColor: color.bg.accent.strong.value,
						},
					},
				},
				{
					props: { variant: 'contained', color: 'info' },
					style: {
						backgroundColor: color.bg.info.strong.value,
						'&:hover': {
							backgroundColor: color.bg.info.strong.value,
						},
					},
				},
				{
					props: { variant: 'contained', color: 'success' },
					style: {
						backgroundColor: color.bg.success.strong.value,
						'&:hover': {
							backgroundColor: color.bg.success.strong.value,
						},
					},
				},
				{
					props: { variant: 'contained', color: 'warning' },
					style: {
						backgroundColor: color.bg.warning.strong.value,
						'&:hover': {
							backgroundColor: color.bg.warning.strong.value,
						},
					},
				},
				{
					props: { variant: 'contained', color: 'error' },
					style: {
						backgroundColor: color.bg.danger.strong.value,
						'&:hover': {
							backgroundColor: color.bg.danger.strong.value,
						},
					},
				},
			],
			styleOverrides: {
				root: {
					color: color.icon.value,
					svg: {
						width: '1em',
					},
					'&.Mui-disabled': {
						color: color.icon.value,
						opacity: 0.4,
					},
				},
				colorPrimary: {
					color: color.icon.accent.value,
				},
				colorSuccess: {
					color: color.icon.success.value,
				},
				colorInfo: {
					color: color.icon.info.value,
				},
				colorWarning: {
					color: color.icon.warning.value,
				},
				colorError: {
					color: color.icon.danger.value,
				},
				sizeSmall: {
					padding: '10px',
					fontSize: '12px',
				},
				sizeMedium: {
					padding: '12px',
					fontSize: '14px',
				},
				sizeLarge: {
					padding: '14px',
					fontSize: '16px',
				},
			},
		},
		MuiPaper: {
			styleOverrides: {
				root: ({ theme }) => ({
					// For VirtualizedAutocomplete
					'.MuiAutocomplete-listbox .MuiAutocomplete-option': {
						paddingTop: theme.spacing(3),
						paddingBottom: theme.spacing(3),
					},
				}),
			},
		},
		MuiPopper: {
			styleOverrides: {
				root: ({ theme }) => ({
					'.MuiAutocomplete-listbox': {
						padding: 0,
					},
					'.MuiAutocomplete-option': {
						paddingTop: theme.spacing(3),
						paddingBottom: theme.spacing(3),
						'&:not(:last-of-type)': {
							borderBottom: `1px solid ${color.border.subtle.value}`,
						},
					},
				}),
			},
		},
		MuiPopover: {
			styleOverrides: {
				root: ({ theme }) => ({
					'.MuiMenu-list': {
						paddingTop: 0,
						paddingBottom: 0,

						'> .MuiMenuItem-root:not([data-custom-class="balena_DropDownButton_MenuItem"])':
							{
								paddingTop: theme.spacing(3),
								paddingBottom: theme.spacing(3),
								'&:not(:last-of-type)': {
									borderBottom: `1px solid ${color.border.subtle.value}`,
								},
							},
					},
				}),
			},
		},
		MuiToggleButtonGroup: {
			defaultProps: {
				color: 'secondary',
			},
			styleOverrides: {
				root: {
					border: `1px solid ${color.border.palette.neutral.value} !important`,
					borderRadius: '50px',
					width: 'fit-content',
					gap: '2px',
				},
			},
		},
		MuiToggleButton: {
			defaultProps: {
				disableRipple: true, // needs to be disabled to target with :only-child (see below)
			},
			styleOverrides: {
				root: ({ theme }) => ({
					textTransform: 'none',
					border: `none !important`,
					borderRadius: `${shape.borderRadius.full.value}px !important`,
					font: typography.body.md.shorthand.value,
					gap: theme.spacing(2),
					height: '31px', // Fix height to prevent variations due to different icon sizes
					margin: '2px',
					paddingTop: '5px', // 5px = button padding - margin - border width
					paddingBottom: '5px',
					paddingLeft: theme.spacing(3),
					paddingRight: theme.spacing(3),
					'&:has(> svg:only-child)': {
						// Make sure width is not over 31px when icon only
						// FIXME this also targets buttons that have an icon + some text node.
						//  Text needs to be wrapped in a HTML element to prevent the fixed width.
						minWidth: '31px',
						paddingLeft: theme.spacing(2),
						paddingRight: theme.spacing(2),
						svg: {
							maxWidth: '15px',
						},
					},
					'> svg': {
						fontSize: typography.icon.md.regular.fontSize.value,
					},
					'&:focus-visible': {
						outline: `solid 2px ${color.bg.accent.strong.value}`,
						outlineOffset: '1px',
					},
					'&.MuiToggleButton-primary': {
						color: color.text.value,
						'&.Mui-selected': {
							backgroundColor: color.bg.accent.strong.value,
							color: color.text.inverse.value,
						},
						'&:not(.Mui-selected):hover': {
							backgroundColor: color.bg.accent.value,
						},
					},
					'&.MuiToggleButton-secondary': {
						color: color.text.value,
						'&.Mui-selected': {
							backgroundColor: color.bg.strong.value,
							color: color.text.inverse.value,
						},
						'&:not(.Mui-selected):hover': {
							backgroundColor: color.bg.active.value,
						},
						'&:focus-visible': {
							outlineColor: color.bg.strong.value,
						},
					},
				}),
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					boxShadow: 'none',
				},
			},
		},
		MuiTooltip: {
			defaultProps: {
				arrow: true,
				disableInteractive: true,
			},
			styleOverrides: {
				tooltip: {
					backgroundColor: color.palette.neutral['1000'].value,
					// This is what we have in rendition today
					fontSize: '12px',
				},
				arrow: {
					color: color.palette.neutral['1000'].value,
				},
			},
		},
		MuiTableRow: {
			styleOverrides: {
				root: {
					background: 'white',
					'&:nth-of-type(even)': {
						backgroundColor: color.components.table.row.value,
					},
					'&:hover': {
						backgroundColor: color.bg.accent.value,
					},
					'&.Mui-selected': {
						backgroundColor: color.palette.blue[25].value,
						'&:hover': {
							backgroundColor: color.bg.accent.value,
						},
					},
				},
			},
		},
		MuiTableCell: {
			styleOverrides: {
				root: ({ theme }) => ({
					height: 50,
					fontSize: '1rem',
					borderBottom: 'none',
					[`&.${tableCellClasses.head}`]: {
						backgroundColor: color.components.table.header.value,
						borderBottom: `1px solid ${color.border.value}`,
						fontWeight: 'bold',
					},
					'&:not(.MuiTableCell-paddingNone):not(.MuiTableCell-paddingCheckbox)':
						{
							padding: `14px ${theme.spacing(2)}`,
						},
				}),
			},
		},
		MuiTableBody: {
			styleOverrides: {
				root: {
					background: 'white',
					borderBottom: `1px solid ${color.border.subtle.value}`,
				},
			},
		},
		MuiDataGrid: {
			defaultProps: {
				columnHeaderHeight: 42,
				rowHeight: 50,
				autoHeight: true,
			},
			styleOverrides: {
				root: {
					'--DataGrid-rowBorderColor': color.border.subtle.value,
					'--DataGrid-containerBackground': '#f2f4fa', // TODO use a design token when we get rid of rendition in autoui
					border: 'none',
					fontSize: '1rem',
					'.MuiDataGrid-columnHeaderTitle': {
						fontWeight: 'bold',
					},
					'.MuiDataGrid-columnSeparator': {
						color: color.border.strong.value,
					},
					'.MuiDataGrid-main > *:first-of-type': { borderRadius: 0 },
					'.MuiDataGrid-row': {
						'&:hover': {
							backgroundColor: `${color.bg.accent.value} !important`,
						},
						'&:not(.Mui-selected)': {
							'&:nth-of-type(odd)': {
								backgroundColor: 'white',
							},
							'&:nth-of-type(even)': {
								backgroundColor: color.bg.value,
							},
						},
					},
					'.MuiDataGrid-cell': {
						borderTop: 'none',
					},
					'.MuiDataGrid-columnHeader, .MuiDataGrid-cell:not(.MuiDataGrid-cell--editable)':
						{
							'&:focus,& :focus-within': {
								outline: 'none',
							},
							'&:focus-visible': {
								outline: `1px solid ${color.border.accent.value}`,
							},
						},
					'.MuiDataGrid-bottomContainer': {
						borderBottom: `1px solid ${color.border.subtle.value}`,
					},
				},
			},
		},
		MuiFormControl: {
			defaultProps: {
				variant: 'outlined',
			},
			styleOverrides: {
				root: {
					'.MuiPickersSectionList-root': {
						padding: '13.5px 0',
					},
					'.MuiPickersOutlinedInput-notchedOutline': {
						borderColor: color.border.value,
						'&:hover': {
							borderColor: color.border.strong.value,
						},
					},
				},
			},
		},
		MuiOutlinedInput: {
			defaultProps: {
				notched: false,
			},
			styleOverrides: {
				root: ({ theme }) => ({
					background: 'white',
					legend: {
						// We should be able to remove this but there is a css override somewhere that
						// set the fieldset > legend max-width to 100%, and this invalidate the notched: false rule for some inputs.
						maxWidth: 0,
					},
					fieldset: {
						borderColor: color.border.value,
						'&:hover': {
							borderColor: color.border.strong.value,
						},
					},
					'[type="color"]': {
						padding: theme.spacing(1),
						height: '20px',
					},
				}),
				input: {
					'&:not(.MuiInputBase-inputMultiline)': {
						paddingTop: '14px',
						paddingBottom: '12px',
					},
					'&:-webkit-autofill': {
						'-webkit-box-shadow': `0 0 0 100px ${color.bg.value} inset`,
						'-webkit-text-fill-color': color.text.value,
					},
				},
			},
		},
		MuiInput: {
			styleOverrides: {
				root: {
					'&::before': {
						borderBottom: `1px solid ${color.border.value}`,
					},
					'&::after': {
						borderBottomColor: color.border.accent.value,
					},
					'&:hover:not(.Mui-disabled, .Mui-error)::before': {
						borderBottom: `solid 1px ${color.border.strong.value}`,
					},
				},
			},
		},
		MuiInputLabel: {
			defaultProps: {
				shrink: true,
			},
			styleOverrides: {
				root: {
					fontSize: 12,
					transform: 'none',
					position: 'relative',
					'&:hover': { cursor: 'pointer' },
				},
			},
		},
		MuiFormLabel: {
			defaultProps: {
				focused: false, // Needs that otherwise the color changes when focusing on the control element
			},
			styleOverrides: {
				root: {
					fontSize: 12,
					transform: 'none',
					position: 'relative',
					color: color.text.value,
				},
			},
		},
		MuiAutocomplete: {
			styleOverrides: {
				root: ({ theme }) => ({
					'.MuiOutlinedInput-root .MuiAutocomplete-input': {
						paddingTop: theme.spacing(1),
						paddingBottom: theme.spacing(1),
					},
				}),
			},
		},
		MuiLink: {
			defaultProps: { underline: 'none' },
			styleOverrides: {
				root: {
					color: color.text.accent.value,
					'&:hover': {
						color: color.palette.blue[800].value,
					},
					cursor: 'pointer',
				},
			},
		},
		MuiListItemIcon: {
			styleOverrides: {
				root: {
					minWidth: 'auto',
					marginRight: '.5rem',
				},
			},
		},
		MuiGrid: {
			// We should only apply this spacing to Grid components with `container`
			// But MUI does not currently support that for defaultProps
			// See: https://github.com/mui/material-ui/issues/34812
			defaultProps: { spacing: 2 },
		},
		MuiListItem: {
			styleOverrides: {
				root: { alignItems: 'flex-start' },
			},
		},
		MuiTab: {
			defaultProps: {
				disableRipple: true,
			},
			styleOverrides: {
				root: {
					color: color.text.value,
					textTransform: 'none',
					fontSize: '1rem',
				},
			},
		},
		MuiTabs: {
			styleOverrides: {
				indicator: {
					backgroundColor: color.border.accent.value,
				},
			},
		},
		MuiLinearProgress: {
			styleOverrides: {
				root: {
					borderRadius: shape.borderRadius.sm.value,
					backgroundColor: color.bg.subtle.value,
				},
			},
		},
		MuiCheckbox: {
			defaultProps: {
				icon: (
					<svg
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect
							x="0.5"
							y="0.5"
							width="19"
							height="19"
							rx="3.5"
							fill="white"
							stroke="currentColor"
						/>
					</svg>
				),
				checkedIcon: (
					<svg
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect width="20" height="20" rx="4" />
						<path
							d="M15.2832 6.22852C15.5879 6.50977 15.5879 7.00195 15.2832 7.2832L9.2832 13.2832C9.00195 13.5879 8.50977 13.5879 8.22852 13.2832L5.22852 10.2832C4.92383 10.002 4.92383 9.50977 5.22852 9.22852C5.50977 8.92383 6.00195 8.92383 6.2832 9.22852L8.74414 11.6895L14.2285 6.22852C14.5098 5.92383 15.002 5.92383 15.2832 6.22852Z"
							fill="white"
						/>
					</svg>
				),
				indeterminateIcon: (
					<svg
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="currentColor"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect width="20" height="20" rx="4" />
						<rect x="5" y="9" width="10" height="2" fill="white" />
					</svg>
				),
			},
			styleOverrides: {
				root: {
					color: color.border.strong.value,
					'&.Mui-disabled': {
						opacity: 0.3,
					},
					'&.Mui-checked': {
						color: color.bg.accent.strong.value,
					},
					'&.MuiCheckbox-indeterminate': {
						color: color.bg.accent.strong.value,
					},
				},
				sizeSmall: {
					svg: {
						width: 16,
						height: 16,
					},
				},
			},
		},
		MuiRadio: {
			defaultProps: {
				icon: (
					<svg
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle
							cx="10"
							cy="10"
							r="9.5"
							fill="white"
							stroke="currentColor"
						/>
					</svg>
				),
				checkedIcon: (
					<svg
						width="20"
						height="20"
						viewBox="0 0 20 20"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<circle
							cx="10"
							cy="10"
							r="9.5"
							fill="white"
							stroke="currentColor"
						/>
						<circle cx="10" cy="10" r="4" fill="currentColor" />
					</svg>
				),
			},
			styleOverrides: {
				root: {
					color: color.border.strong.value,
					'&.Mui-disabled': {
						opacity: 0.3,
						color: color.border.strong.value,
					},
				},
			},
		},
		MuiFormControlLabel: {
			styleOverrides: {
				root: {
					color: color.text.value,
				},
			},
		},
		MuiFormHelperText: {
			styleOverrides: {
				root: {
					color: color.text.subtle.value,
					fontSize: 12,
					marginLeft: 0,
				},
			},
		},
		MuiSwitch: {
			styleOverrides: {
				root: {
					width: 34,
					height: 20,
					padding: 0,
					margin: '4px 4px 4px 9px',
					'& .MuiSwitch-switchBase': {
						padding: 0,
						margin: 3,
						transitionDuration: '200ms',
						'&.Mui-checked': {
							transform: 'translateX(14px)',
							color: 'white',
							'& + .MuiSwitch-track': {
								backgroundColor: color.bg.accent.strong.value,
								opacity: 1,
								border: 0,
							},
							'&.Mui-disabled + .MuiSwitch-track': {
								opacity: 0.5,
							},
						},
						'&.Mui-focusVisible .MuiSwitch-thumb': {
							color: color.bg.accent.strong.value,
							border: '4px solid white',
						},
						'&.Mui-disabled .MuiSwitch-thumb': {
							color: 'white',
						},
						'&.Mui-disabled + .MuiSwitch-track': {
							opacity: 0.5,
						},
					},
					'& .MuiSwitch-thumb': {
						boxSizing: 'border-box',
						boxShadow: '0px 0px 4px 0px rgba(0,0,0,0.1)',
						width: 14,
						height: 14,
					},
					'& .MuiSwitch-track': {
						borderRadius: 20 / 2,
						backgroundColor: color.palette.neutral[100].value,
						opacity: 1,
						transition: `200ms background-color ease-out`,
					},
				},
			},
		},
		MuiBackdrop: {
			styleOverrides: {
				root: {
					background: color.bg.overlay.dark.value,
				},
				invisible: { background: 'unset' },
			},
		},
		MuiChip: {
			styleOverrides: {
				root: {
					font: typography.components.badge.shorthand.value,
					textTransform: 'uppercase',
					height: '20px',
					'&.MuiChip-colorDefault': {
						color: color.text.palette.neutral.value,
						backgroundColor: color.bg.palette.neutral.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.palette.neutral.strong.value,
						},
					},
					'&.MuiChip-colorPrimary': {
						color: color.text.accent.value,
						backgroundColor: color.bg.accent.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.accent.strong.value,
						},
					},
					'&.MuiChip-colorSecondary': {
						color: color.text.value,
						backgroundColor: color.bg.subtle.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.strong.value,
						},
					},
					'&.MuiChip-colorInfo': {
						color: color.text.info.value,
						backgroundColor: color.bg.info.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.info.strong.value,
						},
					},
					'&.MuiChip-colorSuccess': {
						color: color.text.success.value,
						backgroundColor: color.bg.success.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.success.strong.value,
						},
					},
					'&.MuiChip-colorWarning': {
						color: color.text.warning.value,
						backgroundColor: color.bg.warning.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.warning.strong.value,
						},
					},
					'&.MuiChip-colorError': {
						color: color.text.danger.value,
						backgroundColor: color.bg.danger.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.danger.strong.value,
						},
					},
					'&.MuiChip-colorGreen': {
						color: color.text.palette.green.value,
						backgroundColor: color.bg.palette.green.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.palette.green.strong.value,
						},
					},
					'&.MuiChip-colorTeal': {
						color: color.text.palette.teal.value,
						backgroundColor: color.bg.palette.teal.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.palette.teal.strong.value,
						},
					},
					'&.MuiChip-colorBlue': {
						color: color.text.palette.blue.value,
						backgroundColor: color.bg.palette.blue.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.palette.blue.strong.value,
						},
					},
					'&.MuiChip-colorPurple': {
						color: color.text.palette.purple.value,
						backgroundColor: color.bg.palette.purple.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.palette.purple.strong.value,
						},
					},
					'&.MuiChip-colorYellow': {
						color: color.text.palette.yellow.value,
						backgroundColor: color.bg.palette.yellow.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.palette.yellow.strong.value,
						},
					},
					'&.MuiChip-colorOrange': {
						color: color.text.palette.orange.value,
						backgroundColor: color.bg.palette.orange.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.palette.orange.strong.value,
						},
					},
					'&.MuiChip-colorRed': {
						color: color.text.palette.red.value,
						backgroundColor: color.bg.palette.red.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.palette.red.strong.value,
						},
					},
					'&.MuiChip-strongDefault': {
						color: color.text.inverse.value,
						backgroundColor: color.bg.palette.neutral.strong.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.palette.neutral.value,
						},
					},
					'&.MuiChip-strongPrimary': {
						color: color.text.inverse.value,
						backgroundColor: color.bg.accent.strong.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.accent.value,
						},
					},
					'&.MuiChip-strongSecondary': {
						color: color.text.inverse.value,
						backgroundColor: color.bg.strong.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.value,
						},
					},
					'&.MuiChip-strongInfo': {
						color: color.text.inverse.value,
						backgroundColor: color.bg.info.strong.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.info.value,
						},
					},
					'&.MuiChip-strongSuccess': {
						color: color.text.inverse.value,
						backgroundColor: color.bg.success.strong.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.success.value,
						},
					},
					'&.MuiChip-strongWarning': {
						color: color.text.inverse.value,
						backgroundColor: color.bg.warning.strong.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.warning.value,
						},
					},
					'&.MuiChip-strongError': {
						color: color.text.inverse.value,
						backgroundColor: color.bg.danger.strong.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.danger.value,
						},
					},
					'&.MuiChip-strongGreen': {
						color: color.text.inverse.value,
						backgroundColor: color.bg.palette.green.strong.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.palette.green.value,
						},
					},
					'&.MuiChip-strongTeal': {
						color: color.text.inverse.value,
						backgroundColor: color.bg.palette.teal.strong.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.palette.teal.value,
						},
					},
					'&.MuiChip-strongBlue': {
						color: color.text.inverse.value,
						backgroundColor: color.bg.palette.blue.strong.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.palette.blue.value,
						},
					},
					'&.MuiChip-strongPurple': {
						color: color.text.inverse.value,
						backgroundColor: color.bg.palette.purple.strong.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.palette.purple.value,
						},
					},
					'&.MuiChip-strongYellow': {
						color: color.text.inverse.value,
						backgroundColor: color.bg.palette.yellow.strong.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.palette.yellow.value,
						},
					},
					'&.MuiChip-strongOrange': {
						color: color.text.inverse.value,
						backgroundColor: color.bg.palette.orange.strong.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.palette.orange.value,
						},
					},
					'&.MuiChip-strongRed': {
						color: color.text.inverse.value,
						backgroundColor: color.bg.palette.red.strong.value,
						'.MuiChip-deleteIcon': {
							color: color.bg.palette.red.value,
						},
					},
					'&.MuiChip-outlinedDefault': {
						borderColor: color.border.palette.neutral.value,
					},
					'&.MuiChip-outlinedPrimary': {
						borderColor: color.border.accent.value,
					},
					'&.MuiChip-outlinedSecondary': {
						borderColor: color.border.value,
					},
					'&.MuiChip-outlinedInfo': {
						borderColor: color.border.info.value,
					},
					'&.MuiChip-outlinedSuccess': {
						borderColor: color.border.success.value,
					},
					'&.MuiChip-outlinedWarning': {
						borderColor: color.border.warning.value,
					},
					'&.MuiChip-outlinedError': {
						borderColor: color.border.danger.value,
					},
					'&.MuiChip-outlinedGreen': {
						borderColor: color.border.palette.green.value,
					},
					'&.MuiChip-outlinedTeal': {
						borderColor: color.border.palette.teal.value,
					},
					'&.MuiChip-outlinedBlue': {
						borderColor: color.border.palette.blue.value,
					},
					'&.MuiChip-outlinedPurple': {
						borderColor: color.border.palette.purple.value,
					},
					'&.MuiChip-outlinedYellow': {
						borderColor: color.border.palette.yellow.value,
					},
					'&.MuiChip-outlinedOrange': {
						borderColor: color.border.palette.orange.value,
					},
					'&.MuiChip-outlinedRed': {
						borderColor: color.border.palette.red.value,
					},
				},
				deleteIcon: {
					fontSize: '16px',
					marginRight: '2px',
					marginLeft: '-8px',
					'&:hover, &:focus': {
						opacity: 0.8,
					},
					'&:active': {
						opacity: 1,
					},
				},
				icon: ({ theme }) => ({
					marginLeft: theme.spacing(2),
				}),
				label: ({ theme }) => ({
					padding: `${theme.spacing(1)} 12px`,
				}),
			},
		},
		MuiTypography: {
			defaultProps: {
				variant: 'body',
				variantMapping: {
					titleLg: 'h2',
					title: 'h3',
					titleSm: 'h4',
				},
			},
			styleOverrides: {
				gutterBottom: ({ theme }) => ({
					marginBottom: theme.spacing(3),
				}),
			},
		},
		MuiMenuItem: {
			styleOverrides: {
				root: {
					'&.Mui-selected': {
						background: color.bg.active.value,
						'&:hover': {
							background: color.bg.active.value,
						},
					},
					'&:hover': {
						background: color.bg.hover.value,
					},
				},
			},
		},
		MuiToolbar: {
			styleOverrides: {
				root: {
					minHeight: 'inherit !important',
				},
			},
		},
		MuiSnackbar: {
			styleOverrides: {
				anchorOriginBottomRight: ({ theme }) => ({
					[theme.breakpoints.up('sm')]: {
						// Make room for the 'need help' button
						// TODO add a theme.spacing entry between 32 and 64
						right: 48,
					},
				}),
			},
		},
		MuiTableSortLabel: {
			styleOverrides: {
				root: {
					'&.Mui-active .MuiTableSortLabel-icon': {
						color: color.icon.accent.value,
					},
				},
				icon: {
					color: color.icon.value,
					fontSize: '16px',
				},
			},
		},
		MuiTablePagination: {
			styleOverrides: {
				actions: ({ theme }) => ({
					marginLeft: theme.spacing(2),
				}),
				input: ({ theme }) => ({
					marginLeft: theme.spacing(1),
					marginRight: theme.spacing(2),
				}),
			},
		},
	},
});

export type Theme = typeof theme;
