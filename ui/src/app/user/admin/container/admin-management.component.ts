import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import * as fromRoot from '../../../app.reducer';
import * as fromCore from '../../../core/reducer';
import * as fromAdmin from '../reducer';

import { LoadAdminRequest, UpdateAdminRequest, RemoveAdminRequest } from '../action/collection.action';
import { Admin } from '../model/admin';
import { LoadRoleRequest } from '../../../core/action/configuration.action';
import { DeleteUserDialogComponent } from '../component/delete-user-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'admin-management-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './admin-management.component.html',
    styleUrls: []
})
export class AdminManagementPageComponent {

    users$: Observable<Admin[]>;
    currentUser: Admin;
    userSub: Subscription;
    roles$: Observable<string[]>;

    constructor(
        private store: Store<fromRoot.State>,
        private modal: NgbModal
    ) {
        this.store.dispatch(new LoadAdminRequest());
        this.store.dispatch(new LoadRoleRequest());

        this.users$ = this.store.select(fromAdmin.getAllAdmins);
        this.roles$ = this.store.select(fromCore.getRoles);
        let user$ = this.store.select(fromCore.getUser);

        this.userSub = user$.subscribe(u => this.currentUser = u);
    }

    setUserRole(user: Admin, change: string): void {
        this.store.dispatch(new UpdateAdminRequest({
            ...user,
            role: change
        }));
    }

    deleteUser(user: string): void {
        this.modal
            .open(DeleteUserDialogComponent)
            .result
            .then(
                result => this.store.dispatch(new RemoveAdminRequest(user))
            )
            .catch(
                err => err
            );
    }
}
