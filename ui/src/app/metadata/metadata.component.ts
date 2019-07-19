import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromRoot from '../app.reducer';

@Component({
    selector: 'metadata-page',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './metadata.component.html',
    styleUrls: []
})
export class MetadataPageComponent {
    constructor(
        private store: Store<fromRoot.State>
    ) {}
}
