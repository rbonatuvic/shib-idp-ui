import { ConfigurationActionTypes, ConfigurationActionsUnion } from '../action/configuration.action';
import { Metadata } from '../../domain/domain.type';
import { Wizard } from '../../../wizard/model';
import { Schema } from '../model/schema';

export interface State {
    modelType: string;
    modelId: string;
    schema: Schema;
    definition: Wizard<Metadata>;
    xml: string;
    loading: boolean;
}

export const initialState: State = {
    modelType: null,
    modelId: null,
    schema: null,
    definition: null,
    xml: '',
    loading: false
};

export function reducer(state = initialState, action: ConfigurationActionsUnion): State {
    switch (action.type) {
        case ConfigurationActionTypes.SET_SCHEMA:
            return {
                ...state,
                schema: action.payload
            };
        case ConfigurationActionTypes.SET_DEFINITION:
            return {
                ...state,
                definition: action.payload
            };
        case ConfigurationActionTypes.SET_METADATA:
            return {
                ...state,
                modelType: action.payload.type,
                modelId: action.payload.id
            };
        case ConfigurationActionTypes.SET_XML:
            return {
                ...state,
                xml: action.payload
            };
        case ConfigurationActionTypes.CLEAR:
            return {
                ...initialState
            };
        default: {
            return state;
        }
    }
}

export const getModelKind = (state: State) => state.modelType;
export const getModelId = (state: State) => state.modelId;
export const getDefinition = (state: State) => state.definition;
export const getSchema = (state: State) => state.schema;
export const getXml = (state: State) => state.xml;
