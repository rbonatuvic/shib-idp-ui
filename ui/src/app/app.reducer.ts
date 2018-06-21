import { ActionReducerMap, MetaReducer } from '@ngrx/store';
import * as fromRouter from '@ngrx/router-store';

import { RouterStateUrl } from './shared/util';

export interface State {
    router: fromRouter.RouterReducerState<RouterStateUrl>;
}

export const reducers: ActionReducerMap<State> = {
    router: fromRouter.routerReducer,
};

export const metaReducers: MetaReducer<State>[] = [];
