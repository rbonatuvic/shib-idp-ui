import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../app.reducer';
import * as fromCore from '../../core/reducer';
import { Observable } from 'rxjs';
import { User } from '../../core/model/user';
import { map } from 'rxjs/operators';

@Component({
    selector: 'dashboard-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardPageComponent {

    user$: Observable<User>;
    isAdmin$: Observable<boolean>;

    constructor(
        private store: Store<fromRoot.State>
    ) {
        this.user$ = this.store.select(fromCore.getUser);
        this.isAdmin$ = this.store.select(fromCore.isCurrentUserAdmin);
    }
}
