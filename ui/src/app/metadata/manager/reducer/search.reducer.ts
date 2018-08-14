import * as searchActions from '../action/search.action';
import { MetadataEntity } from '../../domain/model';

export interface SearchState {
    entities: MetadataEntity[];
    loading: boolean;
    query: string;
}

const initialState: SearchState = {
    entities: [],
    loading: false,
    query: ''
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

        case searchActions.ENTITY_SEARCH_COMPLETE: {
            return {
                entities: action.payload,
                loading: false,
                query: state.query
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
