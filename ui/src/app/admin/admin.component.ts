import { Component, OnInit } from '@angular/core';
import { LoadRoleRequest } from '../core/action/configuration.action';

import * as fromRoot from '../app.reducer';
import { Store } from '@ngrx/store';
import { LoadAdminRequest } from './action/user-collection.action';

@Component({
    selector: 'admin-page',
    templateUrl: './admin.component.html',
    styleUrls: []
})
export class AdminComponent implements OnInit {
    constructor(
        private store: Store<fromRoot.State>
    ) { }

    ngOnInit(): void {
        // this.store.dispatch(new LoadAdminRequest());
    }
}
