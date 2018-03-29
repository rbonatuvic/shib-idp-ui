import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MetadataProvider } from '../../metadata-provider/model/metadata-provider';
import * as filter from '../action/filter.action';
import * as fromRoot from '../../core/reducer';

export interface FilterState {
    entityIds: string[];
    viewMore: boolean;
    loading: boolean;
    error: Error | null;
    selected: string | null;
    term: string;
    filter: MetadataProvider | null;
}

export const initialState: FilterState = {
    entityIds: [],
    selected: null,
    viewMore: false,
    loading: false,
    error: null,
    term: '',
    filter: null
};

export function reducer(state = initialState, action: filter.Actions): FilterState {
    switch (action.type) {
        case filter.VIEW_MORE_IDS: {
            return {
                ...state,
                viewMore: true
            };
        }
        case filter.SELECT_ID: {
            return {
                ...state,
                selected: action.payload,
                viewMore: false
            };
        }
        case filter.CANCEL_VIEW_MORE: {
            return {
                ...state,
                viewMore: false
            };
        }
        case filter.QUERY_ENTITY_IDS: {
            return {
                ...state,
                loading: true,
                term: action.payload.term
            };
        }
        case filter.LOAD_ENTITY_IDS_SUCCESS: {
            return {
                ...state,
                loading: false,
                error: null,
                entityIds: action.payload
            };
        }
        case filter.LOAD_ENTITY_IDS_ERROR: {
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        }
        case filter.CREATE_FILTER: {
            return {
                ...state,
                filter: action.payload
            };
        }
        case filter.UPDATE_FILTER: {
            return {
                ...state,
                filter: {
                    ...state.filter,
                    ...action.payload
                }
            };
        }
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

export const getViewMore = (state: FilterState) => state.viewMore;
export const getSelected = (state: FilterState) => state.selected;
export const getEntityIds = (state: FilterState) => state.entityIds;
export const getError = (state: FilterState) => state.error;
export const getLoading = (state: FilterState) => state.loading;
export const getTerm = (state: FilterState) => state.term;
export const getFilter = (state: FilterState) => state.filter;
