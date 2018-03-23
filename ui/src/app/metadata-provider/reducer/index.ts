import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromProvider from './provider.reducer';
import * as fromDraft from './draft.reducer';
import * as fromRoot from '../../app.reducer';
import { DraftState } from './draft.reducer';

export interface ProviderState {
    providers: fromProvider.ProviderState;
    drafts: fromDraft.DraftState;
}

export interface State extends fromRoot.State {
    providers: ProviderState;
}

export const reducers = {
    providers: fromProvider.reducer,
    drafts: fromDraft.reducer
};

export const combineAllFn = (d, p) => [...p, ...d];
export const doesExistFn = (ids, selected) => ids.indexOf(selected) > -1;
export const getInCollectionFn = (entities, selectedId) => selectedId && entities[selectedId];
export const getEntityIdsFn = list => list.map(entity => entity.entityId);
export const getProvidersFromStateFn = state => state.providers;
export const getDraftsFromStateFn = state => state.drafts;

export const getProviderState = createFeatureSelector<ProviderState>('providers');
export const getProviderEntityState = createSelector(getProviderState, getProvidersFromStateFn);
export const getProviderEntities = createSelector(getProviderEntityState, fromProvider.getEntities);
export const getSelectedProviderId = createSelector(getProviderEntityState, fromProvider.getSelectedId);
export const getSelectedProvider = createSelector(getProviderEntities, getSelectedProviderId, getInCollectionFn);
export const getProviderIds = createSelector(getProviderEntityState, fromProvider.getIds);
export const getProviderCollection = createSelector(getProviderEntityState, getProviderIds, fromProvider.getAll);

export const getDraftState = createFeatureSelector<ProviderState>('providers');
export const getDraftEntityState = createSelector(getDraftState, getDraftsFromStateFn);
export const getDraftEntities = createSelector(getDraftEntityState, fromDraft.getEntities);
export const getSelectedDraftId = createSelector(getDraftEntityState, fromDraft.getSelectedId);
export const getSelectedDraft = createSelector(getDraftEntities, getSelectedDraftId, getInCollectionFn);
export const getDraftIds = createSelector(getDraftEntityState, fromDraft.getIds);
export const getDraftCollection = createSelector(getDraftEntityState, getDraftIds, fromDraft.getAll);
export const isSelectedProviderInCollection = createSelector(getProviderIds, getSelectedProviderId, doesExistFn);
export const isSelectedDraftInCollection = createSelector(getDraftIds, getSelectedDraftId, doesExistFn);
export const getAllProviders = createSelector(getDraftCollection, getProviderCollection, combineAllFn);
export const getAllProviderIds = createSelector(getDraftIds, getProviderIds, combineAllFn);

export const getAllEntityIds = createSelector(getAllProviders, getEntityIdsFn);
