import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import * as fromFilter from '../reducer';

@Component({
    selector: 'new-filter-page',
    templateUrl: './new-filter.component.html'
})
export class NewFilterComponent {
    constructor(
        private store: Store<fromFilter.State>
    ) {}

    save(): void {}

    cancel(): void {}
}
