import * as manager from '../action/manager.action';

export interface State {
    resolversOpen: {[key: string]: boolean};
}

export const initialState: State = {
    resolversOpen: {}
};

export function reducer(state = initialState, action: manager.Actions): State {
    switch (action.type) {
        case manager.TOGGLE_ENTITY_DISPLAY: {
            return Object.assign({}, state, {
                providersOpen: {
                    ...state.resolversOpen,
                    ...{[action.payload]: !state.resolversOpen[action.payload]}
                }
            });
        }
        default: {
            // console.log(state);
            return state;
        }
    }
}

export const resolversOpen = (state: State) => state.resolversOpen;
