import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

import { SearchActionTypes, SearchActionUnion, SearchIdsSuccess } from '../action/search.action';
import * as fromResolver from '../reducer';

@Injectable()
export class SearchIdEffects {

    private dbounce = 500;

    @Effect()
    searchEntityIds$ = this.actions$.pipe(
        ofType<SearchActionUnion>(SearchActionTypes.SEARCH_IDS),
        map(action => action.payload),
        withLatestFrom(this.store.select(fromResolver.getAllEntityIds)),
        map(([ query, ids ]) => {
            if (!query) { return []; }
            return ids.filter(e => this.matcher(e, query));
        }),
        switchMap(entities => of(new SearchIdsSuccess(entities)))
    );

    matcher = (value, query) => value ? value.toLocaleLowerCase().match(query.toLocaleLowerCase()) : false;

    constructor(
        private actions$: Actions,
        private store: Store<fromResolver.State>
    ) { }
}
