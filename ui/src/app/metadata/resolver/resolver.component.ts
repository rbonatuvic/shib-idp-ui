import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import { LoadResolverRequest } from './action/collection.action';
import { LoadDraftRequest } from './action/draft.action';
import * as fromRoot from '../../app.reducer';

@Component({
    selector: 'metadata-resolver-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: '<router-outlet></router-outlet>',
    styleUrls: []
})
export class MetadataResolverPageComponent {

    constructor(
        private store: Store<fromRoot.State>
    ) {
        // this.store.dispatch(new LoadResolverRequest());
        // this.store.dispatch(new LoadDraftRequest());
    }
}
