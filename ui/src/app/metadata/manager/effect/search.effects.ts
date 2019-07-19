import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store, MemoizedSelector } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, map, combineLatest } from 'rxjs/operators';

import {
    DashboardSearchActionTypes,
    SearchAction,
    DashboardSearchActionsUnion,
    SearchCompleteAction
} from '../action/search.action';
import * as fromManager from '../reducer';
import { Metadata } from '../../domain/domain.type';
import { MetadataResolver } from '../../domain/model';


@Injectable()
export class SearchEffects {
    @Effect()
    searchResolvers$ = this.actions$.pipe(
        ofType<SearchAction>(DashboardSearchActionTypes.ENTITY_SEARCH),
        map(action => action.payload),
        switchMap(({ selector }) => this.performSearch(selector))
    );

    matcher = (value, query) => value ? value.toLocaleLowerCase().match(query.toLocaleLowerCase()) : false;

    constructor(
        private actions$: Actions,
        private store: Store<fromManager.State>
    ) { }

    private performSearch(selector: MemoizedSelector<object, any[]>): Observable<DashboardSearchActionsUnion> {
        return of([]).pipe(
            combineLatest(
                this.store.select(selector),
                (o: any[], p: Metadata[]): Array<Metadata> => o.concat(p)
            ),
            combineLatest(
                this.store.select(fromManager.getSearchQuery),
                (entities, term) =>
                    entities.filter(
                        e => this.matcher(e.name, term) ? true :
                            ('entityId' in e) ? this.matcher((e as MetadataResolver).entityId, term) : this.matcher(e['@type'], term)
                    )
            ),
            map(entities => new SearchCompleteAction(entities))
        );
    }
} /* istanbul ignore next */
