import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { MetadataResolver } from '../../domain/model';
import { ResolverCollectionActionsUnion, ResolverCollectionActionTypes } from '../action/collection.action';

export interface CollectionState extends EntityState<MetadataResolver> {
    selectedResolverId: string | null;
}

export function sortByDate(a: MetadataResolver, b: MetadataResolver): number {
    return a.createdDate.localeCompare(b.createdDate);
}

export const adapter: EntityAdapter<MetadataResolver> = createEntityAdapter<MetadataResolver>({
    sortComparer: sortByDate,
    selectId: (model: MetadataResolver) => model.id
});

export const initialState: CollectionState = adapter.getInitialState({
    selectedResolverId: null
});

export function reducer(state = initialState, action: ResolverCollectionActionsUnion): CollectionState {
    switch (action.type) {
        case ResolverCollectionActionTypes.LOAD_RESOLVER_SUCCESS: {
            return adapter.addAll(action.payload, {
                ...state,
                selectedResolverId: state.selectedResolverId
            });
        }

        case ResolverCollectionActionTypes.UPDATE_RESOLVER_SUCCESS: {
            return adapter.updateOne(action.payload, state);
        }

        case ResolverCollectionActionTypes.SELECT_SUCCESS: {
            return adapter.upsertOne(action.payload, {
                ...state,
                selectedResolverId: action.payload.id,
            });
        }

        case ResolverCollectionActionTypes.LOAD_RESOLVER_ERROR: {
            return adapter.removeAll({
                ...state
            });
        }

        case ResolverCollectionActionTypes.REMOVE_RESOLVER_SUCCESS: {
            return adapter.removeOne(action.payload.id, {
                ...state
            });
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
