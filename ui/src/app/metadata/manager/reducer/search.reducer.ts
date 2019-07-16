import { DashboardSearchActionTypes, DashboardSearchActionsUnion } from '../action/search.action';
import { Metadata } from '../../domain/domain.type';

export interface SearchState {
    entities: Metadata[];
    loading: boolean;
    query: string;
}

const initialState: SearchState = {
    entities: [],
    loading: false,
    query: ''
};

export function reducer(state = initialState, action: DashboardSearchActionsUnion): SearchState {
    switch (action.type) {
        case DashboardSearchActionTypes.ENTITY_SEARCH: {
            return {
                ...state,
                query: action.payload.query,
                loading: true,
            };
        }

        case DashboardSearchActionTypes.ENTITY_SEARCH_COMPLETE: {
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
