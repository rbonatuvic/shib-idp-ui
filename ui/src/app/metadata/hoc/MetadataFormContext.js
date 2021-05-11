import React from 'react';

import uniq from 'lodash/uniq';
import intersection from 'lodash/intersection';

import { MetadataDefinitionContext } from './MetadataSchema';
import { MetadataObjectContext } from './MetadataSelector';


const initialState = {
    metadata: {},
    errors: []
};

const MetadataFormContext = React.createContext();

const { Provider, Consumer } = MetadataFormContext;

export const MetadataFormActions = {
    SET_FORM_ERROR: 'set form error',
    SET_FORM_DATA: 'set form data'
};

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
                errors: action.payload.errors
            };
        case MetadataFormActions.SET_FORM_DATA:
            return {
                ...state,
                metadata: action.payload
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

    return errors;
}

function usePagesWithErrors(definition) {
    const errorList = useFormErrors();
    const erroredProperties = uniq(errorList.map((e) => {
        let name = e.property.split('.').filter((p) => !!p && p !== "")[0];
        if (name.indexOf('[')) {
            name = name.split('[')[0];
        }
        return name;
    }));

    const pages = definition.steps.reduce((list, step) => {
        const intersectionFields = intersection(step.fields, erroredProperties);
        if (intersectionFields.length > 0) {
            list = [...list, step.id];
        }
        return list;
    }, []);

    return pages;
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