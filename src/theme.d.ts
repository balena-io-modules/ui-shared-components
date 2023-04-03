import type { Theme } from '@mui/material';

type CustomPaletteColor = PaletteColor & { xlight: string };
type CustomPaletteColorOptions = PaletteColorOptions & { xlight: string };
declare module '@mui/material/styles' {
	interface TypographyVariants {
		bodyLarge?: TypographyStyle;
		smallText?: TypographyStyle;
		link?: TypographyStyle;
	}

	interface TypographyVariantsOptions {
		bodyLarge?: TypographyStyleOptions | undefined;
		smallText?: TypographyStyleOptions | undefined;
		link?: TypographyStyleOptions | undefined;
	}

	interface TypeText {
		primary: string;
		secondary: string;
		tertiary: string;
		disabled: string;
	}
}

// Update the Typography's variant prop options
declare module '@mui/material/Typography' {
	interface TypographyPropsVariantOverrides {
		bodyLarge?: true;
		smallText?: true;
		link?: true;
	}
}

declare module '@mui/material/Button' {
	interface ButtonPropsColorOverrides {
		hubBlue?: CustomPaletteColor;
		hubYellow?: CustomPaletteColor;
		hubGreen?: CustomPaletteColor;
		hubPurple?: CustomPaletteColor;
		hubGrey?: CustomPaletteColor;
	}
}

declare module '@mui/material/styles/createPalette' {
	interface Palette {
		hubBlue?: CustomPaletteColor;
		hubYellow?: CustomPaletteColor;
		hubGreen?: CustomPaletteColor;
		hubPurple?: CustomPaletteColor;
		hubGrey?: CustomPaletteColor;
	}
	interface PaletteOptions {
		hubBlue?: CustomPaletteColorOptions;
		hubYellow?: CustomPaletteColorOptions;
		hubGreen?: CustomPaletteColorOptions;
		hubPurple?: CustomPaletteColorOptions;
		hubGrey?: CustomPaletteColorOptions;
	}
}

export { Theme };
