import { Injectable } from '@angular/core';
import { Effect, Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs/observable';
import { of } from 'rxjs/observable/of';
import 'rxjs/add/operator/combineLatest';

import * as entitySearch from '../action/search.action';
import * as fromCollections from '../../domain/reducer';
import * as fromDashboard from '../reducer';
import { MetadataProvider } from '../../domain/model/metadata-provider';
import { EntityDescriptorService } from '../../domain/service/entity-descriptor.service';
import { Provider } from '../../domain/entity/provider';
import { Filter } from '../../domain/entity/filter';
import { MetadataEntity, DomainTypes, MetadataFilter } from '../../domain/domain.type';

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
        return of([]).combineLatest(
            this.store.select(fromCollections.getAllProviders),
            this.store.select(fromCollections.getAllFilters),
            (o: any[], p: MetadataProvider[], f: MetadataFilter[]): Array<MetadataEntity> => {
                console.log(o, p, f);
                return o.concat(
                    f.map(filter => new Filter(filter)),
                    p.map(provider => new Provider(provider))
                );
            }
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
        .map(entities => new entitySearch.SearchCompleteAction(entities));
    }
} /* istanbul ignore next */
