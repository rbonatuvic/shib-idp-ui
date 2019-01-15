import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { UserManagementComponent } from './user-management.component';
import * as fromAdmin from '../reducer';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'access-request-component',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './access-request.component.html',
    styleUrls: []
})
export class AccessRequestComponent extends UserManagementComponent implements OnInit {

    ngOnInit(): void {
        this.users$ = this.store.select(fromAdmin.getAllNewUsers);
        this.hasUsers$ = this.users$.pipe(map(userList => userList.length > 0));
    }
}
