import { ConfigurationActionUnion, ConfigurationActionTypes } from '../action/configuration.action';

export interface ConfigState {
    roles: string[];
}

export const initialState: ConfigState = {
    roles: []
};

export function reducer(state = initialState, action: ConfigurationActionUnion): ConfigState {
    switch (action.type) {
        case ConfigurationActionTypes.LOAD_ROLE_SUCCESS: {
            return {
                roles: [...action.payload]
            };
        }
        default: {
            return state;
        }
    }
}


export const getRoles = (state: ConfigState) => state.roles;
