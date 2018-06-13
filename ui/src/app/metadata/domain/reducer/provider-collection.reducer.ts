import { createSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { MetadataProvider } from '../../domain/model/provider';
import * as provider from '../action/provider-collection.action';
import { ProviderCollectionActionsUnion, ProviderCollectionActionTypes } from '../action/provider-collection.action';

export interface ProviderCollectionState extends EntityState<MetadataProvider> {
    selectedProviderId: string | null;
}

export function sortByDate(a: MetadataProvider, b: MetadataProvider): number {
    return a.createdDate.localeCompare(b.createdDate);
}

export const adapter: EntityAdapter<MetadataProvider> = createEntityAdapter<MetadataProvider>({
    sortComparer: sortByDate,
    selectId: (model: MetadataProvider) => model.id
});

export const initialState: ProviderCollectionState = adapter.getInitialState({
    selectedProviderId: null
});

export function reducer(state = initialState, action: provider.ProviderCollectionActionsUnion): ProviderCollectionState {
    switch (action.type) {
        case ProviderCollectionActionTypes.LOAD_PROVIDER_SUCCESS: {
            return adapter.addAll(action.payload, {
                ...state,
                selectedProviderId: state.selectedProviderId
            });
        }

        case ProviderCollectionActionTypes.UPDATE_PROVIDER_SUCCESS: {
            return adapter.updateOne(action.payload, state);
        }

        case ProviderCollectionActionTypes.SELECT: {
            return {
                ...state,
                selectedProviderId: action.payload,
            };
        }

        default: {
            return state;
        }
    }
}

export const getSelectedProviderId = (state: ProviderCollectionState) => state.selectedProviderId;
export const {
    selectIds: selectProviderIds,
    selectEntities: selectProviderEntities,
    selectAll: selectAllProviders,
    selectTotal: selectProviderTotal
} = adapter.getSelectors();
