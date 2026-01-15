import React from 'react';
import type { StrictRJSFSchema as JSONSchema } from '@rjsf/utils';
import type { RJSTContext, RJSTBaseResource } from '../schemaOps';
import { parseDescriptionProperty } from '../schemaOps';
import { get } from '../../../utils/objects';
import { useTranslation } from '../../../hooks/useTranslations';
import type {
	ResourceTagSubmitInfo,
	SubmitInfo,
} from '../../TagManagementDialog/models';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
import { useQuery } from '@tanstack/react-query';
import { Spinner } from '../../Spinner';
import { TagManagementDialog } from '../../TagManagementDialog';

interface TagsProps<T> {
	selected: T[] | undefined;
	rjstContext: RJSTContext<T>;
	schema: JSONSchema;
	setIsBusyMessage: (message: string | undefined) => void;
	onDone: () => void;
	refresh?: () => void;
}

export const Tags = <T extends RJSTBaseResource<T>>({
	selected,
	rjstContext,
	schema,
	setIsBusyMessage,
	refresh,
	onDone,
}: TagsProps<T>) => {
	const { t } = useTranslation();

	const { sdk, internalPineFilter, checkedState } = rjstContext;

	const getAllTags = sdk?.tags && 'getAll' in sdk.tags ? sdk.tags.getAll : null;

	// This will get nested property names based on the x-ref-scheme property.
	const getItemName = (item: T) => {
		const property = schema.properties?.[
			rjstContext.nameField as keyof typeof schema.properties
		] as JSONSchema;
		const refScheme = parseDescriptionProperty(property, 'x-ref-scheme');

		if (refScheme != null && typeof refScheme === 'object') {
			const field = refScheme[0];
			const nameFieldItem = item[rjstContext.nameField as keyof T];
			return get(
				property.type === 'array'
					? (nameFieldItem as Array<T[keyof T]>)?.[0]
					: nameFieldItem,
				field,
			);
		}

		return item[rjstContext.nameField as keyof T];
	};

	const { data: items, isPending } = useQuery({
		queryKey: [
			'tableTags',
			internalPineFilter,
			checkedState,
			getAllTags,
			selected == null,
		],
		queryFn: async () => {
			if (
				// we are in server side pagination
				selected == null &&
				checkedState === 'all' &&
				getAllTags
			) {
				return (await getAllTags(internalPineFilter)) ?? null;
			}
			return selected ?? null;
		},
	});

	const changeTags = React.useCallback(
		async (tags: SubmitInfo<ResourceTagSubmitInfo, ResourceTagSubmitInfo>) => {
			if (!sdk?.tags) {
				return;
			}

			setIsBusyMessage(t(`loading.updating_tags`));
			enqueueSnackbar({
				key: 'change-tags-loading',
				message: t(`loading.updating_tags`),
				preventDuplicate: true,
			});

			try {
				await sdk.tags.submit(tags);
				enqueueSnackbar({
					key: 'change-tags',
					message: t('success.tags_updated_successfully'),
					variant: 'success',
					preventDuplicate: true,
				});
				refresh?.();
			} catch (err: any) {
				enqueueSnackbar({
					key: 'change-tags',
					message: err.message,
					variant: 'error',
					preventDuplicate: true,
				});
			} finally {
				closeSnackbar('change-tags-loading');
				setIsBusyMessage(undefined);
			}
		},
		[sdk?.tags, refresh, setIsBusyMessage, t],
	);

	if (!rjstContext.tagField || !rjstContext.nameField || !items) {
		return null;
	}

	return (
		<Spinner show={isPending} sx={{ width: '100%', height: '100%' }}>
			<TagManagementDialog<T>
				items={items}
				itemType={rjstContext.resource}
				titleField={getItemName ?? (rjstContext.nameField as keyof T)}
				tagField={rjstContext.tagField as keyof T}
				done={async (tagSubmitInfo) => {
					await changeTags(tagSubmitInfo);
					onDone();
				}}
				cancel={() => {
					onDone();
				}}
			/>
		</Spinner>
	);
};
