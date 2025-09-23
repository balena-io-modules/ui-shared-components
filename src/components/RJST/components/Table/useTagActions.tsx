import { useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons/faPlus';
import { uniq } from '../../../../utils/arrays';
import type { RJSTContext } from '../../schemaOps';
import { useQuery } from '@tanstack/react-query';
import { Stack } from '@mui/material';

export function useTagActions<T extends object>(
	rjstContext: RJSTContext<T>,
	data: T[] | undefined,
) {
	const [showAddTagDialog, setShowAddTagDialog] = useState(false);

	const { data: tagKeys } = useQuery({
		queryKey: ['useTagActions', rjstContext.sdk?.tags, data],
		queryFn: async () => {
			if (!rjstContext.sdk?.tags || !('getAll' in rjstContext.sdk.tags)) {
				return null;
			}
			const tags = (await rjstContext.sdk.tags.getAll(data)).flatMap(
				(d: T) => {
					// TODO: check if there is any safer way to get the tag key
					const tagKey = Object.keys(d).find((key) => key.endsWith('_tag'));
					return tagKey ? d[tagKey as keyof T] : [];
				},
				// TODO: improve typing
			) as Array<{
				tag_key: string;
			}>;
			return uniq(tags.map((tag) => tag.tag_key)) ?? null;
		},
	});

	const actions = useMemo(() => {
		if (!rjstContext.tagField) {
			return [];
		}

		return [
			{
				disabled: !tagKeys?.length,
				onClick: () => {
					if (!tagKeys?.length) {
						return [];
					}
					setShowAddTagDialog(true);
				},
				children: (
					<Stack direction="row" gap={2} alignItems="center">
						<FontAwesomeIcon icon={faPlus} />
						Add tag column
					</Stack>
				),
			},
		];
	}, [tagKeys, rjstContext.tagField]);

	return { actions, showAddTagDialog, setShowAddTagDialog, tagKeys };
}
