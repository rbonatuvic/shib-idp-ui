import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { switchMap, map, combineLatest } from 'rxjs/operators';

import * as entitySearch from '../action/search.action';
import * as fromManager from '../reducer';
import * as fromResolver from '../../resolver/reducer';
import { MetadataProvider } from '../../domain/model/metadata-provider';
import { FileBackedHttpMetadataResolver } from '../../domain/entity';


@Injectable()
export class SearchEffects {
    @Effect()
    search$ = this.actions$.pipe(
        ofType<entitySearch.SearchAction>(entitySearch.ENTITY_SEARCH),
        map(action => action.payload),
        switchMap(() => this.performSearch())
    );

    matcher = (value, query) => value ? value.toLocaleLowerCase().match(query.toLocaleLowerCase()) : false;

    constructor(
        private actions$: Actions,
        private store: Store<fromManager.State>
    ) { }

    private performSearch(): Observable<entitySearch.Actions> {
        return of([]).pipe(
            combineLatest(
                this.store.select(fromResolver.getAllResolvers),
                (o: any[], p: MetadataProvider[]): Array<FileBackedHttpMetadataResolver> => {
                    return o.concat(
                        p.map(provider => new FileBackedHttpMetadataResolver(provider))
                    );
                }
            ),
            combineLatest(
                this.store.select(fromManager.getSearchQuery),
                (entities, term) => {
                    const filtered = entities.filter(
                        e => this.matcher(e.name, term) || this.matcher(e.entityId, term)
                    );
                    return filtered;
                }
            ),
            map(entities => new entitySearch.SearchCompleteAction(entities))
        );
    }
} /* istanbul ignore next */
