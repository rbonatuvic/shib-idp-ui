import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '../../app.reducer';

@Component({
    selector: 'action-required-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './action-required.component.html',
    styleUrls: []
})
export class ActionRequiredPageComponent {

    constructor(
        private store: Store<fromRoot.State>
    ) {
        this.store.dispatch(new LoadNewUsersRequest());
    }
}
