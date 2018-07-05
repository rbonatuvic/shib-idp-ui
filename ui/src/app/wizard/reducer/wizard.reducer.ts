import { Wizard } from '../model';
import { WizardActionUnion, WizardActionTypes } from '../action/wizard.action';

export interface State {
    index: string;
    disabled: boolean;
    definition: Wizard<any>;
    schemaCollection: { [id: string]: any };
}

export const initialState: State = {
    index: null,
    disabled: false,
    definition: null,
    schemaCollection: {}
};

export function reducer(state = initialState, action: WizardActionUnion): State {
    switch (action.type) {
        case WizardActionTypes.ADD_SCHEMA: {
            return {
                ...state,
                schemaCollection: {
                    ...state.schemaCollection,
                    [action.payload.id]: action.payload.schema
                }
            };
        }
        case WizardActionTypes.SET_DISABLED: {
            return {
                ...state,
                disabled: action.payload
            };
        }
        case WizardActionTypes.SET_INDEX: {
            return {
                ...state,
                index: action.payload
            };
        }
        case WizardActionTypes.SET_DEFINITION: {
            return {
                ...state,
                definition: action.payload
            };
        }
        case WizardActionTypes.UPDATE_DEFINITION: {
            const current = state.definition;
            return {
                ...state,
                definition: {
                    ...current,
                    ...action.payload,
                    steps: [
                        ...current.steps,
                        ...action.payload.steps
                    ]
                }
            };
        }
        default: {
            return state;
        }
    }
}

export const getIndex = (state: State) => state.index;
export const getDisabled = (state: State) => state.disabled;
export const getDefinition = (state: State) => state.definition;
export const getCollection = (state: State) => state.schemaCollection;
