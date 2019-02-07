import { Component } from '@angular/core';

import * as fromRoot from '../app.reducer';
import { Store } from '@ngrx/store';
import { LoadAdminRequest } from './action/admin-collection.action';

@Component({
    selector: 'admin-page',
    templateUrl: './admin.component.html',
    styleUrls: []
})
export class AdminComponent {
    constructor(
        private store: Store<fromRoot.State>
    ) {
        this.store.dispatch(new LoadAdminRequest());
    }
}
