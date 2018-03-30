import * as searchActions from '../action/search.action';
import { MetadataProvider } from '../../domain/model/metadata-provider';

export interface SearchState {
    entities: MetadataProvider[];
    loading: boolean;
    query: string;
}

const initialState: SearchState = {
    entities: [],
    loading: false,
    query: '',
};

export function reducer(state = initialState, action: searchActions.Actions): SearchState {
    switch (action.type) {
        case searchActions.PROVIDER_SEARCH: {
            const query = action.payload;

            return {
                ...state,
                query,
                loading: true,
            };
        }

        case searchActions.PROVIDER_SEARCH_COMPLETE: {
            return {
                entities: action.payload,
                loading: false,
                query: state.query,
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
