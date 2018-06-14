import * as fromRoot from '../app.reducer';
import { FilterState } from './filter/reducer/filter.reducer';
import { ResolverState } from './resolver/reducer';

import { reducers as filterReducers } from './filter/reducer';
import { reducers as resolverReducers } from './filter/reducer';

export interface MetadataState {
    filter: FilterState;
    // provider: ProviderState;
    resolver: ResolverState;
}

export interface State extends fromRoot.State {
    metadata: MetadataState;
}

export const reducers = {
    filter: filterReducers,
    resolver: resolverReducers
};

/*
 *   Utility functions
*/

export const combineAllFn = (d, p) => [...p, ...d];
export const doesExistFn = (ids, selected) => ids.indexOf(selected) > -1;
export const getInCollectionFn = (entities, selectedId) => {
    return selectedId && entities[selectedId];
};
export const getEntityIdsFn = list => list.map(entity => entity.entityId);
