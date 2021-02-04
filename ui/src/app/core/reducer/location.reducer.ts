import { LocationActionUnion, LocationActionTypes } from '../action/location.action';

export interface LocationState {
    title: string;
}

export const initialState: LocationState = {
    title: ''
};

export function reducer(state = initialState, action: LocationActionUnion): LocationState {
    switch (action.type) {
        case LocationActionTypes.SET_TITLE:
            return {
                ...state,
                title: action.payload
            };
        default:
            return state;
    }
}

export const getTitle = (state: LocationState) => state.title;
