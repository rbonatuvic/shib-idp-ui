import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as search from '../action/search.action';
import * as filter from '../action/filter.action';
import * as fromRoot from '../../core/reducer';
import { MetadataFilter } from '../../domain/domain.type';
import { FilterCollectionActionTypes, FilterCollectionActionsUnion } from '../../domain/action/filter-collection.action';

export interface SearchState {
    entityIds: string[];
    viewMore: boolean;
    loading: boolean;
    error: Error | null;
    term: string;
}

export const initialState: SearchState = {
    entityIds: [],
    viewMore: false,
    loading: false,
    error: null,
    term: '',
};

export function reducer(state = initialState, action: search.Actions | filter.Actions | FilterCollectionActionsUnion): SearchState {
    switch (action.type) {
        case search.VIEW_MORE_IDS: {
            return {
                ...state,
                viewMore: true
            };
        }
        case search.CANCEL_VIEW_MORE: {
            return {
                ...state,
                viewMore: false
            };
        }
        case search.QUERY_ENTITY_IDS: {
            return {
                ...state,
                loading: true,
                term: action.payload.term
            };
        }
        case search.LOAD_ENTITY_IDS_SUCCESS: {
            return {
                ...state,
                loading: false,
                error: null,
                entityIds: action.payload
            };
        }
        case search.LOAD_ENTITY_IDS_ERROR: {
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        }
        case FilterCollectionActionTypes.ADD_FILTER_SUCCESS:
        case FilterCollectionActionTypes.UPDATE_FILTER_SUCCESS:
        case search.CLEAR_SEARCH:
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

export const getViewMore = (state: SearchState) => state.viewMore;
export const getEntityIds = (state: SearchState) => state.entityIds;
export const getError = (state: SearchState) => state.error;
export const getLoading = (state: SearchState) => state.loading;
export const getTerm = (state: SearchState) => state.term;
