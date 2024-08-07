import React, { useState } from 'react';
import {
	Box,
	ToggleButton,
	ToggleButtonGroup,
	ToggleButtonGroupProps,
	Typography,
	TypographyVariant,
} from '@mui/material';
import { GridView, TableRows } from '@mui/icons-material';
import { color } from '@balena/design-tokens';

// TODO move this type to the Design Tokens package
type JsonToken = {
	type: string;
	value: string;
	blendMode: string;
	filePath: string;
	isSource: boolean;
	original: {
		type: string;
		value: string;
		blendMode: string;
	};
	name: string;
	attributes: {
		category: string;
		type: string;
		[key: string]: string;
	};
	path: string[];
};

export const ColorTable = ({ children }: { children: React.ReactNode }) => (
	<table style={{ width: '100%', borderCollapse: 'collapse' }}>
		<thead>
			<tr>
				<th style={{ textAlign: 'left', width: '75px' }}>Color</th>
				<th style={{ textAlign: 'left' }}>Token</th>
				<th style={{ textAlign: 'left' }}>Description</th>
				<th style={{ textAlign: 'left' }}>Variables</th>
				<th style={{ textAlign: 'left' }}>Value</th>
			</tr>
		</thead>
		<tbody>{children}</tbody>
	</table>
);

export const ColorRow = ({
	token,
	description,
}: {
	token: { value: string; name: string };
	description: string;
}) => {
	return (
		<tr>
			<td>
				<div
					style={{
						width: '100%',
						height: '20px',
						backgroundColor: token.value,
					}}
				></div>
			</td>
			<td>
				<strong>{formatTokenName(token.name, '.')}</strong> <br />
			</td>
			<td>{description}</td>
			<td>
				<code>{getVariableFromTokenName(token.name, 'js')}</code> <br />{' '}
				<code>{getVariableFromTokenName(token.name, 'css')}</code>
			</td>
			<td>
				<code>{token.value}</code>
			</td>
		</tr>
	);
};

/**
 * split pascalcase into lowercase words separated with dots or dashes, and remove first separator
 */
export const formatTokenName = (
	tokenName: string,
	separator: '.' | '-',
): string => {
	return tokenName
		.replace(/([A-Z])/g, `${separator}$1`)
		.slice(1)
		.toLowerCase();
};

export const getVariableFromTokenName = (
	tokenName: string,
	type: 'css' | 'js',
): string => {
	if (type === 'css') {
		return `var(--${formatTokenName(tokenName, '-')})`;
	} else {
		return `${formatTokenName(tokenName, '.')}.value`;
	}
};

export const getCategoriesFromTokens = (tokens: JsonToken[]) => {
	return tokens.reduce((acc: string[], token: JsonToken) => {
		if (!acc.includes(token.attributes.category)) {
			return [...acc, token.attributes.category];
		}
		return acc;
	}, []);
};

export const LensToggle = (
	props: React.PropsWithChildren<ToggleButtonGroupProps>,
) => {
	const [lens, setLens] = useState<'grid' | 'table'>('grid');

	const handleChange = (
		_: React.MouseEvent<HTMLElement>,
		newLens: 'grid' | 'table',
	) => {
		setLens(newLens);
	};

	return (
		<ToggleButtonGroup onChange={handleChange} exclusive {...props}>
			<ToggleButton value={'grid'} title="Grid lens" selected={lens === 'grid'}>
				{props.children || <GridView />}
			</ToggleButton>
			<ToggleButton
				value={'table'}
				title="Table lens"
				selected={lens === 'table'}
			>
				{props.children ? `${props.children} 1` : <TableRows />}
			</ToggleButton>
		</ToggleButtonGroup>
	);
};

export const TypeScaleItem = ({
	variant,
	isParagraph,
}: {
	variant: TypographyVariant;
	isParagraph?: boolean;
}) => {
	const text = !isParagraph
		? 'Lorem ipsum dolor sit amet'
		: 'Lorem ipsum dolor sit amet consectetur. Pretium consectetur et risus ac nisl egestas aliquam odio ac. Aenean urna consectetur at suspendisse. Magnis tincidunt non blandit velit accumsan orci amet mus.';
	return (
		<Box sx={{ display: 'flex', flexDirection: 'column' }}>
			<Typography variant="overline" sx={{ color: color.text.accent.value }}>
				{variant}
			</Typography>
			<Typography variant={variant}>{text} </Typography>
		</Box>
	);
};
