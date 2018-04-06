import { createSelector, createFeatureSelector } from '@ngrx/store';
import { MetadataProvider } from '../../domain/model/metadata-provider';
import * as dashboard from '../action/dashboard.action';
import * as fromRoot from '../../core/reducer';

export interface State {
    providersOpen: {[key: string]: boolean};
}

export const initialState: State = {
    providersOpen: {}
};

export function reducer(state = initialState, action: dashboard.Actions): State {
    switch (action.type) {
        case dashboard.TOGGLE_ENTITY_DISPLAY: {
            return Object.assign({}, state, {
                providersOpen: {
                    ...state.providersOpen,
                    ...{[action.payload]: !state.providersOpen[action.payload]}
                }
            });
        }
        default: {
            // console.log(state);
            return state;
        }
    }
}

export const providersOpen = (state: State) => state.providersOpen;
