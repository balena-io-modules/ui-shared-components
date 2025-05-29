import { addons } from 'storybook/manager-api';
import { create } from 'storybook/theming';
import { color, typography } from '@balena/design-tokens';

import '@balena/design-tokens/build/css/tokens.css';
import './docs.css';

export const balenaTheme = create({
	base: 'light',
	brandTitle: 'Balena Design System',
	brandUrl: 'https://balena.io',
	brandImage: '/images/logo.svg',
	brandTarget: '_blank',

	fontBase: typography.fontFamily.body.value,

	textColor: color.text.value,

	colorSecondary: color.palette.blue['600'].value,
	colorPrimary: color.palette.neutral['800'].value,

	barBg: color.bg.value,

	appBorderColor: color.border.subtle.value,

	appBorderRadius: 0,
});

addons.setConfig({
	theme: balenaTheme,
});
