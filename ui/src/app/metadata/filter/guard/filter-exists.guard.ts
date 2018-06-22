import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';

import * as fromCollection from '../reducer';
import { MetadataProviderService } from '../../domain/service/provider.service';

/**
 * Guards are hooks into the route resolution process, providing an opportunity
 * to inform the router's navigation process whether the route should continue
 * to activate this route. Guards must return an of true or false.
 */
@Injectable()
export class FilterExistsGuard implements CanActivate {
    constructor(
        private store: Store<fromCollection.State>,
        private mdResolverService: MetadataProviderService,
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
        return this.store.select(fromCollection.getAllFilters).pipe(
            map(filters => filters.find(f => f.resourceId === id)),
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
