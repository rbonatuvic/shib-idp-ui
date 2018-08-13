import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Wizard, WizardStep } from '../model';
import * as fromWizard from '../reducer';
import { Observable } from 'rxjs';
import { withLatestFrom, map } from 'rxjs/operators';

export enum ICONS {
    CHECK = 'CHECK',
    INDEX = 'INDEX'
}


/*tslint:disable:component-selector */
@Component({
    selector: 'wizard',
    templateUrl: './wizard.component.html',
    styleUrls: ['./wizard.component.scss']
})
export class WizardComponent {
    @Output() onNext = new EventEmitter();
    @Output() onPrevious = new EventEmitter();
    @Output() onLast = new EventEmitter();
    @Output() onSave = new EventEmitter();

    currentPage: any = {};
    previousPage: any = {};
    nextPage: any = {};

    index$: Observable<string>;
    disabled$: Observable<boolean>;
    definition$: Observable<Wizard<any>>;

    previous$: Observable<WizardStep>;
    next$: Observable<WizardStep>;
    current$: Observable<WizardStep>;
    last$: Observable<WizardStep>;

    currentIcon$: Observable<string>;

    icons = ICONS;

    constructor(
        private store: Store<fromWizard.WizardState>
    ) {
        this.index$ = this.store.select(fromWizard.getWizardIndex);
        this.definition$ = this.store.select(fromWizard.getWizardDefinition);
        this.disabled$ = this.store.select(fromWizard.getWizardIsDisabled);
        this.previous$ = this.store.select(fromWizard.getPrevious);
        this.next$ = this.store.select(fromWizard.getNext);
        this.current$ = this.store.select(fromWizard.getCurrent);
        this.last$ = this.store.select(fromWizard.getLast);

        this.currentIcon$ = this.current$.pipe(
            withLatestFrom(this.last$),
            map(([current, last]) => {
                return (last && current.index === last.index) ? ICONS.CHECK : ICONS.INDEX;
            })
        );
    }
}
