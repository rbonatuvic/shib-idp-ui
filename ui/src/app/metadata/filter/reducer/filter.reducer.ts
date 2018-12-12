import {
    FilterActionTypes,
    FilterActionsUnion
} from '../action/filter.action';
import { MetadataFilter, MDUI } from '../../domain/model';

export interface FilterState {
    selected: string | null;
    changes: MetadataFilter | null;
    preview: MDUI | null;
}

export const initialState: FilterState = {
    selected: null,
    changes: null,
    preview: null
};

export function reducer(state = initialState, action: FilterActionsUnion): FilterState {
    switch (action.type) {
        case FilterActionTypes.SELECT_ID: {
            return {
                ...state,
                selected: action.payload
            };
        }
        case FilterActionTypes.SELECT_FILTER_TYPE: {
            return {
                ...state,
                changes: <MetadataFilter>{
                    type: action.payload
                }
            };
        }
        case FilterActionTypes.LOAD_ENTITY_PREVIEW_SUCCESS: {
            return {
                ...state,
                preview: action.payload
            };
        }
        case FilterActionTypes.UPDATE_FILTER: {
            return {
                ...state,
                changes: {
                    ...state.changes,
                    ...action.payload
                }
            };
        }
        case FilterActionTypes.CLEAR_FILTER:
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

export const getSelected = (state: FilterState) => state.selected;
export const getFilterChanges = (state: FilterState) => state.changes;
export const getPreview = (state: FilterState) => state.preview;
