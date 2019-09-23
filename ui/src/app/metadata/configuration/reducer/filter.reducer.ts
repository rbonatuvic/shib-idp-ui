import { FilterCompareActionTypes, FilterCompareActionsUnion } from '../action/filter.action';
import { Metadata } from '../../domain/domain.type';
import { FormDefinition } from '../../../wizard/model';
import { Schema } from '../model/schema';
import { FilterVersion } from '../model/version';

export interface State {
    models: FilterVersion[];
    modelType: string;
    modelId: string;
    schema: Schema;
    definition: FormDefinition<FilterVersion>;
    loading: boolean;
}

export const initialState: State = {
    models: null,
    modelType: null,
    modelId: null,
    schema: null,
    definition: null,
    loading: false
};

export function reducer(state = initialState, action: FilterCompareActionsUnion): State {
    switch (action.type) {
        case FilterCompareActionTypes.SET_SCHEMA:
            return {
                ...state,
                schema: action.payload
            };
        case FilterCompareActionTypes.SET_DEFINITION:
            return {
                ...state,
                definition: action.payload
            };
        case FilterCompareActionTypes.COMPARE_FILTERS:
            return {
                ...state,
                ...action.payload
            };
        case FilterCompareActionTypes.CLEAR:
            return {
                ...initialState
            };
        default: {
            return state;
        }
    }
}

export const getModels = (state: State) => state.models;
export const getModelType = (state: State) => state.modelType;
export const getModelId = (state: State) => state.modelId;
export const getDefinition = (state: State) => state.definition;
export const getSchema = (state: State) => state.schema;
export const getLoading = (state: State) => state.loading;
