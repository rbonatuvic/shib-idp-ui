import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class ProviderValueEmitter implements ChangeEmitter {
    private subj = new Subject<any>();
    changeEmitted$ = this.subj.asObservable();
    emit(change: any) {
        this.subj.next(change);
    }
}

@Injectable()
export class ProviderStatusEmitter implements ChangeEmitter {
    private subj = new Subject<any>();
    changeEmitted$ = this.subj.asObservable();
    emit(change: string) {
        this.subj.next(change);
    }
}

export interface ChangeEmitter {
    changeEmitted$: Observable<any>;
    emit(change: string): void;
} /* istanbul ignore next */
