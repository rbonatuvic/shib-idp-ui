import { Injectable } from '@angular/core';
import { Resolve, ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { map, distinctUntilChanged, skipWhile } from 'rxjs/operators';

import * as fromCollection from '../reducer';
import { MetadataProviderService } from '../../domain/service/provider.service';
import { MetadataProvider } from '../../domain/model';
import { SelectProviderRequest } from '../action/collection.action';

/**
 * Guards are hooks into the route resolution process, providing an opportunity
 * to inform the router's navigation process whether the route should continue
 * to activate this route. Guards must return an of true or false.
 */
@Injectable()
export class ProviderResolver implements Resolve<Observable<MetadataProvider>> {
    constructor(
        private store: Store<fromCollection.State>,
        private route: ActivatedRoute
    ) { }

    resolve() {
        this.route.params.pipe(
            distinctUntilChanged(),
            map(params => {
                return new SelectProviderRequest(params.providerId);
            })
        ).subscribe(this.store);

        return this.store.select(fromCollection.getSelectedProvider).pipe(skipWhile(id => !id));
    }
}
