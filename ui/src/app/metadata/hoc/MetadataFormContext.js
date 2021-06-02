import React from 'react';

import uniq from 'lodash/uniq';
import intersection from 'lodash/intersection';

import { MetadataDefinitionContext, MetadataSchemaContext } from './MetadataSchema';
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

export const setFormErrorAction = (errors) => {
    return {
        type: MetadataFormActions.SET_FORM_ERROR,
        payload: errors
    }
}

function reducer(state, action) {
    switch (action.type) {
        case MetadataFormActions.SET_FORM_ERROR:
            return {
                ...state,
                errors: action.payload
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
function MetadataForm({ children, initial = {} }) {

    const [state, dispatch] = React.useReducer(
        reducer,
        initialState
    );

    const base = useFormattedMetadata(initial);

    React.useEffect(() => {
        dispatch(setFormDataAction(base))
        dispatch(setFormErrorAction(initialState.errors))
    }, [initial])

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

function useExtraErrors (metadata, validator) {
    return validator(metadata);
}

function usePagesWithErrors(definition) {
    const errorList = useFormErrors();
    const erroredProperties = uniq(errorList.map((e) => {
        if (!e.hasOwnProperty('property')) {
            return 'common';
        }
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

function useFormattedMetadata(initial = {}) {
    const definition = React.useContext(MetadataDefinitionContext);
    const schema = React.useContext(MetadataSchemaContext);
    const obj = React.useContext(MetadataObjectContext);
    return definition.formatter(initial ? initial : obj, schema);
}

function useMetadataFormContext () {
    return React.useContext(MetadataFormContext);
}

function useMetadataFormDispatcher () {
    const { dispatch } = useMetadataFormContext();
    return dispatch;
}

function useMetadataFormState () {
    const { state } = useMetadataFormContext();
    return state;
}

function useMetadataFormData() {
    const { metadata } = useMetadataFormState();
    return metadata;
}

function useMetadataFormErrors() {
    const { errors } = useMetadataFormState();
    return errors;
}

export {
    usePagesWithErrors,
    useFormErrors,
    useFormattedMetadata,
    useMetadataFormContext,
    useMetadataFormDispatcher,
    useMetadataFormState,
    useMetadataFormData,
    useMetadataFormErrors,
    useExtraErrors,
    MetadataForm,
    MetadataFormContext,
    Provider as MetadataFormProvider,
    Consumer as MetadataFormConsumer
};