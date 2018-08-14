import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { skipWhile, combineLatest, map } from 'rxjs/operators';

import * as fromProvider from '../reducer';
import { WizardStep, Wizard } from '../../../wizard/model';
import * as fromWizard from '../../../wizard/reducer';
import { MetadataProvider } from '../../domain/model';

export enum NAV_FORMATS {
    DROPDOWN = 'NAV_DROPDOWN',
    TABS = 'NAV_TABS'
}

@Component({
    selector: 'provider-editor-nav',
    templateUrl: './provider-editor-nav.component.html',
    styleUrls: []
})

export class ProviderEditorNavComponent {
    @Input() format: string;

    @Output() onPageSelect: EventEmitter<string> = new EventEmitter();

    formats = NAV_FORMATS;

    currentPage$: Observable<string>;
    index$: Observable<string>;
    invalidForms$: Observable<string[]>;
    routes$: Observable<{ path: string, label: string }[]>;

    constructor(
        private store: Store<fromProvider.ProviderState>
    ) {
        this.index$ = this.store.select(fromWizard.getWizardIndex).pipe(skipWhile(i => !i));
        this.routes$ = this.store.select(fromWizard.getRoutes);
        this.currentPage$ = this.store.select(fromWizard.getCurrent).pipe(
            map(p => p ? p.id : 'filters')
        );
        this.invalidForms$ = this.store.select(fromProvider.getInvalidEditorForms);
    }

    gotoPage(page: string = ''): void {
        this.onPageSelect.emit(page);
    }
}

