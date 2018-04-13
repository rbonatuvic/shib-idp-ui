import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as filter from '../action/filter.action';
import * as collection from '../../domain/action/filter-collection.action';
import * as fromRoot from '../../core/reducer';
import { MetadataFilter } from '../../domain/domain.type';

export interface FilterState {
    selected: string | null;
    changes: MetadataFilter | null;
}

export const initialState: FilterState = {
    selected: null,
    changes: null
};

export function reducer(state = initialState, action: filter.Actions | collection.Actions): FilterState {
    switch (action.type) {
        case filter.SELECT_ID: {
            return {
                ...state,
                selected: action.payload
            };
        }
        case filter.CREATE_FILTER: {
            return {
                ...state,
                changes: action.payload
            };
        }
        case filter.UPDATE_FILTER: {
            return {
                ...state,
                changes: {
                    ...state.changes,
                    ...action.payload
                }
            };
        }
        case collection.ADD_FILTER_SUCCESS:
        case collection.UPDATE_FILTER_SUCCESS:
        case filter.CANCEL_CREATE_FILTER: {
            return {
                ...initialState
            };
        }
        default: {
            return state;
        }
    }
}

export const getSelected = (state: FilterState) => state.selected;
export const getFilterChanges = (state: FilterState) => state.changes;
