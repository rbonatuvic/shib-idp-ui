import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as fromRoot from '../../../app.reducer';
import * as fromEditor from './editor.reducer';
import * as fromSearch from './search.reducer';
import * as fromCopy from './copy.reducer';
import * as fromDraft from './draft.reducer';
import * as fromCollection from './collection.reducer';

import { combineAllFn, getEntityIdsFn, getInCollectionFn, doesExistFn } from '../../metadata.reducer';

export interface ResolverState {
    editor: fromEditor.EditorState;
    copy: fromCopy.CopyState;
    search: fromSearch.SearchState;
    draft: fromDraft.DraftState;
    collection: fromCollection.CollectionState;
}

export const reducers = {
    copy: fromCopy.reducer,
    search: fromSearch.reducer,
    editor: fromEditor.reducer
};

export interface State extends fromRoot.State {
    'resolver': ResolverState;
}

export const getResolverState = createFeatureSelector<ResolverState>('resolver');

export const getCollectionStateFn = (state: ResolverState) => state.collection;
export const getDraftStateFn = (state: ResolverState) => state.draft;
export const getEditorStateFn = (state: ResolverState) => state.editor;
export const getCopyStateFn = (state: ResolverState) => state.copy;
export const getSearchStateFn = (state: ResolverState) => state.search;

export const getCollectionState = createSelector(getResolverState, getCollectionStateFn);
export const getDraftState = createSelector(getResolverState, getDraftStateFn);
export const getEditorState = createSelector(getResolverState, getEditorStateFn);
export const getCopyState = createSelector(getResolverState, getCopyStateFn);
export const getSearchState = createSelector(getResolverState, getSearchStateFn);

/*
Editor State
*/

export const getEditorIsValid = createSelector(getEditorState, fromEditor.isEditorValid);
export const getEditorIsSaved = createSelector(getEditorState, fromEditor.isEditorSaved);
export const getEditorChanges = createSelector(getEditorState, fromEditor.getChanges);
export const getEditorIsSaving = createSelector(getEditorState, fromEditor.isEditorSaving);
export const getFormStatus = createSelector(getEditorState, fromEditor.getFormStatus);
export const getInvalidEditorForms = createSelector(getEditorState, fromEditor.getInvalidForms);

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

export const getProviderEntities = createSelector(getCollectionState, fromCollection.selectProviderEntities);
export const getSelectedProviderId = createSelector(getCollectionState, fromCollection.getSelectedProviderId);
export const getProviderIds = createSelector(getCollectionState, fromCollection.selectProviderIds);

export const getProviderCollection = createSelector(getCollectionState, getProviderIds, fromCollection.selectAllProviders);
export const getSelectedProvider = createSelector(getProviderEntities, getSelectedProviderId, getInCollectionFn);


/*
Draft State
*/

export const getDraftEntities = createSelector(getDraftState, fromDraft.selectDraftEntities);
export const getDraftIds = createSelector(getDraftState, fromDraft.selectDraftIds);
export const getDraftCollection = createSelector(getDraftState, getDraftIds, fromDraft.selectAllDrafts);
export const getSelectedDraftId = createSelector(getDraftState, fromDraft.getSelectedDraftId);

export const getSelectedDraft = createSelector(getDraftEntities, getSelectedDraftId, getInCollectionFn);
export const isSelectedProviderInCollection = createSelector(getProviderIds, getSelectedProviderId, doesExistFn);
export const isSelectedDraftInCollection = createSelector(getDraftIds, getSelectedDraftId, doesExistFn);

/*
Combine Drafts and Providers
*/

export const getAllProviders = createSelector(getDraftCollection, getProviderCollection, combineAllFn);
export const getAllProviderIds = createSelector(getDraftIds, getProviderIds, combineAllFn);

export const getAllEntityIds = createSelector(getAllProviders, getEntityIdsFn);
