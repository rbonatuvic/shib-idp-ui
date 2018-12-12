import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'user-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './user.component.html',
    styleUrls: []
})
export class UserPageComponent {

    constructor() {}
}
