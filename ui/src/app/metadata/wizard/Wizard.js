import React from 'react';
import { useMetadataDefinitionContext } from '../hoc/MetadataSchema';

const WizardContext = React.createContext();

const { Provider, Consumer } = WizardContext;

const initialState = {
    current: 'common',
    disabled: false,
    loading: false
};

const WizardActions = {
    SET_INDEX: 'SET INDEX'
};

const setWizardIndexAction = (payload) => {
    return {
        type: WizardActions.SET_INDEX,
        payload
    }
}

function reducer(state, action) {
    const {type, payload} = action;
    switch (type) {
        case WizardActions.SET_INDEX:
            return {
                ...state,
                current: payload
            };
        default:
            return state;
    }
}

function Wizard ({children}) {

    const [state, dispatch] = React.useReducer(reducer, {
        ...initialState
    });

    const contextValue = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);

    return (
        <Provider value={contextValue}>{children}</Provider>
    )
}

function useWizardContext () {
    return React.useContext(WizardContext);
}

function useWizardState() {
    const { state } = useWizardContext();
    return state;
}

function useCurrentIndex() {
    const { current } = useWizardState();

    return current;
}

function useCurrentPage() {
    const definition = useMetadataDefinitionContext();
    const current = useCurrentIndex();

    return definition.steps.find(s => s.id === current);
}

function usePreviousPage() {
    const definition = useMetadataDefinitionContext();
    const current = useCurrentIndex();
    const idx = definition.steps.findIndex(s => s.id === current);
    return definition.steps[idx - 1];
}

function useNextPage() {
    const definition = useMetadataDefinitionContext();
    const current = useCurrentIndex();
    const idx = definition.steps.findIndex(s => s.id === current);
    return definition.steps[idx + 1];
}

function useFirstPage() {
    const definition = useMetadataDefinitionContext();
    return definition.steps[0];
}

function useLastPage () {
    const definition = useMetadataDefinitionContext();
    return definition.steps[definition.steps.length - 1];
}

function useIsFirstPage () {
    const definition = useMetadataDefinitionContext();
    const current = useCurrentIndex();
    return definition.steps[0].id === current;
}

function useIsLastPage () {
    const current = useCurrentIndex();
    const last = useLastPage();
    return last.id === current;
}

function useWizardDispatcher () {
    const { dispatch } = useWizardContext();
    return dispatch;
}

export {
    useWizardContext,
    useWizardState,
    useWizardDispatcher,
    useCurrentIndex,
    useCurrentPage,
    useNextPage,
    usePreviousPage,
    useFirstPage,
    useLastPage,
    useIsFirstPage,
    useIsLastPage,
    setWizardIndexAction,
    WizardActions,
    Wizard,
    WizardContext,
    Provider as WizardProvider,
    Consumer as WizardConsumer
};