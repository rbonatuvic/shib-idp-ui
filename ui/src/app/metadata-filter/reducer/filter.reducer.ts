import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MetadataProvider } from '../../metadata-provider/model/metadata-provider';
import * as filter from '../action/collection.action';
import * as fromRoot from '../../core/reducer';

export interface FilterState {
    entityIds: string[];
    loading: boolean;
    error: string | null;
}

export const initialState: FilterState = {
    entityIds: [],
    loading: false,
    error: null
};

export function reducer(state = initialState, action: filter.Actions): FilterState {
    switch (action.type) {
        default: {
            return state;
        }
    }
}
