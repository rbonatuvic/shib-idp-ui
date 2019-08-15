import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer';
import * as fromEntity from './entity.reducer';
import * as fromSearch from './search.reducer';
import * as fromCopy from './copy.reducer';
import * as fromDraft from './draft.reducer';
import * as fromCollection from './collection.reducer';

import { combineAllFn, getEntityIdsFn, getInCollectionFn, doesExistFn } from '../../domain/domain.util';

export interface ResolverState {
    entity: fromEntity.EntityState;
    copy: fromCopy.CopyState;
    search: fromSearch.SearchState;
    draft: fromDraft.DraftState;
    collection: fromCollection.CollectionState;
}

export const reducers = {
    copy: fromCopy.reducer,
    entity: fromEntity.reducer,
    collection: fromCollection.reducer,
    draft: fromDraft.reducer,
    search: fromSearch.reducer
};

export interface State extends fromRoot.State {
    'resolver': ResolverState;
}

export const getResolverState = createFeatureSelector<ResolverState>('resolver');

export const getCollectionStateFn = (state: ResolverState) => state.collection;
export const getDraftStateFn = (state: ResolverState) => state.draft;
export const getEntityStateFn = (state: ResolverState) => state.entity;
export const getCopyStateFn = (state: ResolverState) => state.copy;
export const getSearchStateFn = (state: ResolverState) => state.search;

export const getCollectionState = createSelector(getResolverState, getCollectionStateFn);
export const getDraftState = createSelector(getResolverState, getDraftStateFn);
export const getEntityState = createSelector(getResolverState, getEntityStateFn);
export const getCopyState = createSelector(getResolverState, getCopyStateFn);
export const getSearchState = createSelector(getResolverState, getSearchStateFn);

/*
Entity State
*/

export const getEntityIsValid = createSelector(getEntityState, fromEntity.isEntityValid);
export const getEntityIsSaved = createSelector(getEntityState, fromEntity.isEntitySaved);
export const getEntityChanges = createSelector(getEntityState, fromEntity.getChanges);
export const getEntityIsSaving = createSelector(getEntityState, fromEntity.isEntitySaving);
export const getFormStatus = createSelector(getEntityState, fromEntity.getFormStatus);
export const getInvalidEntityForms = createSelector(getEntityState, fromEntity.getInvalidForms);

/*
Copy State
*/

export const getCopy = createSelector(getCopyState, fromCopy.getCopy);
export const getSaving = createSelector(getCopyState, fromCopy.getSaving);
export const getAttributes = createSelector(getCopyState, fromCopy.getCopyAttributes);
export const getSectionsToCopy = createSelector(getCopyState, fromCopy.getCopySections);

/*
Search State
*/

export const getSearchResults = createSelector(getSearchState, fromSearch.getMatches);
export const getSearchQuery = createSelector(getSearchState, fromSearch.getQuery);
export const getSearchLoading = createSelector(getSearchState, fromSearch.getSearching);

/*
Collection State
*/

export const getResolverEntities = createSelector(getCollectionState, fromCollection.selectResolverEntities);
export const getSelectedResolverId = createSelector(getCollectionState, fromCollection.getSelectedResolverId);
export const getResolverIds = createSelector(getCollectionState, fromCollection.selectResolverIds);

export const getResolverCollection = createSelector(getCollectionState, getResolverIds, fromCollection.selectAllResolvers);
export const getSelectedResolver = createSelector(getResolverEntities, getSelectedResolverId, getInCollectionFn);


/*
Draft State
*/

export const getDraftEntities = createSelector(getDraftState, fromDraft.selectDraftEntities);
export const getDraftIds = createSelector(getDraftState, fromDraft.selectDraftIds);
export const getDraftCollection = createSelector(getDraftState, getDraftIds, fromDraft.selectAllDrafts);
export const getSelectedDraftId = createSelector(getDraftState, fromDraft.getSelectedDraftId);

export const getSelectedDraft = createSelector(getDraftEntities, getSelectedDraftId, getInCollectionFn);
export const isSelectedResolverInCollection = createSelector(getResolverIds, getSelectedResolverId, doesExistFn);
export const isSelectedDraftInCollection = createSelector(getDraftIds, getSelectedDraftId, doesExistFn);

/*
Combine Drafts and Resolvers
*/

export const getAllResolvers = createSelector(getDraftCollection, getResolverCollection, combineAllFn);
export const getAllResolverIds = createSelector(getDraftIds, getResolverIds, combineAllFn);

export const getAllEntityIds = createSelector(getAllResolvers, getEntityIdsFn);

export const getAllOtherIds = createSelector(
    getAllResolvers,
    getSelectedResolverId,
    (ids, selected) => ids.filter(id => id !== selected)
);
