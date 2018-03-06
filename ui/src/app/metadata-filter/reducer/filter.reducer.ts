import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MetadataProvider } from '../../metadata-provider/model/metadata-provider';
import * as filter from '../action/filter.action';
import * as fromRoot from '../../core/reducer';

export interface FilterState {
    entityIds: string[];
}

export const initialState: FilterState = {
    entityIds: []
};

export function reducer(state = initialState, action: filter.Actions): FilterState {
    switch (action.type) {
        default: {
            return state;
        }
    }
}
