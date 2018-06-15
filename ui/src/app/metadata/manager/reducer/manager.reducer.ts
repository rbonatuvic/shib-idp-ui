import * as manager from '../action/manager.action';

export interface State {
    providersOpen: {[key: string]: boolean};
}

export const initialState: State = {
    providersOpen: {}
};

export function reducer(state = initialState, action: manager.Actions): State {
    switch (action.type) {
        case manager.TOGGLE_ENTITY_DISPLAY: {
            return Object.assign({}, state, {
                providersOpen: {
                    ...state.providersOpen,
                    ...{[action.payload]: !state.providersOpen[action.payload]}
                }
            });
        }
        default: {
            // console.log(state);
            return state;
        }
    }
}

export const providersOpen = (state: State) => state.providersOpen;
