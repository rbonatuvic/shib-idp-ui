import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MetadataProvider } from '../../domain/model';
import { Observable } from '../../../../../node_modules/rxjs';
import { Store } from '@ngrx/store';

import { ProviderState, getOrderedProviders } from '../../provider/reducer';
import { getOpenProviders } from '../reducer';
import { ToggleEntityDisplay } from '../action/manager.action';
import { map } from 'rxjs/operators';
import { ChangeProviderOrderUp, ChangeProviderOrderDown } from '../../provider/action/collection.action';

@Component({
    selector: 'dashboard-providers-list',
    templateUrl: './dashboard-providers-list.component.html'
})

export class DashboardProvidersListComponent implements OnInit {

    providers$: Observable<MetadataProvider[]>;
    providersOpen$: Observable<{ [key: string]: boolean }>;

    constructor(
        private store: Store<ProviderState>,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.providers$ = this.store.select(getOrderedProviders) as Observable<MetadataProvider[]>;
        this.providersOpen$ = this.store.select(getOpenProviders);
    }

    view(id: string, page: string): void {
        this.router.navigate(['metadata', 'provider', id, page]);
    }

    edit(provider: MetadataProvider): void {
        this.view(provider.resourceId, 'edit');
    }

    gotoFilters(provider: MetadataProvider): void {
        this.view(provider.resourceId, 'filters');
    }

    toggleEntity(provider: MetadataProvider): void {
        this.store.dispatch(new ToggleEntityDisplay(provider.resourceId));
    }

    updateOrderUp(provider: MetadataProvider): void {
        this.store.dispatch(new ChangeProviderOrderUp(provider.resourceId));
    }

    updateOrderDown(provider: MetadataProvider): void {
        this.store.dispatch(new ChangeProviderOrderDown(provider.resourceId));
    }
}
