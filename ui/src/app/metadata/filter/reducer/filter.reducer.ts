import {
    FilterActionTypes,
    FilterActionsUnion
} from '../action/filter.action';
import {
    SearchActionTypes,
    SearchActionsUnion
} from '../action/search.action';
import { FilterCollectionActionTypes, FilterCollectionActionsUnion } from '../action/collection.action';
import { MetadataFilter, MDUI } from '../../domain/domain.type';

export interface FilterState {
    selected: string | null;
    changes: MetadataFilter | null;
    preview: MDUI | null;
    saving: boolean;
}

export const initialState: FilterState = {
    selected: null,
    changes: null,
    preview: null,
    saving: false
};

export function reducer(state = initialState, action: FilterActionsUnion | SearchActionsUnion | FilterCollectionActionsUnion): FilterState {
    switch (action.type) {
        case FilterActionTypes.SELECT_ID: {
            return {
                ...state,
                selected: action.payload
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
        case FilterCollectionActionTypes.ADD_FILTER:
        case FilterCollectionActionTypes.UPDATE_FILTER_REQUEST: {
            return {
                ...state,
                saving: true
            };
        }
        case FilterCollectionActionTypes.ADD_FILTER_FAIL:
        case FilterCollectionActionTypes.UPDATE_FILTER_FAIL: {
            return {
                ...state,
                saving: false
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

export const getSelected = (state: FilterState) => state.selected;
export const getFilterChanges = (state: FilterState) => state.changes;
export const getPreview = (state: FilterState) => state.preview;
export const getSaving = (state: FilterState) => state.saving;
