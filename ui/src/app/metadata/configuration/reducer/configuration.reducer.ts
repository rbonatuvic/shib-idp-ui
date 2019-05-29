import { ConfigurationActionTypes, ConfigurationActionsUnion } from '../action/configuration.action';
import { Metadata } from '../../domain/domain.type';
import { Wizard, WizardStep } from '../../../wizard/model';
import { Schema } from '../model/schema';

export interface State {
    model: Metadata;
    schema: Schema;
    definition: Wizard<Metadata>;
}

export const initialState: State = {
    model: null,
    schema: null,
    definition: null
};

export function reducer(state = initialState, action: ConfigurationActionsUnion): State {
    switch (action.type) {
        case ConfigurationActionTypes.SET_SCHEMA:
            return {
                ...state,
                schema: action.payload
            };
            break;
        case ConfigurationActionTypes.SET_DEFINITION:
            return {
                ...state,
                definition: action.payload
            };
            break;
        case ConfigurationActionTypes.SET_METADATA:
            return {
                ...state,
                model: action.payload
            };
            break;
        case ConfigurationActionTypes.CLEAR:
            return {
                ...initialState
            };
            break;
        default: {
            return state;
        }
    }
}

export const getModel = (state: State) => state.model;
export const getDefinition = (state: State) => state.definition;
export const getSchema = (state: State) => state.schema;
