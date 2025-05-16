import has from 'lodash/has';
import { interpolateMustache } from './utils';
import { Box, List, Tab, Tabs, Typography } from '@mui/material';
import { memo, useEffect, useState } from 'react';
import { MUILinkWithTracking } from '../MUILinkWithTracking';
import type { DeviceType, OsSpecificContractInstructions } from './models';
import { OrderedListItem } from '../OrderedListItem';
import { Markdown } from '../Markdown';

export type OsOptions = ReturnType<typeof getUserOs>;

export const getUserOs = () => {
	const platform = window.navigator.platform.toLowerCase();
	if (platform.includes('win')) {
		return 'Windows';
	}

	if (platform.includes('mac')) {
		return 'MacOS';
	}

	if (platform.includes('x11') || platform.includes('linux')) {
		return 'Linux';
	}

	return 'Unknown';
};

export const ApplicationInstructions = memo(function ApplicationInstructions({
	deviceType,
	templateData,
}: {
	deviceType: DeviceType;
	templateData: { dockerImage: string };
}) {
	const [currentOs, setCurrentOs] = useState<OsOptions>(getUserOs());

	const hasOsSpecificInstructions = !Array.isArray(deviceType.instructions);
	const normalizedOs = currentOs === 'Unknown' ? 'Linux' : currentOs;

	useEffect(() => {
		if (hasOsSpecificInstructions && deviceType.instructions) {
			const oses = Object.keys(deviceType.instructions);
			if (!oses.includes(currentOs) && oses.length > 0) {
				setCurrentOs(oses[0] as OsOptions);
			}
		}
	}, [
		currentOs,
		setCurrentOs,
		deviceType.instructions,
		hasOsSpecificInstructions,
	]);

	if (!deviceType.instructions) {
		return (
			<Typography variant="body1">
				Instructions for this device type are not currently available. Please
				try again later.
			</Typography>
		);
	}

	const interpolatedInstructions = (
		hasOsSpecificInstructions
			? (deviceType.instructions as OsSpecificContractInstructions)[
					normalizedOs
				]
			: (deviceType.instructions as string[])
	)?.map((instruction: string) =>
		interpolateMustache(
			templateData,
			instruction.replace(/<a/, '<a target="_blank"'),
		),
	);

	const finalInstructions = [
		'Use the form on the left to configure and download balenaOS for your new device.',
		...interpolatedInstructions,
		'Your device should appear in your application dashboard within a few minutes. Have fun!',
	];

	return (
		<Box display="flex" flexDirection="column" alignItems="flex-start">
			<Typography variant="h5">Instructions</Typography>

			{hasOsSpecificInstructions && (
				<Box mb={3}>
					<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<Tabs
							value={Object.keys(deviceType.instructions).find(
								(key) => key === currentOs,
							)}
							onChange={(_event, value) => {
								setCurrentOs(value ?? 'Unknown');
							}}
							aria-label="os tabs"
						>
							{(Object.keys(deviceType.instructions) as OsOptions[]).map(
								(os) => {
									return <Tab key={os} label={os} value={os} />;
								},
							)}
						</Tabs>
					</Box>
				</Box>
			)}

			<InstructionsList instructions={finalInstructions} />

			<Box mt={2}>
				<Typography>
					For more details please refer to our{' '}
					<MUILinkWithTracking
						href={`https://www.balena.io/docs/learn/getting-started/${deviceType.slug}/nodejs/`}
					>
						Getting Started Guide
					</MUILinkWithTracking>
					.
				</Typography>
			</Box>
		</Box>
	);
});

interface InstructionsItemProps {
	node: any;
	index: number;
}

interface InstructionsListProps {
	instructions: any[];
}

const InstructionsItem = ({ node, index }: InstructionsItemProps) => {
	const hasChildren = has(node, 'children');
	let text = null;

	if (typeof node === 'string') {
		text = node;
	}

	if (node?.text) {
		text = node.text;
	}

	return (
		<OrderedListItem index={index + 1} sx={{ maxWidth: '100%' }}>
			<Markdown
				components={{
					code: (codeProps) => {
						return (
							<code
								style={{
									maxWidth: '100%',
									display: 'inline-block',
									whiteSpace: 'normal',
									wordBreak: 'break-all',
									wordWrap: 'break-word',
								}}
								{...codeProps}
							/>
						);
					},
					br: () => {
						return <p />;
					},
					p: ({ children }) => (
						<p style={{ marginTop: 0, marginBottom: 0 }}>{children}</p>
					),
				}}
			>
				{text}
			</Markdown>

			{hasChildren && (
				<List>
					{(node.children as any[]).map((item, i) => {
						return <InstructionsItem key={i} node={item} index={i} />;
					})}
				</List>
			)}
		</OrderedListItem>
	);
};

const InstructionsList = ({ instructions }: InstructionsListProps) => {
	return (
		<List>
			{instructions.map((item, i) => {
				return <InstructionsItem key={`${item}_${i}`} node={item} index={i} />;
			})}
		</List>
	);
};
