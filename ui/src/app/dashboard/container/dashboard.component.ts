import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../app.reducer';
import * as fromAdmin from '../../admin/reducer';
import * as fromCore from '../../core/reducer';
import { Observable } from 'rxjs';
import { LoadRoleRequest } from '../../core/action/configuration.action';
import { map } from 'rxjs/operators';
import { LoadAdminRequest } from '../../admin/action/admin-collection.action';
import { LoadMetadataRequest } from '../../admin/action/metadata-collection.action';

@Component({
    selector: 'dashboard-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardPageComponent {

    actionsRequired$: Observable<Number>;
    hasActions$: Observable<boolean>;
    isAdmin$: Observable<boolean>;

    constructor(
        private store: Store<fromRoot.State>
    ) {
        this.actionsRequired$ = this.store.select(fromAdmin.getTotalActionsRequired);
        this.hasActions$ = this.actionsRequired$.pipe(map(a => a > 0));
        this.isAdmin$ = this.store.select(fromCore.isCurrentUserAdmin);

        this.store.dispatch(new LoadRoleRequest());
        this.store.dispatch(new LoadAdminRequest());
        this.store.dispatch(new LoadMetadataRequest());
    }
}
