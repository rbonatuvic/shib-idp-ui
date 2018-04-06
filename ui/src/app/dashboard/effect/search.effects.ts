import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/observable';
import { combineLatest } from 'rxjs/observable/combineLatest';
import 'rxjs/add/operator/combineLatest';

import * as entitySearch from '../action/search.action';
import * as fromCollections from '../../domain/reducer';
import * as fromDashboard from '../reducer';
import { MetadataProvider } from '../../domain/model/metadata-provider';
import { EntityDescriptorService } from '../../domain/service/entity-descriptor.service';
import { Provider } from '../../domain/entity/provider';
import { Filter } from '../../domain/entity/filter';
import { MetadataEntity, DomainTypes } from '../../domain/domain.type';

@Injectable()
export class SearchEffects {
    @Effect()
    filter$ = this.actions$
        .ofType<entitySearch.FilterAction>(entitySearch.ENTITY_FILTER)
        .switchMap(filter => this.performSearch());

    @Effect()
    search$ = this.actions$
        .ofType<entitySearch.SearchAction>(entitySearch.ENTITY_SEARCH)
        .map(action => action.payload)
        .switchMap(query => this.performSearch());

    matcher = (value, query) => value ? value.toLocaleLowerCase().match(query.toLocaleLowerCase()) : false;

    constructor(
        private descriptorService: EntityDescriptorService,
        private actions$: Actions,
        private store: Store<fromCollections.CollectionState>
    ) { }

    private performSearch(): Observable<entitySearch.Actions> {
        return combineLatest(
            this.store.select(fromCollections.getAllProviders),
            this.store.select(fromCollections.getAllFilters),
            (p, f): MetadataEntity[] => [].concat(
                f.map(filter => new Filter(filter)),
                p.map(provider => new Provider(provider))
            )
        )
        .combineLatest(
            this.store.select(fromDashboard.getFilterType),
            (entities, type) => type !== 'all' ? entities.filter(e => e.type === type) : entities
        )
        .combineLatest(
            this.store.select(fromDashboard.getSearchQuery),
            (entities, term) => entities.filter(
                e => this.matcher(e.name, term) || this.matcher(e.entityId, term)
            )
        )
        .map(providers => new entitySearch.SearchCompleteAction(providers));
    }
} /* istanbul ignore next */
