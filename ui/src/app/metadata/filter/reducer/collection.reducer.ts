import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { FilterCollectionActionTypes, FilterCollectionActionsUnion } from '../action/collection.action';
import { MetadataFilter } from '../../domain/model';

export interface CollectionState extends EntityState<MetadataFilter> {
    selectedFilterId: string | null;
    loaded: boolean;
    saving: boolean;
}

export function sortByDate(a: MetadataFilter, b: MetadataFilter): number {
    return a.createdDate.localeCompare(b.createdDate);
}

export const adapter: EntityAdapter<MetadataFilter> = createEntityAdapter<MetadataFilter>({
    sortComparer: sortByDate,
    selectId: (model: MetadataFilter) => model.resourceId
});

export const initialState: CollectionState = adapter.getInitialState({
    selectedFilterId: null,
    loaded: false,
    saving: false
});

export function reducer(state = initialState, action: FilterCollectionActionsUnion): CollectionState {
    switch (action.type) {
        case FilterCollectionActionTypes.LOAD_FILTER_SUCCESS: {
            let s = adapter.addAll(action.payload, {
                ...state,
                selectedFilterId: state.selectedFilterId,
                loaded: true
            });
            return s;
        }

        case FilterCollectionActionTypes.SELECT_FILTER_SUCCESS: {
            return adapter.addOne(action.payload, {
                ...state,
                selectedFilterId: action.payload.resourceId
            });
        }

        case FilterCollectionActionTypes.ADD_FILTER_REQUEST:
        case FilterCollectionActionTypes.UPDATE_FILTER_REQUEST: {
            return {
                ...state,
                saving: true
            };
        }

        case FilterCollectionActionTypes.UPDATE_FILTER_SUCCESS: {
            return adapter.updateOne(action.payload, {
                ...state,
                saving: false
            });
        }

        case FilterCollectionActionTypes.ADD_FILTER_SUCCESS:
        case FilterCollectionActionTypes.ADD_FILTER_FAIL:
        case FilterCollectionActionTypes.REMOVE_FILTER_FAIL:
        case FilterCollectionActionTypes.UPDATE_FILTER_FAIL: {
            return {
                ...state,
                saving: false
            };
        }

        case FilterCollectionActionTypes.REMOVE_FILTER_SUCCESS: {
            return adapter.removeOne(action.payload, {
                ...state,
                saving: false
            });
        }

        case FilterCollectionActionTypes.REMOVE_FILTER_REQUEST: {
            return {
                ...state,
                saving: true
            };
        }

        case FilterCollectionActionTypes.SELECT_FILTER_REQUEST: {
            return {
                ...state,
                selectedFilterId: action.payload,
            };
        }

        default: {
            return state;
        }
    }
}

export const getSelectedFilterId = (state: CollectionState) => state.selectedFilterId;
export const getIsLoaded = (state: CollectionState) => state.loaded;
export const getIsSaving = (state: CollectionState) => state.saving;
export const {
    selectIds: selectFilterIds,
    selectEntities: selectFilterEntities,
    selectAll: selectAllFilters,
    selectTotal: selectFilterTotal
} = adapter.getSelectors();
