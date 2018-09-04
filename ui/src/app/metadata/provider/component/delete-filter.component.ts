import { Component, ChangeDetectionStrategy } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'delete-filter-dialog',
    changeDetection: ChangeDetectionStrategy.OnPush,
    templateUrl: './delete-filter.component.html'
})
export class DeleteFilterComponent {
    constructor(
        public activeModal: NgbActiveModal
    ) { }
}
