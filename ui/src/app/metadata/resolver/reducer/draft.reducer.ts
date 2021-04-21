import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import { MetadataResolver } from '../../domain/model';
import { DraftActionsUnion, DraftActionTypes } from '../action/draft.action';

export interface DraftState extends EntityState<MetadataResolver> {
    selectedDraftId: string | null;
}

export const adapter: EntityAdapter<MetadataResolver> = createEntityAdapter<MetadataResolver>({
    selectId: (model: MetadataResolver) => model.id
});

export const initialState: DraftState = adapter.getInitialState({
    selectedDraftId: null,
});

export function reducer(state = initialState, action: DraftActionsUnion): DraftState {
    switch (action.type) {

        case DraftActionTypes.LOAD_DRAFT_SUCCESS: {
            return adapter.setAll(action.payload, {
                ...state,
                selectedDraftId: state.selectedDraftId,
            });
        }

        case DraftActionTypes.UPDATE_DRAFT_SUCCESS: {
            return adapter.updateOne(action.payload, state);
        }

        case DraftActionTypes.REMOVE_DRAFT_SUCCESS: {
            return adapter.removeOne(action.payload, state);
        }

        case DraftActionTypes.SELECT_SUCCESS: {
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

export const getSelectedDraftId = (state: DraftState) => state.selectedDraftId;
export const {
    selectIds: selectDraftIds,
    selectEntities: selectDraftEntities,
    selectAll: selectAllDrafts,
    selectTotal: selectDraftTotal
} = adapter.getSelectors();
