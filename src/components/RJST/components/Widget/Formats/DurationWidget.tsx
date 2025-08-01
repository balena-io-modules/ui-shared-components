import React from 'react';
import { intervalToDuration } from 'date-fns';
import { JsonTypes, widgetFactory } from '../utils';
import { Typography } from '@mui/material';

export const DurationWidget = widgetFactory('Duration', [JsonTypes.object])<
	object,
	object,
	{ start?: number | Date | null; end?: number | Date | null }
>(({ value }) => {
	const duration = React.useMemo(() => {
		if (!value.start || !value.end) {
			return '';
		}
		const interval = intervalToDuration({
			start: new Date(value.start),
			end: new Date(value.end),
		});
		if (!interval) {
			return '';
		}
		const customInterval: { [key: string]: string } = {};
		for (const [key, intervalValue] of Object.entries(interval)) {
			if (intervalValue == null) {
				continue;
			}
			customInterval[key] =
				intervalValue < 10 ? `0${intervalValue}` : `${intervalValue}`;
		}
		let durationText = '';
		if (interval.years) {
			durationText += `${customInterval.years}y `;
		}
		if (durationText.length > 0 || !!interval.months) {
			durationText += `${customInterval.months}m `;
		}
		if (durationText.length > 0 || !!interval.days) {
			durationText += `${customInterval.days}d `;
		}
		customInterval.hours ??= '00';
		customInterval.minutes ??= '00';
		customInterval.seconds ??= '00';
		durationText += `${customInterval.hours}:${customInterval.minutes}:${customInterval.seconds}`;
		return durationText;
	}, [value.end, value.start]);

	return <Typography>{duration}</Typography>;
});
