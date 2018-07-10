import { Component } from '@angular/core';
import { MetadataProvider } from '../../domain/model';
import { Observable } from '../../../../../node_modules/rxjs';
import { Store } from '@ngrx/store';
import { ProviderState, getAllProviders } from '../../provider/reducer';

@Component({
    selector: 'dashboard-providers-list',
    templateUrl: './dashboard-providers-list.component.html'
})

export class DashboardProvidersListComponent {

    providers$: Observable<MetadataProvider[]>;

    constructor(
        private store: Store<ProviderState>
    ) {
        this.providers$ = this.store.select(getAllProviders);
    }
}
