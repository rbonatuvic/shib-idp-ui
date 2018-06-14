import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { FilterCollectionActionTypes, FilterCollectionActionsUnion } from '../action/collection.action';
import { MetadataFilter } from '../../domain/domain.type';

export interface CollectionState extends EntityState<MetadataFilter> {
    selectedFilterId: string | null;
    loaded: boolean;
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
    loaded: false
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

        case FilterCollectionActionTypes.UPDATE_FILTER_SUCCESS: {
            return adapter.updateOne(action.payload, state);
        }

        case FilterCollectionActionTypes.SELECT_FILTER: {
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
export const {
    selectIds: selectFilterIds,
    selectEntities: selectFilterEntities,
    selectAll: selectAllFilters,
    selectTotal: selectFilterTotal
} = adapter.getSelectors();
