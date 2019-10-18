import { Component, Input } from '@angular/core';

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';

@Component({
    selector: 'unsaved-entity',
    templateUrl: './unsaved-entity.dialog.html'
})
export class UnsavedEntityComponent {
    readonly subject: Subject<boolean> = new Subject<boolean>();

    @Input() message;

    constructor(
        public activeModal: NgbActiveModal
    ) { }

    close(): void {
        this.activeModal.close();
    }

    dismiss(): void {
        this.activeModal.dismiss();
    }
}
