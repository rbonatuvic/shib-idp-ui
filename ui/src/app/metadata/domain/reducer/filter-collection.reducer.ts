import { createSelector, createFeatureSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import * as filter from '../action/filter-collection.action';
import { FilterCollectionActionTypes, FilterCollectionActionsUnion } from '../action/filter-collection.action';
import { MetadataFilter } from '../domain.type';

export interface FilterCollectionState extends EntityState<MetadataFilter> {
    selectedFilterId: string | null;
    loaded: boolean;
}

export function sortByDate(a: MetadataFilter, b: MetadataFilter): number {
    return a.createdDate.localeCompare(b.createdDate);
}

export const adapter: EntityAdapter<MetadataFilter> = createEntityAdapter<MetadataFilter>({
    sortComparer: sortByDate,
    selectId: (model: MetadataFilter) => model.id
});

export const initialState: FilterCollectionState = adapter.getInitialState({
    selectedFilterId: null,
    loaded: false
});

export function reducer(state = initialState, action: FilterCollectionActionsUnion): FilterCollectionState {
    switch (action.type) {
        case FilterCollectionActionTypes.LOAD_FILTER_SUCCESS: {
            return adapter.addAll(action.payload, {
                ...state,
                selectedFilterId: state.selectedFilterId,
                loaded: true
            });
        }

        case FilterCollectionActionTypes.UPDATE_FILTER_SUCCESS: {
            return adapter.updateOne(action.payload, state);
        }

        case FilterCollectionActionTypes.SELECT: {
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

export const getSelectedFilterId = (state: FilterCollectionState) => state.selectedFilterId;
export const getIsLoaded = (state: FilterCollectionState) => state.loaded;
export const {
    selectIds: selectFilterIds,
    selectEntities: selectFilterEntities,
    selectAll: selectAllFilters,
    selectTotal: selectFilterTotal
} = adapter.getSelectors();
