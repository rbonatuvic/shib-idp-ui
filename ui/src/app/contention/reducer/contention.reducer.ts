import { ContentionActionTypes, ContentionActionUnion } from '../action/contention.action';
import { Contention } from '../model/contention';
import { MetadataEntity } from '../../domain/domain.type';

export interface State {
    contention: Contention<any>;
}

export const initialState: State = {
    contention: null
};

export function reducer(state = initialState, action: ContentionActionUnion): State {
    switch (action.type) {
        case ContentionActionTypes.SHOW_CONTENTION: {
            return {
                ...state,
                contention: action.payload
            };
        }
        case ContentionActionTypes.RESOLVE_CONTENTION:
        case ContentionActionTypes.CANCEL_CONTENTION: {
            return {
                ...initialState
            };
        }
        default: {
            return state;
        }
    }
}

export const getContention = (state: State) => state.contention;
