import React from "react";

import { updatedDiff } from 'deep-object-diff';
import { removeNull } from '../../core/utility/remove_null';

import {ContentionModal} from './component/ContentionModal';

const ContentionContext = React.createContext();

const { Provider, Consumer } = ContentionContext;

const initialState = {
    theirs: null,
    ours: null,
    base: null,
    ourChanges: null,
    theirChanges: null,
    resolution: null,
    reject: null,
    resolve: null,
    show: false
};

export const ContentionActions = {
    OPEN_CONTENTION_MODAL: 'open contention',
    END_CONTENTION: 'end contention'
};

const keys = [
    'version',
    'modifiedDate',
    'createdDate',
    'createdBy',
    'modifiedBy',
    'audId',
    'resourceId',
    'current',
    '@type'
];

export const filterKeys = (key => (keys.indexOf(key) === -1));


export const getContention = (base, ours, theirs) => {

    let theirDiff = updatedDiff(base, theirs);
    let ourDiff = updatedDiff(base, removeNull(ours));
    let ourKeys = Object.keys(ourDiff).filter(filterKeys);
    let theirKeys = Object.keys(theirDiff).filter(filterKeys);

    const ourChanges = ourKeys.map(key => getChangeItem(key, ours));
    const theirChanges = theirKeys.map(key => getChangeItem(key, theirs, ourKeys));
    const resolution = { ...base, ...ours, version: theirs.version }

    return {
        ourChanges,
        theirChanges,
        resolution
    };
}

export const getChangeItem = (key, collection, compare = []) => {
    return {
        label: key,
        value: collection[key],
        conflict: compare.some(o => o === key)
    };
}


export const openContentionModalAction = (base, theirs, ours, resolve, reject) => {

    const { ourChanges, theirChanges, resolution } = getContention(base, ours, theirs);

    return {
        type: ContentionActions.OPEN_CONTENTION_MODAL,
        payload: {
            base,
            theirs,
            ours,
            theirChanges,
            ourChanges,
            resolution,
            reject,
            resolve
        }
    }
}

export const resolveContentionAction = () => {
    return {
        type: ContentionActions.END_CONTENTION,
    }
}

export function reducer(state, action) {
    switch (action.type) {
        case ContentionActions.OPEN_CONTENTION_MODAL:
            return {
                ...action.payload,
                show: true
            };
        case ContentionActions.END_CONTENTION:
            return {
                ...initialState,
                show: false
            };
        default:
            return state;
    }
}

/*eslint-disable react-hooks/exhaustive-deps*/
function Contention({ children }) {
    const [state, dispatch] = React.useReducer(reducer, initialState);

    const { show, theirs, theirChanges, ourChanges, resolution, reject, resolve } = state;

    const onReject = () => {
        reject(theirs);
        dispatch(resolveContentionAction());
    }

    const onResolve = () => {
        resolve(resolution);
        dispatch(resolveContentionAction());
    }

    const contextValue = React.useMemo(() => ({ state, dispatch }), [state, dispatch]);

    return (
        <React.Fragment>
            <ContentionModal
                theirs={theirChanges}
                ours={ourChanges}
                show={show}
                onUseTheirs={() => onReject()}
                onUseOurs={() => onResolve(resolution)}
                backdrop="static"
                keyboard={false} />
            <Provider value={contextValue}>{children}</Provider>
        </React.Fragment>
    );
}

function useContentionDispatcher() {
    const { dispatch } = React.useContext(ContentionContext);
    return dispatch;
}

export {
    Contention,
    ContentionContext,
    useContentionDispatcher,
    Provider as ContentionProvider,
    Consumer as ContentionConsumer
};