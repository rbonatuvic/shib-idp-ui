import React from 'react';
import { MetadataDefinitionContext } from './MetadataSchema';
import { MetadataObjectContext } from './MetadataSelector';

const initialState = {
    metadata: {},
    errors: {}
};

const MetadataFormContext = React.createContext();

const { Provider, Consumer } = MetadataFormContext;

export const MetadataFormActions = {
    SET_FORM_ERROR: 'set form error',
    SET_FORM_DATA: 'set form data'
};

export const updateFormDataAction = (payload) => {
    return {
        type: MetadataFormActions.UPDATE_FORM_DATA,
        payload
    }
}

export const setFormDataAction = (payload) => {
    return {
        type: MetadataFormActions.SET_FORM_DATA,
        payload
    }
}

export const setFormErrorAction = (page, errors) => {
    return {
        type: MetadataFormActions.SET_FORM_ERROR,
        payload: {
            page,
            errors
        }
    }
}

function reducer(state, action) {
    switch (action.type) {
        case MetadataFormActions.SET_FORM_ERROR:
            return {
                ...state,
                errors: {
                    ...state.errors,
                    [action.payload.page]: action.payload.errors
                }
            };
        case MetadataFormActions.SET_FORM_DATA:
            return {
                ...state,
                metadata: action.payload
            };
        case MetadataFormActions.UPDATE_FORM_DATA:
            return {
                ...state,
                metadata: action.payload.metadata,
                errors: {
                    ...action.payload.errors
                }
            };
        default:
            return state;
    }
}

/*eslint-disable react-hooks/exhaustive-deps*/
function MetadataForm({ children }) {

    const metadata = useFormattedMetadata();

    const [state, dispatch] = React.useReducer(reducer, {
        ...initialState,
        metadata
    });

    const contextValue = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);

    return (
        <Provider value={contextValue}>{children}</Provider>
    );
}

function useFormErrors () {
    const { state } = React.useContext(MetadataFormContext);
    const { errors } = state;

    console.log(errors)

    return errors;
}

function usePagesWithErrors() {
    const errors = useFormErrors();

    return Object.keys(errors).filter(p => errors[p] && Array.isArray(errors[p]) && errors[p].length > 0);
}

function useFormattedMetadata() {
    const definition = React.useContext(MetadataDefinitionContext);
    return definition.formatter(React.useContext(MetadataObjectContext))
}

export {
    usePagesWithErrors,
    useFormErrors,
    useFormattedMetadata,
    MetadataForm,
    MetadataFormContext,
    Provider as MetadataFormProvider,
    Consumer as MetadataFormConsumer
};