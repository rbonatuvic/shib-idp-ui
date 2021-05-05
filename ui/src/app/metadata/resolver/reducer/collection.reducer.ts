import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { MetadataResolver } from '../../domain/model';
import { ResolverCollectionActionsUnion, ResolverCollectionActionTypes } from '../action/collection.action';

export interface CollectionState extends EntityState<MetadataResolver> {
    selectedResolverId: string | null;
    loading: boolean;
}

export function sortByDate(a: MetadataResolver, b: MetadataResolver): number {
    return a.createdDate.localeCompare(b.createdDate);
}

export const adapter: EntityAdapter<MetadataResolver> = createEntityAdapter<MetadataResolver>({
    sortComparer: sortByDate,
    selectId: (model: MetadataResolver) => model.id
});

export const initialState: CollectionState = adapter.getInitialState({
    selectedResolverId: null,
    loading: false
});

export function reducer(state = initialState, action: ResolverCollectionActionsUnion): CollectionState {
    switch (action.type) {
        case ResolverCollectionActionTypes.LOAD_RESOLVER_REQUEST: {
            return {
                ...state,
                loading: true
            };
        }
        case ResolverCollectionActionTypes.LOAD_RESOLVER_SUCCESS: {
            return adapter.addAll(action.payload, {
                ...state,
                loading: false,
                selectedResolverId: state.selectedResolverId
            });
        }

        case ResolverCollectionActionTypes.UPDATE_RESOLVER_SUCCESS: {
            const removed = adapter.removeOne(action.payload.id as string, state);
            const addBack = adapter.upsertOne(action.payload.changes as MetadataResolver, removed);
            return addBack;
        }

        case ResolverCollectionActionTypes.SELECT_SUCCESS: {
            return adapter.upsertOne(action.payload, {
                ...state,
                selectedResolverId: action.payload.id,
            });
        }

        case ResolverCollectionActionTypes.LOAD_RESOLVER_ERROR: {
            return adapter.removeAll({
                ...state,
                loading: false
            });
        }

        case ResolverCollectionActionTypes.REMOVE_RESOLVER_SUCCESS: {
            return adapter.removeOne(action.payload, {
                ...state
            });
        }

        case ResolverCollectionActionTypes.CLEAR_SELECTION: {
            return {
                ...state,
                selectedResolverId: null
            };
        }

        default: {
            return state;
        }
    }
}

export const getSelectedResolverId = (state: CollectionState) => state.selectedResolverId;
export const {
    selectIds: selectResolverIds,
    selectEntities: selectResolverEntities,
    selectAll: selectAllResolvers,
    selectTotal: selectResolverTotal
} = adapter.getSelectors();

export const getResolversLoading = (state: CollectionState) => state.loading;
