import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromProvider from '../reducer';

@Component({
    selector: 'provider-filter-list',
    templateUrl: './provider-filter-list.component.html',
    styleUrls: []
})
export class ProviderFilterListComponent {
    constructor(
        private store: Store<fromProvider.ProviderState>
    ) { }
}
