import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '../app.reducer';

@Component({
    selector: 'user-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './user.component.html',
    styleUrls: []
})
export class UserPageComponent {

    constructor(
        private store: Store<fromRoot.State>
    ) {}
}
