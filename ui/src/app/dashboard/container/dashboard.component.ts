import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../app.reducer';
import * as fromAdmin from '../../admin/reducer';
import { Observable } from 'rxjs';
import { LoadAdminRequest } from '../../admin/action/user-collection.action';
import { LoadRoleRequest } from '../../core/action/configuration.action';
import { map } from 'rxjs/operators';

@Component({
    selector: 'dashboard-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardPageComponent {

    actionsRequired$: Observable<Number>;
    hasActions$: Observable<boolean>;

    constructor(
        private store: Store<fromRoot.State>
    ) {
        this.actionsRequired$ = this.store.select(fromAdmin.getTotalActionsRequired);
        this.hasActions$ = this.actionsRequired$.pipe(map(a => a > 0));
        this.store.dispatch(new LoadRoleRequest());
    }
}
