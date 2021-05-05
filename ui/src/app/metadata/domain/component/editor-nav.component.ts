import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { skipWhile, map } from 'rxjs/operators';

import { WizardStep } from '../../../wizard/model';
import * as fromWizard from '../../../wizard/reducer';

export enum NAV_FORMATS {
    DROPDOWN = 'NAV_DROPDOWN',
    TABS = 'NAV_TABS'
}

@Component({
    selector: 'editor-nav',
    templateUrl: './editor-nav.component.html',
    styleUrls: []
})

export class EditorNavComponent {
    @Input() format: string;
    @Input() status: string[] = [];
    @Input() path: string = 'edit';

    @Output() onPageSelect: EventEmitter<string> = new EventEmitter();

    formats = NAV_FORMATS;

    currentPage$: Observable<string>;
    currentLabel$: Observable<string>;
    current$: Observable<WizardStep>;

    index$: Observable<string>;
    routes$: Observable<{ path: string, label: string }[]>;

    getFilterId = p => p ? p.id : 'filters';
    getFilterLabel = p => p ? p.label : 'Filter List';

    constructor(
        private store: Store<fromWizard.WizardState>
    ) {
        this.index$ = this.store.select(fromWizard.getWizardIndex).pipe(skipWhile(i => !i));
        this.routes$ = this.store.select(fromWizard.getRoutes);
        this.current$ = this.store.select(fromWizard.getCurrent);
        this.currentPage$ = this.current$.pipe(map(this.getFilterId));
        this.currentLabel$ = this.current$.pipe(map(this.getFilterLabel));
    }
}

