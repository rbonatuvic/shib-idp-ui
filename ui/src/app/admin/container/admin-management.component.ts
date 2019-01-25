import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../app.reducer';
import { LoadAdminRequest } from '../action/admin-collection.action';

@Component({
    selector: 'admin-management-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './admin-management.component.html',
    styleUrls: []
})
export class AdminManagementPageComponent {

    constructor(
        private store: Store<fromRoot.State>
    ) {}
}
