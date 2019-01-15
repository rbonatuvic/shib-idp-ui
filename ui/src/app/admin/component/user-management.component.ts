import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import * as fromRoot from '../../app.reducer';
import * as fromCore from '../../core/reducer';
import * as fromAdmin from '../reducer';

import { UpdateAdminRequest, RemoveAdminRequest } from '../action/collection.action';
import { Admin } from '../model/admin';
import { DeleteUserDialogComponent } from '../component/delete-user-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'user-management',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './user-management.component.html',
    styleUrls: []
})
export class UserManagementComponent {

    users$: Observable<Admin[]>;
    roles$: Observable<string[]>;

    constructor(
        protected store: Store<fromRoot.State>,
        protected modal: NgbModal
    ) {
        this.users$ = this.store.select(fromAdmin.getAllAdmins);
        this.roles$ = this.store.select(fromCore.getRoles);
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
