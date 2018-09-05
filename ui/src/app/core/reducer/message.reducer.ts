import {
    MessagesActionTypes,
    Actions,

} from '../action/message.action';

export interface MessageState {
    fetching: boolean;
    messages: any;
    error: any;
    language: string;
}

export const initialState: MessageState = {
    fetching: false,
    messages: null,
    error: null,
    language: 'en'
};

export function reducer(state = initialState, action: Actions): MessageState {
    switch (action.type) {
        case MessagesActionTypes.MESSAGES_LOAD_REQUEST: {
            return {
                ...state,
                fetching: true
            };
        }
        case MessagesActionTypes.MESSAGES_LOAD_SUCCESS: {
            return {
                ...state,
                fetching: false,
                messages: action.payload
            };
        }
        case MessagesActionTypes.MESSAGES_LOAD_ERROR: {
            return {
                ...state,
                fetching: false,
                messages: null,
                error: action.payload
            };
        }
        case MessagesActionTypes.SET_LANGUAGE: {
            return {
                ...state,
                language: action.payload
            };
        }
        default: {
            return state;
        }
    }
}


export const getMessages = (state: MessageState) => state.messages;
export const getLanguage = (state: MessageState) => state.language;
export const getError = (state: MessageState) => state.error;
export const isFetching = (state: MessageState) => state.fetching;
