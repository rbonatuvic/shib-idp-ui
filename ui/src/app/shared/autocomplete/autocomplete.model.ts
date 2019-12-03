import { ElementRef } from '@angular/core';
import { Subject } from 'rxjs';

export const defaultState: AutoCompleteState = {
    focused: null,
    selected: null,
    hovered: null,
    menuOpen: false
};

export interface AutoCompleteState {
    focused: number;
    selected: number;
    hovered: number;
    menuOpen: boolean;
}

export class AutoCompleteStateEmitter {
    private subj = new Subject<AutoCompleteState>();

    private state: AutoCompleteState;

    changes$ = this.subj.asObservable();

    constructor(
        public defaults: AutoCompleteState = defaultState
    ) {
        this.state = {...defaults};
    }

    get currentState(): AutoCompleteState {
        return this.state;
    }

    setState(change: Partial<AutoCompleteState>) {
        this.state = {
            ...this.state,
            ...change
        };
        this.subj.next(this.state);
    }
}
