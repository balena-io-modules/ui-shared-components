import {
	PaletteColor,
	PaletteColorOptions,
	TypographyStyle,
	createTheme,
} from '@mui/material';
import { TypographyStyleOptions } from '@mui/material/styles/createTypography';
import { color } from '@balena/design-tokens';

type CustomPaletteColor = PaletteColor & { xlight: string };
type CustomPaletteColorOptions = PaletteColorOptions & { xlight: string };

declare module '@mui/material/styles' {
	interface Palette {
		customBlue: CustomPaletteColor;
		customYellow: CustomPaletteColor;
		customGreen: CustomPaletteColor;
		customPurple: CustomPaletteColor;
		customGrey: CustomPaletteColor;
	}
	interface PaletteOptions {
		customBlue: CustomPaletteColorOptions;
		customYellow: CustomPaletteColorOptions;
		customGreen: CustomPaletteColorOptions;
		customPurple: CustomPaletteColorOptions;
		customGrey: CustomPaletteColorOptions;
	}
	interface PaletteColor {
		xlight?: string;
		light: string;
		main: string;
		dark: string;
		contrastText: string;
	}
	interface TypographyVariants {
		bodyLarge: TypographyStyle;
		smallText: TypographyStyle;
		link: TypographyStyle;
	}

	interface TypographyVariantsOptions {
		bodyLarge: TypographyStyleOptions | undefined;
		smallText: TypographyStyleOptions | undefined;
		link: TypographyStyleOptions | undefined;
	}

	interface TypeText {
		primary: string;
		secondary: string;
		tertiary: string;
		disabled: string;
	}
}
declare module '@mui/material/Typography' {
	interface TypographyPropsVariantOverrides {
		bodyLarge: true;
		smallText: true;
		link: true;
	}
}

declare module '@mui/material/Button' {
	interface ButtonPropsColorOverrides {
		customBlue: true;
		customYellow: true;
		customGreen: true;
		customPurple: true;
		customGrey: true;
	}

	interface ButtonPropsVariantOverrides {
		light: true;
	}
}
declare module '@mui/material/ButtonGroup' {
	interface ButtonGroupPropsColorOverrides {
		customBlue: true;
		customYellow: true;
		customGreen: true;
		customPurple: true;
		customGrey: true;
	}
}
declare module '@mui/material/Badge' {
	interface BadgePropsColorOverrides {
		customBlue: true;
		customYellow: true;
		customGreen: true;
		customPurple: true;
		customGrey: true;
	}
}

declare module '@mui/material/Chip' {
	interface ChipPropsColorOverrides {
		customBlue: true;
		customYellow: true;
		customGreen: true;
		customPurple: true;
		customGrey: true;
	}
}
declare module '@mui/material/Icon' {
	interface IconPropsColorOverrides {
		customBlue: true;
		customYellow: true;
		customGreen: true;
		customPurple: true;
		customGrey: true;
	}
}
declare module '@mui/material/IconButton' {
	interface IconButtonPropsColorOverrides {
		customBlue: true;
		customYellow: true;
		customGreen: true;
		customPurple: true;
		customGrey: true;
	}
}
declare module '@mui/material/Tab' {
	interface TabPropsColorOverrides {
		customBlue: true;
		customYellow: true;
		customGreen: true;
		customPurple: true;
		customGrey: true;
	}
}
declare module '@mui/material/TextField' {
	interface TextFieldPropsColorOverrides {
		customBlue: true;
		customYellow: true;
		customGreen: true;
		customPurple: true;
		customGrey: true;
	}
}
declare module '@mui/material/SvgIcon' {
	interface SvgIconPropsColorOverrides {
		customBlue: true;
		customYellow: true;
		customGreen: true;
		customPurple: true;
		customGrey: true;
	}
}

export const theme = createTheme({
	typography: {
		fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
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
		bodyLarge: {
			fontSize: '1.125rem',
			'@media (min-width:600px)': {
				fontSize: '1.25rem',
			},
		},
		body1: {
			fontSize: '1rem',
		},
		body2: {
			fontSize: '0.875rem',
		},
		smallText: {
			fontSize: '12px',
		},
		link: {
			fontSize: '13px',
			color: color.text.accent.value,
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
		customBlue: {
			xlight: color.palette.blue['50'].value,
			light: color.palette.blue['75'].value,
			main: color.palette.blue['500'].value,
			dark: color.palette.blue['1000'].value,
			contrastText: '#FFFFFF',
		},
		customYellow: {
			xlight: color.palette.yellow['700'].value,
			main: color.palette.yellow['200'].value,
			contrastText: '#FFFFFF',
		},
		customGreen: {
			xlight: color.palette.teal['50'].value,
		},
		customPurple: {
			main: color.palette.purple['900'].value,
			xlight: color.palette.purple['50'].value,
		},
		customGrey: {
			xlight: color.palette.neutral['50'].value,
			light: color.palette.neutral['500'].value,
			main: color.palette.neutral['900'].value,
			dark: color.palette.neutral['1000'].value,
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
		background: {
			default: color.bg.value,
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
	},
	spacing: [0, 4, 8, 16, 32, 64, 128],
	components: {
		MuiAlert: {
			styleOverrides: {
				root: {
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
				},
				standardInfo: {
					borderColor: color.border.info.value,
					backgroundColor: color.bg.info.value,
					color: color.text.info.value,
				},
				standardSuccess: {
					borderColor: color.border.success.value,
					backgroundColor: color.bg.success.value,
					color: color.text.success.value,
				},
				standardWarning: {
					borderColor: color.border.warning.value,
					backgroundColor: color.bg.warning.value,
					color: color.text.warning.value,
				},
				standardError: {
					borderColor: color.border.danger.value,
					backgroundColor: color.bg.danger.value,
					color: color.text.danger.value,
				},
				action: {
					paddingTop: 0,
				},
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
			styleOverrides: {
				root: {
					img: {
						objectFit: 'contain',
					},
				},
			},
		},
		MuiDialogTitle: {
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
						boxShadow: `0 0 0 3px ${theme.palette.primary.light}`,
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
						border: `1px solid ${color.border.accent.value}`,
						':hover': {
							backgroundColor: color.palette.blue[100].value,
						},
					},
				},
				{
					props: { variant: 'light', color: 'secondary' },
					style: {
						color: color.text.value,
						backgroundColor: color.bg.subtle.value,
						border: `1px solid ${color.border.value}`,
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
						border: `1px solid ${color.border.info.value}`,
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
						border: `1px solid ${color.border.success.value}`,
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
						border: `1px solid ${color.border.warning.value}`,
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
						border: `1px solid ${color.border.danger.value}`,
						':hover': {
							backgroundColor: color.palette.red[100].value,
						},
					},
				},
				{
					props: { variant: 'light', disabled: true },
					style: {
						color: `${color.text.value} !important`,
						border: `1px solid ${color.border.value}`,
						backgroundColor: color.bg.value,
						opacity: 0.4,
					},
				},
			],
			styleOverrides: {
				root: ({ theme, ownerState }) => ({
					borderRadius: '24px',
					paddingLeft: '20px',
					paddingRight: '20px',
					fontSize: theme.typography.body1.fontSize,
					textTransform: 'none',
				}),
				contained: ({ theme, ownerState }) => ({
					'&.Mui-disabled': {
						opacity: 0.5,
						color: 'white',
						backgroundColor: (
							theme.palette[
								ownerState.color as keyof typeof theme.palette
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
				outlinedPrimary: {
					borderColor: color.border.accent.value,
					color: color.text.value,
				},
				outlinedSecondary: {
					color: color.text.value,
					borderColor: color.border.value,
				},
				outlinedInfo: {
					color: color.text.info.value,
					borderColor: color.border.info.value,
				},
				outlinedSuccess: {
					color: color.text.success.value,
					borderColor: color.border.success.value,
				},
				outlinedWarning: {
					color: color.text.warning.value,
					borderColor: color.border.warning.value,
				},
				outlinedError: {
					color: color.text.danger.value,
					borderColor: color.border.danger.value,
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
			styleOverrides: {
				root: {
					svg: {
						width: '1em',
					},
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
		MuiToggleButton: {
			styleOverrides: {
				root: {
					border: `1px solid ${color.border.value} !important`,
					color: color.text.value,
					'&:hover': {
						backgroundColor: color.bg.value,
					},
					'&.Mui-selected': {
						backgroundColor: color.bg.subtle.value,
						'&:hover': {
							backgroundColor: color.bg.subtle.value,
						},
					},
					'&.MuiToggleButton-primary': {
						border: `1px solid ${color.border.accent.value} !important`,
						color: color.text.accent.value,
						'&:hover': {
							backgroundColor: color.bg.accent.value,
						},
						'&.Mui-selected': {
							backgroundColor: color.bg.accent.value,
						},
					},
					'&.MuiToggleButton-info': {
						border: `1px solid ${color.border.info.value} !important`,
						color: color.text.info.value,
						'&:hover': {
							backgroundColor: color.bg.info.value,
						},
						'&.Mui-selected': {
							backgroundColor: color.bg.info.value,
						},
					},
					'&.MuiToggleButton-success': {
						border: `1px solid ${color.border.success.value} !important`,
						color: color.text.success.value,
						'&:hover': {
							backgroundColor: color.bg.success.value,
						},
						'&.Mui-selected': {
							backgroundColor: color.bg.success.value,
						},
					},
					'&.MuiToggleButton-warning': {
						border: `1px solid ${color.border.warning.value} !important`,
						color: color.text.warning.value,
						'&:hover': {
							backgroundColor: color.bg.warning.value,
						},
						'&.Mui-selected': {
							backgroundColor: color.bg.warning.value,
						},
					},
					'&.Mui-error': {
						border: `1px solid ${color.border.danger.value} !important`,
						color: color.text.danger.value,
						'&:hover': {
							backgroundColor: color.bg.danger.value,
						},
						'&.Mui-selected': {
							backgroundColor: color.bg.danger.value,
						},
					},
				},
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
		MuiFormControl: {
			defaultProps: {
				variant: 'outlined',
			},
		},
		MuiOutlinedInput: {
			defaultProps: {
				notched: false,
			},
			styleOverrides: {
				root: ({ theme }) => ({
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
		MuiLink: {
			styleOverrides: {
				root: {
					color: '#00AEEF',
					textDecoration: 'none',
					'&:hover': {
						color: '#008bbf',
					},
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
		MuiGrid2: {
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
	},
});

export type Theme = typeof theme;