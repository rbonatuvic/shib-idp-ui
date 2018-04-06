import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MetadataProvider } from '../../domain/model/metadata-provider';
import * as filter from '../action/filter-collection.action';
import * as fromRoot from '../../core/reducer';
import { MetadataFilter } from '../domain.type';

export interface FilterCollectionState {
    filters: MetadataFilter[];
}

export const initialState: FilterCollectionState = {
    filters: []
};

export function reducer(state = initialState, action: filter.Actions): FilterCollectionState {
    switch (action.type) {
        case filter.SAVE_FILTER_SUCCESS: {
            return {
                filters: [
                    ...state.filters,
                    action.payload
                ]
            };
        }
        default: {
            return state;
        }
    }
}

export const getFilters = (state: FilterCollectionState) => state.filters;
