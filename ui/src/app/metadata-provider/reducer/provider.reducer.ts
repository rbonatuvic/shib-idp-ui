import { createSelector } from '@ngrx/store';
import { MetadataProvider } from '../../domain/model/metadata-provider';
import * as provider from '../action/provider.action';

export interface ProviderState {
    ids: string[];
    entities: { [id: string]: MetadataProvider };
    selectedProviderId: string | null;
}

export const initialState: ProviderState = {
    ids: [],
    entities: {},
    selectedProviderId: null
};

export function reducer(state = initialState, action: provider.Actions): ProviderState {
    switch (action.type) {
        case provider.LOAD_PROVIDER_SUCCESS: {
            const providers = action.payload;

            const providerIds = providers.map(provider => provider.id);
            const entities = providers.reduce(
                (e: { [id: string]: MetadataProvider }, provider: MetadataProvider) => {
                    return Object.assign(e, {
                        [provider.id]: provider,
                    });
                },
                {}
            );

            return {
                ...state,
                ids: [...providerIds],
                entities: Object.assign(entities)
            };
        }

        case provider.SELECT_SUCCESS: {
            const provider = action.payload;

            if (state.ids.indexOf(provider.id) < 0) {
                return state;
            }
            return {
                ids: [...state.ids.filter(id => id !== provider.id), provider.id],
                entities: Object.assign({ ...state.entities }, {
                    [provider.id]: provider,
                }),
                selectedProviderId: provider.id
            };
        }

        case provider.UPDATE_PROVIDER_SUCCESS: {
            const provider = action.payload;

            if (state.ids.indexOf(provider.id) < 0) {
                return state;
            }
            const original = state.entities[provider.id],
                updated = Object.assign({},
                    { ...original },
                    { ...provider }
                );
            return {
                ...state,
                ids: [...state.ids.filter(id => id !== provider.id), provider.id],
                entities: Object.assign({ ...state.entities }, {
                    [provider.id]: provider,
                })
            };
        }

        case provider.SELECT: {
            return {
                ...state,
                selectedProviderId: action.payload,
            };
        }

        default: {
            return state;
        }
    }
}

export const getEntities = (state: ProviderState) => state.entities;
export const getIds = (state: ProviderState) => state.ids;
export const getSelectedId = (state: ProviderState) => state.selectedProviderId;
export const getSelected = createSelector(
    getEntities,
    getSelectedId,
    (entities, selectedId) => {
        return entities[selectedId];
    }
);
export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
    return ids.map(id => entities[id]).filter(entity => entity);
});
