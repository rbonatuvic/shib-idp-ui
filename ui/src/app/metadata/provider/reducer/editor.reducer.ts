import { EditorActionTypes, EditorActionUnion } from '../action/editor.action';

export interface EditorState {
    status: { [key: string]: string };
    type: string;
}

export const initialState: EditorState = {
    status: {},
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
        case EditorActionTypes.CLEAR: {
            return {
                ...initialState
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
        default: {
            return state;
        }
    }
}



export const isEditorValid = (state: EditorState) =>
    !Object.keys(state.status).some(key => state.status[key] === ('INVALID'));
export const getFormStatus = (state: EditorState) => state.status;
export const getInvalidForms = (state: EditorState) =>
    Object.keys(state.status).filter(key => state.status[key] === 'INVALID');
