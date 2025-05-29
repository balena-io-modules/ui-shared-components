import * as React from 'react';
import type { ResourceTagInfo } from './models';
import find from 'lodash/find';
import startsWith from 'lodash/startsWith';
import isEmpty from 'lodash/isEmpty';
import { Button, Stack, TextField, Typography } from '@mui/material';
import { Callout } from '../Callout';
import type { TFunction } from '../../hooks/useTranslations';
import { useTranslation } from '../../hooks/useTranslations';
import {
	stopKeyDownEvent,
	withPreventDefault,
} from '../../utils/eventHandling';
import {
	type SimpleConfirmationDialogProps,
	SimpleConfirmationDialog,
} from '../SimpleConfirmationDialog';
import { useRandomUUID } from '../../hooks/useRandomUUID';

const RESERVED_NAMESPACES = ['io.resin.', 'io.balena.'];

const newTagValidationRules = <T extends object>(
	t: ReturnType<typeof useTranslation>['t'],
	key: string,
	existingTags: Array<ResourceTagInfo<T>>,
) => {
	return [
		{
			test: () => !key || isEmpty(key),
			message: t('fields_errors.tag_name_cannot_be_empty'),
		},
		{
			test: () => /\s/.test(key),
			message: t('fields_errors.tag_names_cannot_contain_whitespace'),
		},
		{
			test: () =>
				RESERVED_NAMESPACES.some((reserved) => startsWith(key, reserved)),
			message: t(`fields_errors.some_tag_keys_are_reserved`, {
				namespace: RESERVED_NAMESPACES.join(', '),
			}),
		},
		{
			test: () =>
				existingTags.some(
					(tag) => tag.state !== 'deleted' && tag.tag_key === key,
				),
			message: t('fields_errors.tag_with_same_name_exists'),
		},
	];
};

interface AddTagFormProps<T> {
	t: TFunction;
	itemType: string;
	existingTags: Array<ResourceTagInfo<T>>;
	overridableTags?: Array<ResourceTagInfo<T>>;
	addTag: (tag: ResourceTagInfo<T>) => void;
}

export const AddTagForm = <T extends object>({
	itemType,
	existingTags,
	overridableTags = [],
	addTag,
}: AddTagFormProps<T>) => {
	const { t } = useTranslation();
	const [tagKey, setTagKey] = React.useState('');
	const [value, setValue] = React.useState('');
	const [tagKeyIsInvalid, setTagKeyIsInvalid] = React.useState(false);
	const [error, setError] = React.useState<{ message: string }>();
	const [canSubmit, setCanSubmit] = React.useState(false);
	const [confirmationDialogOptions, setConfirmationDialogOptions] =
		React.useState<SimpleConfirmationDialogProps>();

	const tagKeyInput = React.useRef<HTMLInputElement>(null);
	const valueInput = React.useRef<HTMLInputElement>(null);
	const formId = useRandomUUID();
	const formUuid = `add-tag-form-${formId}`;

	const checkNewTagValidity = (key: string) => {
		const failedRule = newTagValidationRules<T>(t, key, existingTags).find(
			(rule) => rule.test(),
		);

		const hasErrors = !!failedRule;

		setTagKeyIsInvalid(hasErrors);
		setError(failedRule);
		setCanSubmit(!hasErrors);
		return hasErrors;
	};

	const checkTagOverwrites = async () => {
		const overridableTag = find(overridableTags, {
			tag_key: tagKey,
		});

		if (!overridableTag) {
			return true;
		}
		const count = overridableTag.items.length;
		const result = await new Promise<boolean>((resolve) => {
			const confirmationOptions = {
				title: t('warnings.this_would_overwrite_tags', {
					itemType,
					count,
				}),
				children: (
					<Typography>
						{t(`warnings.tag_name_group_exists_and_will_be_overwritten`, {
							itemType,
							count,
						})}
						<br />
						{t('actions_confirmations.confirm_to_proceed')}
					</Typography>
				),
				action: t('actions.continue'),
				onClose: resolve,
			} as SimpleConfirmationDialogProps;

			setConfirmationDialogOptions(confirmationOptions);
		});
		setConfirmationDialogOptions(undefined);
		return result;
	};

	const internalAddTag = withPreventDefault(() => {
		if (checkNewTagValidity(tagKey)) {
			return;
		}

		return checkTagOverwrites().then((confirmed) => {
			if (!confirmed) {
				return;
			}

			addTag({
				tag_key: tagKey,
				value,
			} as ResourceTagInfo<T>);

			setTagKey('');
			setValue('');
			setTagKeyIsInvalid(false);
			setError(undefined);
			setCanSubmit(false);

			if (tagKeyInput?.current) {
				tagKeyInput.current.blur();
			}
			if (valueInput?.current) {
				valueInput.current.blur();
			}
		});
	});

	return (
		<>
			<Stack
				gap={2}
				mb={2}
				alignItems="center"
				direction="row"
				onKeyDown={(e) => {
					stopKeyDownEvent(e, 13, internalAddTag);
				}}
			>
				<TextField
					slotProps={{
						htmlInput: {
							form: formUuid,
						},
					}}
					fullWidth
					ref={tagKeyInput}
					onChange={(e) => {
						setTagKey(e.target.value);
						checkNewTagValidity(e.target.value);
					}}
					value={tagKey}
					error={tagKeyIsInvalid}
					placeholder={t('labels.tag_name')}
				/>

				<TextField
					slotProps={{
						htmlInput: {
							form: formUuid,
						},
					}}
					fullWidth
					ref={valueInput}
					onChange={(e) => {
						setValue(e.target.value);
					}}
					value={value}
					placeholder={t('labels.value')}
				/>

				<form id={formUuid} onSubmit={internalAddTag}>
					<Button
						sx={{
							width: 120,
						}}
						onClick={internalAddTag}
						disabled={!canSubmit}
					>
						{t('actions.add_tag')}
					</Button>
				</form>
				{confirmationDialogOptions && (
					<SimpleConfirmationDialog {...confirmationDialogOptions} />
				)}
			</Stack>
			{error && <Callout severity="danger">{error.message}</Callout>}
		</>
	);
};
