import React from 'react';
import { Box, Tab, type BoxProps, type TabProps } from '@mui/material';
import { TabContext, TabList, TabPanel, type TabPanelProps } from '@mui/lab';

export interface TabsProps {
	tabs: Array<{
		label: string;
		render: JSX.Element;
		tabProps?: Omit<TabProps, 'value'>;
		tabPanelProps?: Omit<TabPanelProps, 'value'>;
	}>;
	tabsListBoxProps?: BoxProps;
	/** defaultTab is a number corresponding to the default tab's index in the tabs property */
	defaultTab?: number;
	onTabChange?: (newTab: number) => void;
}

export const Tabs = ({
	tabs,
	tabsListBoxProps,
	defaultTab,
	onTabChange,
}: TabsProps) => {
	const [tab, setTab] = React.useState(
		(defaultTab !== undefined && defaultTab > 0 && defaultTab < tabs.length
			? defaultTab
			: 0
		).toString(),
	);

	if (!tabs.length) {
		return null;
	}

	const handleChange = (_event: React.SyntheticEvent, newValue: string) => {
		setTab(newValue);
		onTabChange?.(parseInt(newValue, 10));
	};

	const { sx, ...boxProps } = tabsListBoxProps ?? {};

	return (
		<TabContext value={tab}>
			<Box
				sx={[
					{ borderBottom: 1, borderColor: 'divider' },
					// See: https://mui.com/system/getting-started/the-sx-prop/#passing-the-sx-prop
					...(Array.isArray(sx) ? sx : [sx]),
				]}
				{...boxProps}
			>
				<TabList onChange={handleChange}>
					{tabs.map(({ label, tabProps }, index) => (
						<Tab label={label} value={index.toString()} {...tabProps} />
					))}
				</TabList>
			</Box>
			{tabs.map(({ render, tabPanelProps }, index) => (
				<TabPanel value={index.toString()} {...tabPanelProps}>
					{render}
				</TabPanel>
			))}
		</TabContext>
	);
};
