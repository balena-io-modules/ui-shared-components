import { interpolateMustache } from './utils';
import { Box, List, Tab, Tabs, Typography } from '@mui/material';
import { memo, useEffect, useMemo, useState } from 'react';
import { MUILinkWithTracking } from '../MUILinkWithTracking';
import type {
	DeviceType,
	KeysOfUnion,
	OsSpecificContractInstructions,
} from './models';
import { OrderedListItem } from '../OrderedListItem';
import { Markdown } from '../Markdown';
import { Chip } from '../Chip';
import { token } from '../../utils/token';

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

const SECURE_BOOT_INSTRUCTION_TO_REPLACE_START = 'Press the F10 key while BIOS';

const dtJsonTocontractOsKeyMap = {
	windows: 'Windows',
	osx: 'MacOS',
	linux: 'Linux',
} as const;

export const ApplicationInstructions = memo(function ApplicationInstructions({
	deviceType,
	templateData,
	secureboot,
}: {
	deviceType: DeviceType;
	templateData: { dockerImage: string };
	secureboot: boolean;
}) {
	const [currentOs, setCurrentOs] = useState<OsOptions>(getUserOs());

	const instructions = useMemo(() => {
		if (
			deviceType?.instructions == null ||
			Array.isArray(deviceType.instructions) ||
			typeof deviceType.instructions !== 'object'
		) {
			return deviceType?.instructions;
		}

		const instructionsByOs = deviceType.instructions;

		return Object.fromEntries(
			(
				Object.entries(instructionsByOs) as Array<
					[KeysOfUnion<typeof instructionsByOs>, string[]]
				>
			).map(([key, value]) => {
				const normalizedKey =
					key in dtJsonTocontractOsKeyMap
						? dtJsonTocontractOsKeyMap[
								key as keyof typeof dtJsonTocontractOsKeyMap
							]
						: (key as keyof OsSpecificContractInstructions);
				return [normalizedKey, value];
			}),
		) as OsSpecificContractInstructions;
	}, [deviceType?.instructions]);
	const hasOsSpecificInstructions = !Array.isArray(instructions);
	const normalizedOs = currentOs === 'Unknown' ? 'Linux' : currentOs;

	useEffect(() => {
		if (hasOsSpecificInstructions && instructions) {
			const oses = Object.keys(instructions) as unknown as OsOptions;
			if (!oses.includes(currentOs) && oses.length > 0) {
				setCurrentOs(oses[0] as OsOptions);
			}
		}
	}, [currentOs, setCurrentOs, instructions, hasOsSpecificInstructions]);

	if (!deviceType || !instructions) {
		return (
			<Typography variant="body1">
				Instructions for this device type are not currently available. Please
				try again later.
			</Typography>
		);
	}

	const interpolatedInstructions = (
		hasOsSpecificInstructions ? instructions[normalizedOs] : instructions
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
							value={Object.keys(instructions).find((key) => key === currentOs)}
							onChange={(_event, value) => {
								setCurrentOs(value ?? 'Unknown');
							}}
							aria-label="os tabs"
						>
							{(Object.keys(instructions) as OsOptions[]).map((os) => {
								return <Tab key={os} label={os} value={os} />;
							})}
						</Tabs>
					</Box>
				</Box>
			)}

			<InstructionsList
				instructions={finalInstructions}
				secureboot={secureboot}
			/>

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
	instruction: string;
	index: number;
	secureboot: boolean;
}

interface InstructionsListProps {
	instructions: string[];
	secureboot: boolean;
}

const InstructionsItem = ({
	instruction,
	index,
	secureboot,
}: InstructionsItemProps) => {
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
						<p style={{ marginTop: 0, marginBottom: 0 }}>
							{/* TODO: Find a way to do this via contracts */}
							{secureboot &&
							instruction.includes(SECURE_BOOT_INSTRUCTION_TO_REPLACE_START) ? (
								<>
									{
										instruction.split(
											SECURE_BOOT_INSTRUCTION_TO_REPLACE_START,
										)[0]
									}
									<Box
										mt={2}
										borderLeft={1}
										borderColor={token('color.border.subtle')}
										pl={2}
									>
										<Chip
											sx={{ marginRight: 1 }}
											label="Secure Boot"
											color="purple"
										/>
										The device needs to be configured in secure boot setup mode.
										This depends on the UEFI/BIOS implementation, but in
										general, this involves resetting the UEFI settings to
										default configuration, configuring the device to boot in
										UEFI mode, setting the first boot option to the USB key and
										disabling the restoration of factory keys. Save and Exit the
										UEFI/BIOS menu and the device should automatically reboot
										and begin the provisioning process.{' '}
										<MUILinkWithTracking href="https://docs.balena.io/reference/OS/secure-boot-and-full-disk-encryption/generic-x86-64-gpt/#provision-the-device">
											Read more on UEFI settings for secure boot and full disk
											encryption.
										</MUILinkWithTracking>
									</Box>
								</>
							) : (
								children
							)}
						</p>
					),
				}}
			>
				{instruction}
			</Markdown>
		</OrderedListItem>
	);
};

const InstructionsList = ({
	instructions,
	secureboot,
}: InstructionsListProps) => {
	return (
		<List>
			{instructions.map((instruction, i) => {
				return (
					<InstructionsItem
						key={`${instruction}_${i}`}
						instruction={instruction}
						index={i}
						secureboot={secureboot}
					/>
				);
			})}
		</List>
	);
};
