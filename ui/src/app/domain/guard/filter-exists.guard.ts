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

    /**
     * This method creates an observable that waits for the `loaded` property
     * of the collection state to turn `true`, emitting one time once loading
     * has finished.
     */
    waitForCollectionToLoad(): Observable<boolean> {
        return this.store.pipe(
            select(fromCollection.getFilterCollectionLoaded),
            filter(loaded => loaded),
            take(1)
        );
    }

    /**
     * This method checks if a filter with the given ID is already registered
     * in the Store
     */
    hasFilterInStore(id: string): Observable<boolean> {
        return this.store.pipe(
            select(fromCollection.getFilterEntities),
            map(entities => !!entities[id]),
            take(1)
        );
    }

    /**
     * This method loads a filter with the given ID from the API and caches
     * it in the store, returning `true` or `false` if it was found.
     */
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

    /**
     * `hasFilter` composes `hasFilterInStore` and `hasFilterInApi`. It first checks
     * if the filter is in store, and if not it then checks if it is in the
     * API.
     */
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

    /**
     * This is the actual method the router will call when our guard is run.
     *
     * Our guard waits for the collection to load, then it checks if we need
     * to request a filter from the API or if we already have it in our cache.
     * If it finds it in the cache or in the API, it returns an Observable
     * of `true` and the route is rendered successfully.
     *
     * If it was unable to find it in our cache or in the API, this guard
     * will return an Observable of `false`, causing the router to move
     * on to the next candidate route. In this case, it will move on
     * to the 404 page.
     */
    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
        return this.waitForCollectionToLoad().pipe(
            switchMap(() => this.hasFilter(route.params['id']))
        );
    }
}
