import React from 'react';


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
        default:
            return state;
    }
}

/*eslint-disable react-hooks/exhaustive-deps*/
function DynamicRegistrationsApi({ children, initial = {} }) {

    const [contextValue, setContextValue] = React.useState({...initialState});

    return (
        <React.Fragment>
            <Provider value={contextValue}>{children}</Provider>
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

export {
    DynamicRegistrationsApi,
    useDynamicRegistrationContext,
    useDynamicRegistrationDispatcher,
    Provider as MetadataFormProvider,
    Consumer as MetadataFormConsumer
};