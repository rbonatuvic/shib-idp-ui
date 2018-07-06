import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import { LoadResolverRequest } from './resolver/action/collection.action';
import { LoadFilterRequest } from './filter/action/collection.action';
import { LoadDraftRequest } from './resolver/action/draft.action';
import * as fromRoot from '../app.reducer';
import { LoadProviderRequest } from './provider/action/collection.action';

@Component({
    selector: 'metadata-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './metadata.component.html',
    styleUrls: []
})
export class MetadataPageComponent {

    constructor(
        private store: Store<fromRoot.State>
    ) {
        this.store.dispatch(new LoadResolverRequest());
        this.store.dispatch(new LoadFilterRequest());
        this.store.dispatch(new LoadDraftRequest());
        this.store.dispatch(new LoadProviderRequest());
    }
}
