import type { CheckedState } from '../components/Table/utils';
import type { RJSTAction } from '../schemaOps';
import { useQuery } from '@tanstack/react-query';

export const LOADING_DISABLED_REASON = 'Loading';

interface ActionContentProps<T> {
	action: RJSTAction<T>;
	affectedEntries: T[] | undefined;
	checkedState?: CheckedState;
	getDisabledReason: RJSTAction<T>['isDisabled'];
	onDisabledReady: (arg: string | null) => void;
}

// This component sole purpose is to have the useQuery being called exactly once per item,
// so that it satisfies React hooks assumption that the number of hook calls inside each component
// stays the same across renders.
export const ActionContent = <T extends object>({
	action,
	children,
	affectedEntries,
	checkedState,
	getDisabledReason,
	onDisabledReady,
}: React.PropsWithChildren<ActionContentProps<T>>) => {
	useQuery({
		queryKey: ['actionContent', action.title, affectedEntries, checkedState],
		queryFn: async () => {
			const disabled =
				(await getDisabledReason?.({
					affectedEntries,
					checkedState,
				})) ?? null;
			onDisabledReady(disabled);
			return disabled;
		},
	});
	return children;
};
