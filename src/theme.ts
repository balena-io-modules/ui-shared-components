import {
	PaletteColor,
	PaletteColorOptions,
	TypographyStyle,
	createTheme,
} from '@mui/material';
import { TypographyStyleOptions } from '@mui/material/styles/createTypography';

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
				fontSize: '1.125 rem',
			},
		},
		bodyLarge: {
			fontSize: '1.125rem',
			'@media (min-width:600px)': {
				fontSize: '1.25 rem',
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
			color: '#828282',
		},
		link: {
			fontSize: '13px',
			color: '#00AEEF',
		},
	},
	palette: {
		secondary: {
			light: '#8F9297',
			main: '#3C3E42',
			dark: '#0C0C0C',
			contrastText: '#F4F4F4',
		},
		customBlue: {
			xlight: '#E5F8FF',
			light: '#CAF0FF',
			main: '#00AEEF',
			dark: '#2A506F',
		},
		customYellow: {
			xlight: '#F8DD88',
			main: '#FFC100',
			contrastText: '#FFFFFF',
		},
		customGreen: {
			xlight: '#DBF9F6',
		},
		customPurple: {
			main: '#594A83',
			xlight: '#F2EDFF',
		},
		customGrey: {
			xlight: '#F4F4F4',
			light: '#8F9297',
			main: '#3C3E42',
			dark: '#0C0C0C',
		},
		background: {
			default: '#F8F9FD',
		},
		text: {
			primary: '#2A506F',
			secondary: '#3C3E42',
			tertiary: '#8F9297',
		},
	},
	spacing: [0, 4, 8, 16, 32, 64, 129],
	components: {
		MuiAvatar: {
			styleOverrides: {
				root: {
					img: {
						objectFit: 'contain',
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
					border: '1px solid #E3E6F2',
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
					borderColor: '#DEE1EF',
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
			styleOverrides: {
				root: {
					boxShadow: 'none',
					borderRadius: '24px',
					paddingLeft: '32px',
					paddingRight: '32px',
				},
				outlined: {
					textTransform: 'none',
				},
				contained: {
					textTransform: 'none',
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
			styleOverrides: {
				tooltip: {
					backgroundColor: 'black',
				},
				arrow: {
					color: 'black',
				},
			},
		},
	},
});
