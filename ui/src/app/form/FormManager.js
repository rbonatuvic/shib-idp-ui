import React from 'react';

const initialState = {
    data: {},
    errors: []
};

const FormContext = React.createContext();

const { Provider, Consumer } = FormContext;

export const FormActions = {
    SET_FORM_ERROR: 'set form error',
    SET_FORM_DATA: 'set form data'
};

export const setFormDataAction = (payload) => {
    return {
        type: FormActions.SET_FORM_DATA,
        payload
    }
}

export const setFormErrorAction = (errors) => {
    return {
        type: FormActions.SET_FORM_ERROR,
        payload: errors
    }
}

function reducer(state, action) {
    switch (action.type) {
        
        case FormActions.SET_FORM_ERROR:
            return {
                ...state,
                errors: action.payload
            };
        case FormActions.SET_FORM_DATA:
            return {
                ...state,
                data: action.payload
            };
        default:
            return state;
    }
}

/*eslint-disable react-hooks/exhaustive-deps*/
function FormManager({ children, initial = {} }) {

    const data = {
        ...initial
    };

    const [state, dispatch] = React.useReducer(reducer, {
        ...initialState,
        data
    });
    const contextValue = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);

    return (
        <React.Fragment>
            <Provider value={contextValue}>{children(state.data, state.errors)}</Provider>
        </React.Fragment>
    );
}

function useFormErrors() {
    const { state } = React.useContext(FormContext);
    const { errors } = state;

    return errors;
}

function useFormContext() {
    return React.useContext(FormContext);
}

function useFormDispatcher() {
    const { dispatch } = useFormContext();
    return dispatch;
}

function useFormState() {
    const { state } = useFormContext();
    return state;
}

function useFormData() {
    const { data } = useFormContext();
    return data;
}

export {
    useFormErrors,
    useFormContext,
    useFormDispatcher,
    useFormState,
    useFormData,
    FormManager,
    FormContext,
    Provider as FormProvider,
    Consumer as FormConsumer
};