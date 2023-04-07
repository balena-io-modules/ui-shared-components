import type { Theme } from '@mui/material';

type CustomPaletteColor = PaletteColor & { xlight: string };
type CustomPaletteColorOptions = PaletteColorOptions & { xlight: string };

declare module '@mui/material/styles/createPalette' {
	interface Palette {
		customBlue?: CustomPaletteColor;
		customYellow?: CustomPaletteColor;
		customGreen?: CustomPaletteColor;
		customPurple?: CustomPaletteColor;
		customGrey?: CustomPaletteColor;
	}
	interface PaletteOptions {
		customBlue?: CustomPaletteColorOptions;
		customYellow?: CustomPaletteColorOptions;
		customGreen?: CustomPaletteColorOptions;
		customPurple?: CustomPaletteColorOptions;
		customGrey?: CustomPaletteColorOptions;
	}
}
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
	type ButtonPropsColorOverrides = Palette;
}

declare module '@mui/material/ButtonGroup' {
	type ButtonGroupPropsColorOverrides = Palette;
}
declare module '@mui/material/Badge' {
	type BadgePropsColorOverrides = Palette;
}

declare module '@mui/material/Chip' {
	type ChipPropsColorOverrides = Palette;
}
declare module '@mui/material/Icon' {
	type IconPropsColorOverrides = Palette;
}
declare module '@mui/material/IconButton' {
	type IconButtonPropsColorOverrides = Palette;
}
declare module '@mui/material/Tab' {
	type TabPropsColorOverrides = Palette;
}
declare module '@mui/material/TextField' {
	type TextFieldPropsColorOverrides = Palette;
}
declare module '@mui/material/SvgIcon' {
	type SvgIconPropsColorOverrides = Palette;
}

export { Theme };
