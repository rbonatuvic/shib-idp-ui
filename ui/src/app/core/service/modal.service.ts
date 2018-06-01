import { Injectable, ComponentRef } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, of } from 'rxjs';
import { NgbModal, NgbModalOptions } from '@ng-bootstrap/ng-bootstrap';
import { fromPromise } from 'rxjs/observable/fromPromise';

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
        Object.keys(inputs).forEach(key => modal.componentInstance[key] = inputs[key]);
        return fromPromise(modal.result);
    }
} /* istanbul ignore next */
