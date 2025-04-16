import React from 'react';
import template from 'lodash/template';
import { UiSharedComponentsContextProvider } from '../contexts/UiSharedComponentsContextProvider';

export type TFunction = (str: string, options?: any) => string;

const translationMap = {
	// TagManagement
	'labels.tags': 'Tags',
	'labels.shared': 'Shared',
	'labels.tag_name': 'Tag name',
	'labels.value': 'Value',
	'labels.tag_value': 'Tag value',

	'actions.ok': 'OK',
	'actions.cancel': 'Cancel',
	'actions.manage_tags': 'Manage tags',
	'actions.add_tag': 'Add tag',
	'actions.continue': 'Continue',
	'actions.undo_add': 'Undo add',
	'actions.undo_edit': 'Undo edit',
	'actions.undo_delete': 'Undo delete',
	'actions.apply_item_type_count': 'Apply',
	'actions.apply_item_type_count_plural': 'Apply to {{count}} {{itemType}}',

	'actions_messages.confirmation': 'Are you sure?',

	'actions_confirmations.confirm_to_proceed': 'Do you want to proceed?',

	'no_data.no_name_set': 'No name set',

	'warnings.this_would_overwrite_tags':
		'Adding this would overwrite tags on {{itemType}}',
	'warnings.tag_name_group_exists_and_will_be_overwritten':
		'A tag name group exists on {{count}} other {{itemType}} and will be overwritten.',
	'warnings.tag_name_group_exists_and_will_be_overwritten_plural':
		'A tag name group exists on {{count}} other {{itemType}}s and will be overwritten.',
	'warnings.fill_wifi_credentials':
		'Please fill in the wifi credentials or select "Ethernet only" in the "Network Connection" section',
	'warnings.some_fields_are_invalid': 'Some fields are invalid',
	'warnings.image_deployed_to_docker':
		'This image is deployed to docker so you can only download its config',

	'errors.no_tags_for_selected_itemtype':
		'The selected {{itemType}} has no tags',
	'errors.no_tags_for_selected_itemtype_plural':
		'The selected {{itemType}}s have no tags in common',

	'fields_errors.tag_name_cannot_be_empty': "The tag name can't be empty.",
	'fields_errors.tag_names_cannot_contain_whitespace':
		'Tag names cannot contain whitespace',
	'fields_errors.some_tag_keys_are_reserved':
		'Tag names beginning with {{namespace}} are reserved',
	'fields_errors.tag_with_same_name_exists':
		'A tag with the same name already exists',
	'fields_errors.does_not_satisfy_minimum':
		'Must be greater than or equal to {{minimum}}',
	'fields_errors.does_not_satisfy_maximum':
		'Must be less than or equal to {{maximum}}',

	// RJST
	'info.update_item_no_permissions':
		"You don't have permission to {{action}} the selected {{resource}}",
	'info.ongoing_action_wait': 'There is an ongoing action, please wait',
	'info.create_item_no_permissions':
		"You don't have permission to create a new {{resource}}",
	'info.edit_tag_no_permissions':
		"You don't have permission to edit the tags on the selected {{resource}}",
	'info.no_selected': "You haven't selected anything yet",
	'info.click_to_read_more': 'Read more about {{title}}',
	'info.already_visible': 'This column is already visible',
	'labels.lenses': 'Lenses',
	'labels.modify': 'Modify',
	'loading.resource': 'Loading {{resource}}',
	'no_data.no_resource_data': "You don't have any {{resource}} yet.",
	'no_data.no_resource_data_title': 'This is where all your {{resource}} live.',
	'no_data.no_resource_data_description':
		"This is a bit empty right now, let's go ahead and add one",
	'questions.how_about_adding_one': 'How about adding one?',
	'resource.item_other': 'Items',
	'success.resource_added_successfully': '{{name}} added successfully',
	'success.tags_updated_successfully': 'Tags updated successfully',

	'actions.add_filter': 'Add filter',
	'labels.filter_by': 'Filter by',
	'labels.info_no_views': "You haven't created any views yet",
	'labels.views': 'Views',
	'labels.filter_one': 'Filter',
	'labels.filter_other': 'Filters',
	'labels.total_resources': '{{count}} {{resource}}',

	'labels.save_current_view': 'Save current view',

	'aria_labels.remove_view': 'Delete the selected view',
	'aria_labels.create_view': 'Create named view',
	'aria_labels.add_filter_in_or': 'Add filter with OR condition',
	'aria_labels.remove_filter': 'Remove selected filter',
	'aria_labels.save_tag_columns': 'Save added tag columns',

	'actions.clear_all': 'Clear filters',
	'actions.save_view': 'Save view',
	'actions.add_alternative': 'Add alternative',
	'actions.remove_filter': 'Remove filter',
	'actions.add_columns': 'Add columns',

	'commons.or': 'or',

	// DisabledTextWidget
	'info.not_defined': 'not defined',
};

const getTranslation = (str: string, opts?: any) => {
	let translation = translationMap[str as keyof typeof translationMap];
	if (!opts) {
		return translation;
	}
	if (opts.count != null && opts.count > 1) {
		const pluralKey = `${str}_plural` as keyof typeof translationMap;
		translation =
			translationMap[pluralKey] ??
			translationMap[str as keyof typeof translationMap];
	}
	const compiled = template(translation, { interpolate: /{{([\s\S]+?)}}/g });
	return compiled(opts);
};

export const useTranslation = () => {
	const { t: externalT } = React.useContext(UiSharedComponentsContextProvider);
	const t: TFunction = (str: string, opts?: any) => {
		let result = str;
		if (!!externalT && typeof externalT === 'function') {
			result = externalT(str, opts);
		}
		if (result == null || result === str) {
			result = getTranslation(str, opts);
		}
		return result ?? str;
	};

	return { t };
};
