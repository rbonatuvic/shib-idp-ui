import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { MetadataResolver } from '../../domain/model';
import { ProviderCollectionActionsUnion, ProviderCollectionActionTypes } from '../action/collection.action';

export interface CollectionState extends EntityState<MetadataResolver> {
    selectedProviderId: string | null;
}

export function sortByDate(a: MetadataResolver, b: MetadataResolver): number {
    return a.createdDate.localeCompare(b.createdDate);
}

export const adapter: EntityAdapter<MetadataResolver> = createEntityAdapter<MetadataResolver>({
    sortComparer: sortByDate,
    selectId: (model: MetadataResolver) => model.id
});

export const initialState: CollectionState = adapter.getInitialState({
    selectedProviderId: null
});

export function reducer(state = initialState, action: ProviderCollectionActionsUnion): CollectionState {
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

export const getSelectedProviderId = (state: CollectionState) => state.selectedProviderId;
export const {
    selectIds: selectProviderIds,
    selectEntities: selectProviderEntities,
    selectAll: selectAllProviders,
    selectTotal: selectProviderTotal
} = adapter.getSelectors();
