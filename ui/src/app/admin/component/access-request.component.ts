import { Component, ChangeDetectionStrategy } from '@angular/core';
import { UserManagementComponent } from './user-management.component';

@Component({
    selector: 'access-request-component',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './access-request.component.html',
    styleUrls: []
})
export class AccessRequestComponent extends UserManagementComponent {}
