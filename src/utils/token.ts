import type { FlatTokens } from '@balena/design-tokens';

/**
 * Converts a token name (eg. color.bg.subtle) to a MUI CSS variable
 * @param designToken Design Token
 */
export const token = (designToken: FlatTokens) => {
	return `var(--mui-tokens-${designToken.replace(/\./g, '-')}-value)`;
};
