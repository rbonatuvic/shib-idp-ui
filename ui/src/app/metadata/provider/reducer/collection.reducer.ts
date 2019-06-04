import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { ProviderCollectionActionTypes, ProviderCollectionActionsUnion } from '../action/collection.action';
import { MetadataProvider } from '../../domain/model';

export interface CollectionState extends EntityState<MetadataProvider> {
    selectedProviderId: string | null;
    loaded: boolean;
    order: string[];
}

export const adapter: EntityAdapter<MetadataProvider> = createEntityAdapter<MetadataProvider>({
    selectId: (model: MetadataProvider) => model.resourceId
});

export const initialState: CollectionState = adapter.getInitialState({
    selectedProviderId: null,
    loaded: false,
    order: []
});

export function reducer(state = initialState, action: ProviderCollectionActionsUnion): CollectionState {
    switch (action.type) {
        case ProviderCollectionActionTypes.SELECT_PROVIDER_SUCCESS: {
            return {
                ...state,
                selectedProviderId: action.payload.id as string
            };
        }

        case ProviderCollectionActionTypes.LOAD_PROVIDER_SUCCESS: {
            return adapter.addAll(action.payload, {
                ...state,
                selectedProviderId: state.selectedProviderId,
                loaded: true
            });
        }

        case ProviderCollectionActionTypes.UPDATE_PROVIDER_SUCCESS: {
            return adapter.updateOne(action.payload, state);
        }

        case ProviderCollectionActionTypes.GET_ORDER_PROVIDER_SUCCESS: {
            return {
                ...state,
                order: action.payload
            };
        }

        case ProviderCollectionActionTypes.CLEAR_SELECTION: {
            return {
                ...state,
                selectedProviderId: null
            };
        }

        default: {
            return state;
        }
    }
}

export const getSelectedProviderId = (state: CollectionState) => state.selectedProviderId;
export const getIsLoaded = (state: CollectionState) => state.loaded;
export const {
    selectIds: selectProviderIds,
    selectEntities: selectProviderEntities,
    selectAll: selectAllProviders,
    selectTotal: selectProviderTotal
} = adapter.getSelectors();

export const getProviderOrder = (state: CollectionState) => state.order;
