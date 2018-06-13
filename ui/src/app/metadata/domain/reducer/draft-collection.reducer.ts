import { createSelector } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { MetadataProvider } from '../../domain/model/provider';
import * as providerAction from '../action/provider-collection.action';
import { DraftCollectionActionsUnion, DraftCollectionActionTypes } from '../action/draft-collection.action';

export interface DraftCollectionState extends EntityState<MetadataProvider> {
    selectedDraftId: string | null;
}

export function sortByName(a: MetadataProvider, b: MetadataProvider): number {
    return a.serviceProviderName.localeCompare(b.serviceProviderName);
}

export const adapter: EntityAdapter<MetadataProvider> = createEntityAdapter<MetadataProvider>({
    sortComparer: sortByName,
    selectId: (model: MetadataProvider) => model.entityId
});

export const initialState: DraftCollectionState = adapter.getInitialState({
    selectedDraftId: null,
});

export function reducer(state = initialState, action: DraftCollectionActionsUnion): DraftCollectionState {
    switch (action.type) {
        case DraftCollectionActionTypes.LOAD_DRAFT_SUCCESS: {
            return adapter.addMany(action.payload, {
                ...state,
                selectedDraftId: state.selectedDraftId,
            });
        }

        case DraftCollectionActionTypes.UPDATE_DRAFT_SUCCESS: {
            return adapter.updateOne(action.payload, state);
        }

        case DraftCollectionActionTypes.REMOVE_DRAFT_SUCCESS: {
            return adapter.removeOne(action.payload.entityId, state);
        }

        case DraftCollectionActionTypes.SELECT: {
            return {
                ...state,
                selectedDraftId: action.payload,
            };
        }

        default: {
            return state;
        }
    }
}

export const getSelectedDraftId = (state: DraftCollectionState) => state.selectedDraftId;
export const {
    selectIds: selectDraftIds,
    selectEntities: selectDraftEntities,
    selectAll: selectAllDrafts,
    selectTotal: selectDraftTotal
} = adapter.getSelectors();
