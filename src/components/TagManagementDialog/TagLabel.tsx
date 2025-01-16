import React from 'react';
import { faCopy } from '@fortawesome/free-solid-svg-icons/faCopy';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import type { ResourceTagBase } from './models';
import type { TypographyProps } from '@mui/material';
import { ClickAwayListener, styled, Tooltip, Typography } from '@mui/material';
import { useTranslation } from '../../hooks/useTranslations';
import { copyToClipboard } from '../Copy';
import { stopEvent } from '../../utils/eventHandling';

const Label = styled(Typography)(({ theme }) => ({
	display: 'inline-flex',
	alignItems: 'stretch',
	justifyContent: 'stretch',
	maxWidth: '100%',
	height: '30px',
	padding: '7px',
	border: `0.5px solid ${theme.palette.info.main}`,
	fontSize: '11px',
	fontWeight: 'bold',
	borderRadius: '3px',
	color: theme.palette.info.main,
	backgroundColor: theme.palette.info.light,
	position: 'relative',
}));

const TagText = styled(Typography)`
	display: inline-block;
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;

	${Label}:hover & {
		opacity: 0.5;
	}
`;

const TagValue = styled('span')`
	font-weight: normal;
`;

const CopyButton = styled('span')`
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	display: flex;
	align-items: center;
	justify-content: center;
	color: ${({ theme }) => theme.palette.text.primary};
	user-select: none;
	cursor: pointer;
	visibility: hidden;

	${Label}:hover & {
		visibility: visible;
	}
`;

const FaCopyBase = (props: any) => <FontAwesomeIcon icon={faCopy} {...props} />;

const FaCopy = styled(FaCopyBase)`
	background-color: ${(props) => props.theme.colors.info.light};
	box-shadow: 0 0 1px 3px ${(props) => props.theme.colors.info.light};
`;

const getTagCompositeText = (tag: ResourceTagBase) => {
	let text = tag.tag_key;
	if (tag.value) {
		text = `${text} : ${tag.value}`;
	}
	return text;
};

export interface TagLabelProps extends TypographyProps {
	tag?: ResourceTagBase;
	maxValueLength?: number;
	wrapValue?: boolean;
	showTagKey?: boolean;
	placeholder?: string;
}

export const TagLabel = ({
	tag,
	maxValueLength,
	wrapValue,
	showTagKey = true,
	placeholder = 'no value',
	...restProps
}: TagLabelProps) => {
	const { t } = useTranslation();
	const [showTooltip, setShowTooltip] = React.useState(false);
	if (!tag) {
		return null;
	}

	const compositeTagString = getTagCompositeText(tag);
	const tagCopyValue = showTagKey
		? compositeTagString
		: tag.value || placeholder;
	return (
		<Label onClick={stopEvent} title={compositeTagString} {...restProps}>
			<ClickAwayListener
				onClickAway={() => {
					setShowTooltip(false);
				}}
			>
				<Tooltip open={showTooltip} title={t('actions_messages.copied')}>
					<TagText>
						{showTagKey && tag.tag_key}
						{showTagKey && tag.value && ': '}
						{tag.value && (
							<TagValue style={{ whiteSpace: wrapValue ? 'normal' : 'nowrap' }}>
								{maxValueLength && tag.value.length > maxValueLength
									? `${tag.value.substring(0, maxValueLength)}...`
									: tag.value}
							</TagValue>
						)}
						{!showTagKey && !tag.value && (
							<TagValue>
								<i>{placeholder}</i>
							</TagValue>
						)}
						<CopyButton onClick={() => copyToClipboard(tagCopyValue)}>
							<FaCopy />
						</CopyButton>
					</TagText>
				</Tooltip>
			</ClickAwayListener>
		</Label>
	);
};
