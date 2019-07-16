import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import { LoadProviderRequest } from './action/collection.action';
import * as fromRoot from '../../app.reducer';

@Component({
    selector: 'metadata-provider-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: '<div class="container-fluid p-3"><router-outlet></router-outlet></div>',
    styleUrls: []
})
export class MetadataProviderPageComponent {

    constructor(
        private store: Store<fromRoot.State>
    ) {
        // this.store.dispatch(new LoadProviderRequest());
    }
}
