import { createSelector, createFeatureSelector } from '@ngrx/store';
import * as filter from '../action/filter-collection.action';
import * as fromRoot from '../../core/reducer';
import { MetadataFilter } from '../domain.type';

export interface FilterCollectionState {
    ids: string[];
    entities: { [id: string]: MetadataFilter };
    selectedId: string | null;
    loaded: boolean;
}

export const initialState: FilterCollectionState = {
    ids: [],
    entities: {},
    selectedId: null,
    loaded: false
};

export function reducer(state = initialState, action: filter.Actions): FilterCollectionState {
    switch (action.type) {
        case filter.LOAD_FILTER_SUCCESS: {
            const filters = action.payload;

            const filterIds = filters.map(provider => provider.id);
            const entities = filters.reduce(
                (e: { [id: string]: MetadataFilter }, provider: MetadataFilter) => {
                    return Object.assign(e, {
                        [provider.id]: provider,
                    });
                },
                {}
            );

            return {
                ...state,
                ids: [...filterIds],
                entities: { ...state.entities, ...entities },
                loaded: true
            };
        }

        case filter.SELECT_FILTER_SUCCESS: {
            const filter = action.payload;
            if (!filter || state.ids.indexOf(filter.id) < 0) {
                return state;
            }
            return {
                ...state,
                ids: [...state.ids.filter(id => id !== filter.id), filter.id],
                entities: Object.assign({ ...state.entities }, {
                    [filter.id]: filter,
                }),
                selectedId: filter.id
            };
        }

        case filter.UPDATE_FILTER_SUCCESS: {
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

        case filter.SELECT: {
            return {
                ...state,
                selectedId: action.payload,
            };
        }

        default: {
            return state;
        }
    }
}

export const getFilters = (state: FilterCollectionState) => state.entities;

export const getEntities = (state: FilterCollectionState) => state.entities;
export const getIds = (state: FilterCollectionState) => state.ids;
export const getSelectedId = (state: FilterCollectionState) => state.selectedId;
export const getLoaded = (state: FilterCollectionState) => state.loaded;

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
