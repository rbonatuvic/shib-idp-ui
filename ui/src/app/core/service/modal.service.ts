import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { from } from 'rxjs';

export const DEFAULT_MODAL_OPTIONS: NgbModalOptions = {
    size: 'lg'
};

@Injectable()
export class ModalService {

    constructor(
        private modal: NgbModal
    ) {}

    open(content: any, options: NgbModalOptions, inputs: Object = {}): Observable<any> {
        let modal = this.modal.open(content, {
            ...options
        });
        if (modal.hasOwnProperty('componentInstance')) {
            Object.keys(inputs).forEach(key => modal.componentInstance[key] = inputs[key]);
        }
        return from(modal.result);
    }
} /* istanbul ignore next */
