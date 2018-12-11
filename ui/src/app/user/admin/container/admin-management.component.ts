import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import * as fromRoot from '../../../app.reducer';
import * as fromAdmin from '../reducer';

import { UserService } from '../../../core/service/user.service';
import { LoadAdminRequest, UpdateAdminRequest, RemoveAdminRequest } from '../action/collection.action';
import { Admin } from '../model/admin';

@Component({
    selector: 'admin-management-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './admin-management.component.html',
    styleUrls: []
})
export class AdminManagementPageComponent {

    users$: Observable<Admin[]>;
    roles$: Observable<string[]> = of(['SUPER_ADMIN', 'DELEGATED_ADMIN']);

    constructor(
        private store: Store<fromRoot.State>
    ) {
        this.store.dispatch(new LoadAdminRequest());

        this.users$ = this.store.select(fromAdmin.getAllAdmins);
    }

    setUserRole(user: Admin, change: string): void {
        this.store.dispatch(new UpdateAdminRequest({
            ...user,
            role: change
        }));
    }

    deleteUser(user: string): void {
        this.store.dispatch(new RemoveAdminRequest(user));
    }
}
