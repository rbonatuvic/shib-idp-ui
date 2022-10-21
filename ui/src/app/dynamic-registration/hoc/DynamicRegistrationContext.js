import React from 'react';

import {useDynamicRegistrations, useDynamicRegistration} from '../api';

const initialState = {
    registrations: [],
    selected: null,
};

const DynamicRegistrationContext = React.createContext();

const { Provider, Consumer } = DynamicRegistrationContext;

export const DynamicRegistrationActions = {
    LOAD_REGISTRATIONS: 'load dynamic registrations (list GET)',
    SELECT_REGISTRATION: 'load dynamic registration (single GET)',
    CREATE_REGISTRATION: 'create dynamic registration (POST)',
    UPDATE_REGISTRATION: 'update dynamic registration (PUT)',
    DELETE_REGISTRATION: 'delete dynamic registration (DELETE)'
};

export const loadRegistrations = (payload) => {
    return {
        type: DynamicRegistrationActions.LOAD_REGISTRATIONS,
        payload
    }
}

export const selectRegistration = (payload) => {
    return {
        type: DynamicRegistrationActions.SELECT_REGISTRATION,
        payload
    }
}

export const createRegistration = (payload) => {
    return {
        type: DynamicRegistrationActions.CREATE_REGISTRATION,
        payload
    }
}

export const updateRegistration = (payload) => {
    return {
        type: DynamicRegistrationActions.UPDATE_REGISTRATION,
        payload
    }
}

export const deleteRegistration = (payload) => {
    return {
        type: DynamicRegistrationActions.DELETE_REGISTRATION,
        payload
    }
}

function reducer(state, action) {
    switch (action.type) {
        case DynamicRegistrationActions.LOAD_REGISTRATIONS:
            return {
                ...state,
                registrations: action.payload
            };
        case DynamicRegistrationActions.SELECT_REGISTRATION:
            return {
                ...state,
                selected: action.payload
            };
        default:
            return state;
    }
}

/*eslint-disable react-hooks/exhaustive-deps*/
function DynamicRegistrationsApi({ children, initial = {} }) {
    const [state, dispatch] = React.useReducer(reducer, initialState);
    const contextValue = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);

    const loader = useDynamicRegistrations({
        cachePolicy: 'no-cache'
    });

    const selector = useDynamicRegistration({
        cachePolicy: 'no-cache'
    });

    async function load() {
        const s = await loader.get();
        if (loader.response.ok) {
            dispatch(loadRegistrations(s));
        }
    }

    async function select(id) {
        const s = await selector.get();
        if (selector.response.ok) {
            dispatch(selectRegistration(s));
        }
    }

    async function update(id) {
        /*const s = await selector.update();
        if (selector.response.ok) {
            dispatch(selectRegistration(s));
        }*/
        return Promise.resolve(id);
    }

    async function enable(id) {
        /*const s = await selector.update();
        if (selector.response.ok) {
            dispatch(selectRegistration(s));
        }*/
        return Promise.resolve(id);
    }

    async function create(body) {
        /*const s = await selector.update();
        if (selector.response.ok) {
            dispatch(selectRegistration(s));
        }*/
        return Promise.resolve(body);
    }

    async function remove(id) {
        /*const s = await selector.update();
        if (selector.response.ok) {
            dispatch(selectRegistration(s));
        }*/
        return Promise.resolve(id);
    }

    return (
        <React.Fragment>
            <Provider value={{
                load,
                select,
                update,
                enable,
                create,
                remove,
                ...contextValue
            }}>{children}</Provider>
        </React.Fragment>
    );
}


function useDynamicRegistrationContext () {
    return React.useContext(DynamicRegistrationContext);
}

function useDynamicRegistrationDispatcher () {
    const { dispatch } = useDynamicRegistrationContext();
    return dispatch;
}

function useDynamicRegistrationState () {
    const { state } = useDynamicRegistrationContext();
    return state;
}

function useDynamicRegistrationCollection () {
    const state = useDynamicRegistrationState();
    return state.registrations;
}

function useSelectedDynamicRegistration () {
    const state = useDynamicRegistrationState();
    return state.selected;
}

function useDynamicRegistrationApi () {
    const {load, select, enable, create, update, remove} = useDynamicRegistrationContext();
    return {
        load,
        select,
        enable,
        create,
        update,
        remove
    };
}

export {
    DynamicRegistrationsApi,
    useDynamicRegistrationContext,
    useDynamicRegistrationDispatcher,
    useDynamicRegistrationCollection,
    useSelectedDynamicRegistration,
    useDynamicRegistrationApi,
    Provider as MetadataFormProvider,
    Consumer as MetadataFormConsumer
};