import {
    createSelector,
    createFeatureSelector
} from '@ngrx/store';

import * as fromMessages from './message.reducer';
import * as fromRoot from '../../app.reducer';
import { getCurrentLanguage, getCurrentCountry } from '../../shared/util';

export interface I18nState {
    messages: fromMessages.MessageState;
}

export interface State extends fromRoot.State {
    core: I18nState;
}

export const reducers = {
    messages: fromMessages.reducer
};

export const getCoreFeature = createFeatureSelector<I18nState>('i18n');
export const getMessageStateFn = (state: I18nState) => state.messages;

export const getMessageState = createSelector(getCoreFeature, getMessageStateFn);
export const getLocale = createSelector(getMessageState, fromMessages.getLocale);
export const getLanguage = createSelector(getLocale, locale => getCurrentLanguage(locale));
export const getCountry = createSelector(getLocale, locale => getCurrentCountry(locale));

export const getMessages = createSelector(getMessageState, fromMessages.getMessages);
export const getFetchingMessages = createSelector(getMessageState, fromMessages.isFetching);
