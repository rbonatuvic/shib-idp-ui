import { SearchActionTypes, SearchActionUnion, SearchIds, SearchIdsSuccess, SearchIdsError } from '../action/search.action';
import { MetadataProvider } from '../../domain/domain.type';

export interface SearchState {
    query: string;
    matches: string[];
    searching: boolean;
}

export const initialState: SearchState = {
    query: '',
    matches: [],
    searching: false
};

export function reducer(state = initialState, action: SearchActionUnion): SearchState {
    switch (action.type) {
        case SearchActionTypes.SEARCH_IDS: {
            return {
                ...state,
                query: action.payload,
                searching: true
            };
        }
        case SearchActionTypes.SEARCH_IDS_SUCCESS: {
            return {
                ...state,
                searching: false,
                matches: action.payload
            };
        }
        case SearchActionTypes.SEARCH_IDS_ERROR: {
            return {
                ...state,
                searching: false,
                matches: []
            };
        }
        default: {
            return state;
        }
    }
}

export const getQuery = (state: SearchState) => state.query;
export const getMatches = (state: SearchState) => state.matches;
export const getSearching = (state: SearchState) => state.searching;
