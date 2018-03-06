import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { NgbModalOptions } from '@ng-bootstrap/ng-bootstrap/modal/modal';

@Injectable()
export class NgbModalStub {
    open(content: any, options: NgbModalOptions): {result: Promise<boolean>} {
        return {
            result: Promise.resolve(true)
        };
    }
}
