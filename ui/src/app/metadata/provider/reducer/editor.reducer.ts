import { EditorActionTypes, EditorActionUnion } from '../action/editor.action';

export interface EditorState {
    status: { [key: string]: string };
    schemaPath: string;
    loading: boolean;
    schema: any;
    type: string;
}

export const initialState: EditorState = {
    status: {},
    schemaPath: null,
    loading: false,
    schema: null,
    type: null
};

export function reducer(state = initialState, action: EditorActionUnion): EditorState {
    switch (action.type) {
        case EditorActionTypes.SELECT_PROVIDER_TYPE: {
            return {
                ...state,
                type: action.payload
            };
        }
        case EditorActionTypes.UPDATE_STATUS: {
            return {
                ...state,
                status: {
                    ...state.status,
                    ...action.payload
                }
            };
        }
        case EditorActionTypes.LOAD_SCHEMA_REQUEST: {
            return {
                ...state,
                loading: true,
                schemaPath: action.payload
            };
        }
        case EditorActionTypes.LOAD_SCHEMA_SUCCESS: {
            return {
                ...state,
                loading: false,
                schema: action.payload
            };
        }
        case EditorActionTypes.LOAD_SCHEMA_FAIL: {
            return {
                ...state,
                loading: false,
                schema: initialState.schema
            };
        }
        default: {
            return state;
        }
    }
}

export const getSchema = (state: EditorState) => state.schema;

export const isEditorValid = (state: EditorState) =>
    !Object.keys(state.status).some(key => state.status[key] === ('INVALID'));
export const getFormStatus = (state: EditorState) => state.status;
export const getInvalidForms = (state: EditorState) =>
    Object.keys(state.status).filter(key => state.status[key] === 'INVALID');
