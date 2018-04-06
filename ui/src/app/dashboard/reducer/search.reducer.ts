import * as searchActions from '../action/search.action';
import { MetadataProvider } from '../../domain/model/metadata-provider';
import { MetadataFilter } from '../../domain/model/metadata-filter';

export interface SearchState {
    entities: (MetadataProvider | MetadataFilter)[];
    loading: boolean;
    query: string;
    type: string;
}

const initialState: SearchState = {
    entities: [],
    loading: false,
    query: '',
    type: 'all'
};

export function reducer(state = initialState, action: searchActions.Actions): SearchState {
    switch (action.type) {
        case searchActions.ENTITY_SEARCH: {
            return {
                ...state,
                query: action.payload,
                loading: true,
            };
        }

        case searchActions.ENTITY_FILTER: {
            return {
                ...state,
                type: action.payload,
                loading: true
            };
        }

        case searchActions.ENTITY_SEARCH_COMPLETE: {
            return {
                entities: action.payload,
                loading: false,
                query: state.query,
                type: state.type
            };
        }

        default: {
            return state;
        }
    }
}

export const getEntities = (state: SearchState) => state.entities;

export const getQuery = (state: SearchState) => state.query;

export const getLoading = (state: SearchState) => state.loading;

export const getFilter = (state: SearchState) => state.type;