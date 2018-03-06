import { ElementRef } from '@angular/core';
import { Subject } from 'rxjs/Subject';

export const defaultState = {
    focused: null,
    selected: null,
    hovered: null,
    menuOpen: false,
    query: '',
    options: [],
    matches: []
};

export interface AutoCompleteState {
    focused: number | null;
    selected: number | null;
    hovered: number | null;
    menuOpen: boolean;
    query: string;
    options: string[];
    matches: string[];
}

export class AutoCompleteStateEmitter {
    private subj = new Subject<AutoCompleteState>();

    private state: AutoCompleteState;

    changes$ = this.subj.asObservable();

    constructor(
        private defaults: AutoCompleteState = defaultState
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
