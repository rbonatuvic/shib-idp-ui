import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { MetadataResolver } from '../../metadata/domain/model';
import { MetadataCollectionActionsUnion, MetadataCollectionActionTypes } from '../action/metadata-collection.action';

export interface CollectionState extends EntityState<MetadataResolver> {
    selectedMetadataId: string | null;
}

export function sortByDate(a: MetadataResolver, b: MetadataResolver): number {
    return a.createdDate.localeCompare(b.createdDate);
}

export const adapter: EntityAdapter<MetadataResolver> = createEntityAdapter<MetadataResolver>({
    sortComparer: sortByDate,
    selectId: (model: MetadataResolver) => model.id
});

export const initialState: CollectionState = adapter.getInitialState({
    selectedMetadataId: null
});

export function reducer(state = initialState, action: MetadataCollectionActionsUnion): CollectionState {
    switch (action.type) {
        case MetadataCollectionActionTypes.LOAD_METADATA_SUCCESS: {
            return adapter.addAll(action.payload, {
                ...state,
                selectedMetadataId: state.selectedMetadataId
            });
        }

        case MetadataCollectionActionTypes.UPDATE_METADATA_SUCCESS: {
            return adapter.updateOne(action.payload, state);
        }

        case MetadataCollectionActionTypes.LOAD_METADATA_ERROR: {
            return adapter.removeAll({
                ...state
            });
        }

        case MetadataCollectionActionTypes.REMOVE_METADATA_SUCCESS: {
            return adapter.removeOne(action.payload, {
                ...state
            });
        }

        default: {
            return state;
        }
    }
}

export const getSelectedMetadataId = (state: CollectionState) => state.selectedMetadataId;
export const {
    selectIds: selectMetadataIds,
    selectEntities: selectMetadataEntities,
    selectAll: selectAllMetadata,
    selectTotal: selectMetadataTotal
} = adapter.getSelectors();
