import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MetadataProvider } from '../../metadata-provider/model/metadata-provider';
import * as filter from '../action/filter.action';
import * as fromRoot from '../../core/reducer';

export interface CollectionState {
    filters: MetadataProvider[];
}

export const initialState: CollectionState = {
    filters: []
};

export function reducer(state = initialState, action: filter.Actions): CollectionState {
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

export const getFilters = (state: CollectionState) => state.filters;
