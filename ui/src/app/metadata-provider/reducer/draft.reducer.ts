import { createSelector } from '@ngrx/store';
import { MetadataProvider } from '../../domain/model/metadata-provider';
import * as providerAction from '../action/provider.action';
import * as draftAction from '../action/draft.action';

export interface DraftState {
    ids: string[];
    drafts: { [id: string]: MetadataProvider };
    selectedDraftId: string | null;
}

export const initialState: DraftState = {
    ids: [],
    drafts: {},
    selectedDraftId: null,
};

export function reducer(state = initialState, action: draftAction.Actions): DraftState {
    switch (action.type) {
        case draftAction.LOAD_DRAFT_SUCCESS: {
            const providers = action.payload;

            const providerIds = providers.map(provider => provider.entityId);
            const entities = providers.reduce(
                (e: { [id: string]: MetadataProvider }, provider: MetadataProvider) => {
                    return Object.assign(e, {
                        [provider.entityId]: provider,
                    });
                },
                {}
            );

            return {
                ids: [...providerIds],
                drafts: Object.assign(entities),
                selectedDraftId: state.selectedDraftId,
            };
        }

        case draftAction.UPDATE_DRAFT_SUCCESS: {
            const draft = action.payload;

            if (state.ids.indexOf(draft.entityId) < 0) {
                return state;
            }

            const original = state.drafts[draft.entityId],
                updated = Object.assign({},
                    { ...original },
                    { ...draft }
                );
            return {
                ids: state.ids,
                drafts: Object.assign({ ...state.drafts }, {
                    [draft.entityId]: updated,
                }),
                selectedDraftId: state.selectedDraftId,
            };
        }

        case draftAction.SELECT: {
            return {
                ids: state.ids,
                drafts: state.drafts,
                selectedDraftId: action.payload,
            };
        }

        default: {
            return state;
        }
    }
}

export const getEntities = (state: DraftState) => state.drafts;
export const getIds = (state: DraftState) => state.ids;
export const getSelectedId = (state: DraftState) => state.selectedDraftId;
export const getSelected = createSelector(
    getEntities,
    getSelectedId,
    (entities, selectedId) => {
        return entities[selectedId];
    }
);
export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
    return ids.map(id => entities[id]);
});
