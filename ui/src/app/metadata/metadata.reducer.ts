import * as fromRoot from '../app.reducer';
import { FilterState } from './filter/reducer/filter.reducer';
import { ResolverState } from './resolver/reducer';

import { reducers as filterReducers } from './filter/reducer';
import { reducers as resolverReducers } from './filter/reducer';
import { combineReducers } from '@ngrx/store';

export interface MetadataState {
    filter: FilterState;
    // provider: ProviderState;
    resolver: ResolverState;
}

export interface State extends fromRoot.State {
    metadata: MetadataState;
}

export const reducers = {
    filter: combineReducers(filterReducers),
    resolver: combineReducers(resolverReducers)
};


export const reducer = {
    metadata: reducers
};
