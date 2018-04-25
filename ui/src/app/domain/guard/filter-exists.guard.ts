import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';

import * as FilterActions from '../action/filter-collection.action';
import * as fromCollection from '../reducer';
import { MetadataResolverService } from '../service/metadata-resolver.service';

/**
 * Guards are hooks into the route resolution process, providing an opportunity
 * to inform the router's navigation process whether the route should continue
 * to activate this route. Guards must return an observable of true or false.
 */
@Injectable()
export class FilterExistsGuard implements CanActivate {
    constructor(
        private store: Store<fromCollection.State>,
        private mdResolverService: MetadataResolverService,
        private router: Router
    ) { }

    waitForCollectionToLoad(): Observable<boolean> {
        return this.store.pipe(
            select(fromCollection.getFilterCollectionIsLoaded),
            filter(loaded => loaded),
            take(1)
        );
    }

    hasFilterInStore(id: string): Observable<boolean> {
        return this.store.pipe(
            select(fromCollection.getFilterEntities),
            map(entities => !!entities[id]),
            take(1)
        );
    }

    hasFilterInApi(id: string): Observable<boolean> {
        return this.mdResolverService.find(id).pipe(
            map(filterEntity => new FilterActions.LoadFilterSuccess([filterEntity])),
            tap((action: FilterActions.LoadFilterSuccess) => this.store.dispatch(action)),
            map(filter => !!filter),
            catchError(() => {
                this.router.navigate(['/dashboard']);
                return of(false);
            })
        );
    }

    hasFilter(id: string): Observable<boolean> {
        return this.hasFilterInStore(id).pipe(
            switchMap(inStore => {
                if (inStore) {
                    return of(inStore);
                }

                return this.hasFilterInApi(id);
            })
        );
    }
    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        return this.waitForCollectionToLoad().pipe(
            switchMap(() => this.hasFilter(route.params['id']))
        );
    }
}
