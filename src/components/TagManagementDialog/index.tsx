import React from 'react';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons/faTrashAlt';
import { faUndo } from '@fortawesome/free-solid-svg-icons/faUndo';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AddTagForm } from './AddTagForm';
import type {
	ResourceTagInfo,
	ResourceTagInfoState,
	ResourceTagSubmitInfo,
	SubmitInfo,
	TaggedResource,
} from './models';
import sortBy from 'lodash/sortBy';
import toString from 'lodash/toString';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons/faPencilAlt';
import {
	getResourceTagSubmitInfo,
	groupResourcesByTags,
} from './tag-management-service';
import partition from 'lodash/partition';
import {
	Button,
	DialogActions,
	DialogContent,
	Stack,
	styled,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	TextField,
	Typography,
} from '@mui/material';
import { useTranslation } from '../../hooks/useTranslations';
import { CollectionSummary } from '../CollectionSummary';
import { DialogWithCloseButton } from '../DialogWithCloseButton';
import {
	stopKeyDownEvent,
	withPreventDefault,
} from '../../utils/eventHandling';
import { token } from '../../utils/token';

const NBSP = '\u00a0';

const UndoButtonMinWidth = 100;

const TdThHorizontalPadding = 10;

const TagTr = styled(TableRow)`
	&:hover {
		td [data-hover='tag-management-modal__on-hover'] {
			opacity: 0.7;
		}
	}

	td [data-hover='tag-management-modal__on-hover'] {
		opacity: 0;
		cursor: pointer;

		&:hover {
			opacity: 1;
		}
	}
`;

const TagProperty = styled('div')<{ state?: ResourceTagInfoState }>`
	display: flex;
	max-width: 100%;

	color: ${(props) =>
		props.state === 'added'
			? token('color.text.warning')
			: props.state === 'updated'
				? token('color.text.warning')
				: props.state === 'deleted'
					? token('color.text.subtle')
					: 'inherit'};

	& > div {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
`;

const EditableTagValue = styled(TagProperty)`
	display: flex;
	align-items: center;
	cursor: pointer;

	& > div {
		display: inline-flex;
		align-items: center;
		justify-content: flex-start;
		max-width: 100%;
	}
`;

const PreviousTagProperty = styled(TagProperty)`
	display: inline-flex;
	width: 100%;
	margin-bottom: ${(props) => (props.state === 'deleted' ? 0 : 6)}px;

	position: relative;

	&:after {
		content: '';
		position: absolute;
		left: 0;
		right: 0;
		display: block;
		background: ${token('color.bg.warning')};
		height: 2px;
		top: 50%;
	}

	td > &,
	td > & {
		color: ${token('color.text.subtle')};
	}

	td > &:after {
		right: ${-TdThHorizontalPadding}px;
	}

	td > & {
		width: auto;
		&:after {
			left: ${-TdThHorizontalPadding}px;
		}
	}
`;

export interface TagManagementDialogProps<T> {
	/** Selected items to tag */
	items: T[];
	/** Selected items type */
	itemType: string;
	/** Tag field title */
	titleField: keyof T | ((item: T) => string);
	/** Tags property in the selected item */
	tagField: keyof T;
	/** On cancel press event */
	cancel: () => void;
	/** On done press event */
	done: (
		tagSubmitInfo: SubmitInfo<ResourceTagSubmitInfo, ResourceTagSubmitInfo>,
	) => void;
}

export const TagManagementDialog = <T extends TaggedResource>({
	items,
	itemType,
	titleField,
	tagField,
	cancel,
	done,
}: TagManagementDialogProps<T>) => {
	const { t } = useTranslation();
	const [editingTag, setEditingTag] = React.useState<ResourceTagInfo<T>>();
	const [tags, setTags] = React.useState<Array<ResourceTagInfo<T>>>();
	const [partialTags, setPartialTags] =
		React.useState<Array<ResourceTagInfo<T>>>();

	const tagDiffs = React.useMemo(
		() => getResourceTagSubmitInfo(tags ?? []),
		[tags],
	);

	React.useEffect(() => {
		const allTags = groupResourcesByTags(items, tagField);
		const [commonTags, $partialTags] = partition(
			allTags,
			(tag) => tag.items.length === items.length,
		);
		setTags(commonTags);
		setPartialTags($partialTags);
		// TODO: This snapshots the item at the moment the dialog is open.
		// Consider using a separate state for editing tags.
		// eslint-disable-next-line react-hooks/exhaustive-deps -- We want to update this at the moment the dialog is open
	}, [items.length > 0]);

	if (!tags || !partialTags) {
		return null;
	}

	const addTag = (tag: ResourceTagInfo<T>) => {
		let slicedTags = tags.slice();

		const existingDeletedTag = slicedTags.find(
			(existingTag) =>
				existingTag.state === 'deleted' && existingTag.tag_key === tag.tag_key,
		);
		if (existingDeletedTag) {
			existingDeletedTag.initialValue = existingDeletedTag.value;
			existingDeletedTag.value = tag.value;
			existingDeletedTag.state = 'updated';
		} else {
			const newTag: ResourceTagInfo<T> = {
				tag_key: tag.tag_key,
				value: tag.value,
				items: items.slice(),
				state: 'added',
			};

			slicedTags.push(newTag);
			slicedTags = sortBy(slicedTags, 'tag_key');
		}

		setEditingTag(undefined);
		setTags(slicedTags);
	};

	const undoTagChanges = (tag: ResourceTagInfo<T>) => {
		if (tag.state === 'added') {
			setTags(tags.filter((item) => item !== tag));
			return;
		}
		if (tag.state === 'updated') {
			tag.value = tag.initialValue ?? '';
			tag.state = undefined;
		}
		if (tag.state === 'deleted') {
			tag.state = undefined;
		}
		setTags(tags.slice());
	};

	const startTagEdit = (tag: ResourceTagInfo<T>) => {
		if (tag && tag.initialValue === undefined) {
			tag.initialValue = tag.value || '';
		}
		setEditingTag(tag);
	};

	const endTagEdit = () => {
		if (editingTag) {
			const tagKey = editingTag.tag_key;
			const newTags = tags.map((tag) =>
				tag.tag_key === tagKey ? editingTag : tag,
			);
			setTags(newTags);
		}
		setEditingTag(undefined);
	};

	const setEditingTagValue = (value: string) => {
		if (!editingTag) {
			return;
		}
		const newTag = { ...editingTag };
		newTag.value = value;
		if (!newTag.state && newTag.initialValue !== value) {
			newTag.state = 'updated';
		}
		setEditingTag(newTag);
	};

	const deleteTag = (tag: ResourceTagInfo<T>) => {
		if (tag.state === 'added') {
			setTags(tags.filter((item) => item !== tag));
			return;
		}

		tag.state = 'deleted';
		setTags(tags.slice());
	};

	const getItemTitle = (item: T) => {
		const title =
			typeof titleField === 'function'
				? titleField(item)
				: toString(item[titleField]);
		return title || `(${t('no_data.no_name_set')})`;
	};

	return (
		<DialogWithCloseButton
			open
			title={
				<Stack>
					<Typography variant="h3" mt={0} mb={10}>
						{items.length > 1 && <span>{t('labels.shared')} </span>}
						{t('labels.tags')}
					</Typography>
					<CollectionSummary
						items={items.map(getItemTitle).sort()}
						itemsType={t('resource.' + itemType, { count: items.length })}
						maxVisibleItemCount={10}
					/>
				</Stack>
			}
		>
			<DialogContent>
				<AddTagForm<T>
					itemType={itemType}
					existingTags={tags}
					overridableTags={partialTags}
					addTag={addTag}
					t={t}
				/>
				<Table>
					<TableHead>
						<TableCell />
						<TableCell>{t('labels.tag_name')}</TableCell>
						<TableCell>{t('labels.value')}</TableCell>
						<TableCell />
					</TableHead>
					<TableBody>
						{!tags.length ? (
							<TableRow>
								<TableCell />
								<TableCell>
									{t(`errors.no_tags_for_selected_itemtype`, {
										count: items.length,
										itemType,
									})}
								</TableCell>
							</TableRow>
						) : (
							tags.map((tag) => {
								const showPreviousTagProperties =
									editingTag?.tag_key !== tag.tag_key &&
									(tag.state === 'deleted' || tag.state === 'updated');
								return (
									<TagTr key={tag.tag_key} {...tag}>
										<TableCell sx={{ textAlign: 'center' }}>
											{tag.state !== 'deleted' && (
												<FontAwesomeIcon
													icon={faTrashAlt}
													data-hover="tag-management-modal__on-hover"
													onClick={() => {
														deleteTag(tag);
													}}
												/>
											)}
										</TableCell>
										<TableCell>
											{showPreviousTagProperties && (
												<PreviousTagProperty state={tag.state}>
													{tag.tag_key}
												</PreviousTagProperty>
											)}
											{tag.state !== 'deleted' && (
												<TagProperty state={tag.state}>
													{tag.tag_key}
												</TagProperty>
											)}
										</TableCell>
										<TableCell>
											{showPreviousTagProperties && (
												<PreviousTagProperty state={tag.state}>
													{tag.initialValue ?? NBSP}
												</PreviousTagProperty>
											)}
											{editingTag?.tag_key !== tag.tag_key &&
												tag.state !== 'deleted' && (
													<EditableTagValue
														state={tag.state}
														onClick={() => {
															startTagEdit(tag);
														}}
													>
														<Typography noWrap mr={3}>
															{tag.value || NBSP}
														</Typography>
														<FontAwesomeIcon
															data-hover="tag-management-modal__on-hover"
															icon={faPencilAlt}
														/>
													</EditableTagValue>
												)}
											{editingTag?.tag_key === tag.tag_key && (
												<TextField
													fullWidth
													autoFocus
													onKeyDown={(e) => {
														stopKeyDownEvent(e, 13, endTagEdit);
													}}
													onFocus={(e) => {
														// move the cursor to the end
														const target = e.target as HTMLInputElement;
														const len = (target.value || '').length;
														if (len) {
															target.setSelectionRange(len, len);
														}
													}}
													onChange={(e) => {
														setEditingTagValue(e.target.value);
													}}
													onBlur={() => {
														endTagEdit();
													}}
													value={editingTag.value}
													placeholder={t('labels.tag_value')}
												/>
											)}
										</TableCell>
										<TableCell>
											{tag.state && (
												<Button
													variant="text"
													startIcon={<FontAwesomeIcon icon={faUndo} />}
													onClick={() => {
														undoTagChanges(tag);
													}}
													sx={{
														width: UndoButtonMinWidth,
														textAlign: 'left',
													}}
												>
													<span>
														{tag.state === 'added'
															? t('actions.undo_add')
															: tag.state === 'updated'
																? t('actions.undo_edit')
																: t('actions.undo_delete')}
													</span>
												</Button>
											)}
										</TableCell>
									</TagTr>
								);
							})
						)}
					</TableBody>
				</Table>
			</DialogContent>
			<DialogActions>
				<Button
					onClick={withPreventDefault(() => {
						done(tagDiffs);
					})}
					disabled={
						Object.values(tagDiffs).filter(
							(changedTags) => changedTags.length > 0,
						).length === 0
							? true
							: false
					}
				>
					{t(`actions.apply_item_type_count`, {
						count: items.length,
						itemType: t('labels.' + itemType, {
							count: items.length,
						}).toLowerCase(),
					})}
				</Button>
				<Button color={'error'} onClick={cancel}>
					{t('actions.cancel')}
				</Button>
			</DialogActions>
		</DialogWithCloseButton>
	);
};
