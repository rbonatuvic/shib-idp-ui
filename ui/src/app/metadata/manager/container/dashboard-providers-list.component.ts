import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MetadataProvider } from '../../domain/model';
import { Observable } from '../../../../../node_modules/rxjs';
import { Store } from '@ngrx/store';

import { ProviderState, getAllProviders } from '../../provider/reducer';
import * as fromDashboard from '../reducer';
import { ToggleEntityDisplay } from '../action/manager.action';
import { Meta } from '../../../../../node_modules/@angular/platform-browser';

@Component({
    selector: 'dashboard-providers-list',
    templateUrl: './dashboard-providers-list.component.html'
})

export class DashboardProvidersListComponent {

    providers$: Observable<MetadataProvider[]>;
    providersOpen$: Observable<{ [key: string]: boolean }>;

    constructor(
        private store: Store<ProviderState>,
        private router: Router
    ) {
        this.providers$ = this.store.select(getAllProviders);
        this.providersOpen$ = store.select(fromDashboard.getOpenProviders);
    }

    edit(provider: MetadataProvider): void {
        this.router.navigate(['metadata', 'provider', provider.resourceId, 'edit']);
    }

    toggleEntity(provider: MetadataProvider): void {
        this.store.dispatch(new ToggleEntityDisplay(provider.resourceId));
    }
}
