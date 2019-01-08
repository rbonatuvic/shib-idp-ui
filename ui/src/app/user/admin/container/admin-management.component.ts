import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';

import * as fromRoot from '../../../app.reducer';
import * as fromCore from '../../../core/reducer';
import * as fromAdmin from '../reducer';

import { LoadAdminRequest, UpdateAdminRequest, RemoveAdminRequest } from '../action/collection.action';
import { Admin } from '../model/admin';
import { LoadRoleRequest } from '../../../core/action/configuration.action';
import { ModalService } from '../../../core/service/modal.service';
import { DeleteUserDialogComponent } from '../component/delete-user-dialog.component';
import { map } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'admin-management-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './admin-management.component.html',
    styleUrls: []
})
export class AdminManagementPageComponent {

    users$: Observable<Admin[]>;
    roles$: Observable<string[]>;

    constructor(
        private store: Store<fromRoot.State>,
        private modal: NgbModal
    ) {
        this.store.dispatch(new LoadAdminRequest());
        this.store.dispatch(new LoadRoleRequest());

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
