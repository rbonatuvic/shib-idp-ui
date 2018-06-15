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
