import { FilterActionsUnion, FilterActionTypes } from '../action/filter.action';
import { SearchActionsUnion, SearchActionTypes } from '../action/search.action';
import { FilterCollectionActionTypes, FilterCollectionActionsUnion } from '../action/collection.action';

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

export function reducer(state = initialState, action: SearchActionsUnion | FilterActionsUnion | FilterCollectionActionsUnion): SearchState {
    switch (action.type) {
        case SearchActionTypes.VIEW_MORE_IDS: {
            return {
                ...state,
                viewMore: true
            };
        }
        case SearchActionTypes.CANCEL_VIEW_MORE: {
            return {
                ...state,
                viewMore: false
            };
        }
        case SearchActionTypes.QUERY_ENTITY_IDS: {
            return {
                ...state,
                loading: true,
                term: action.payload.term
            };
        }
        case SearchActionTypes.LOAD_ENTITY_IDS_SUCCESS: {
            return {
                ...state,
                loading: false,
                error: null,
                entityIds: action.payload
            };
        }
        case SearchActionTypes.LOAD_ENTITY_IDS_ERROR: {
            return {
                ...state,
                loading: false,
                error: action.payload
            };
        }
        case FilterCollectionActionTypes.ADD_FILTER_SUCCESS:
        case FilterCollectionActionTypes.UPDATE_FILTER_SUCCESS:
        case SearchActionTypes.CLEAR_SEARCH:
        case FilterActionTypes.CANCEL_CREATE_FILTER: {
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
