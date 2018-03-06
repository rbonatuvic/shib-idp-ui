import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';

import * as providerSearch from '../action/search.action';
import * as fromProviders from '../../metadata-provider/reducer';
import { MetadataProvider } from '../../metadata-provider/model/metadata-provider';
import { EntityDescriptorService } from '../../metadata-provider/service/entity-descriptor.service';

@Injectable()
export class SearchEffects {

    @Effect()
    search$ = this.actions$
        .ofType<providerSearch.SearchAction>(providerSearch.PROVIDER_SEARCH)
        .map(action => action.payload)
        .switchMap(query =>
            this.store.select(fromProviders.getAllProviders)
                .map(descriptors => {
                    return descriptors.filter(
                        p => p.entityId.toLocaleLowerCase().match(query.toLocaleLowerCase()) ||
                        p.serviceProviderName.toLocaleLowerCase().match(query.toLocaleLowerCase()));
                })
                .map(providers => new providerSearch.SearchCompleteAction(providers))
        );

    constructor(
        private descriptorService: EntityDescriptorService,
        private actions$: Actions,
        private store: Store<fromProviders.ProviderState>
    ) { }
} /* istanbul ignore next */
