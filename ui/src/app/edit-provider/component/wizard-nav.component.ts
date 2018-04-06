import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import * as fromEditor from '../reducer';
import { WIZARD as WizardDef, EditorFlowDefinition } from '../editor-definition.const';

@Component({
    selector: 'wizard-nav',
    templateUrl: './wizard-nav.component.html'
})
export class WizardNavComponent implements OnChanges {
    @Input() index: number;
    @Output() onNext = new EventEmitter();
    @Output() onPrevious = new EventEmitter();
    @Output() onSave = new EventEmitter();

    currentPage: any = {};
    previousPage: any = {};
    nextPage: any = {};
    isLastPage = false;
    isFirstPage = false;
    wizardIsValid$: Observable<boolean>;
    wizardIsInvalid$: Observable<boolean>;

    wizard: EditorFlowDefinition[] = WizardDef;

    constructor(
        private store: Store<fromEditor.State>
    ) {}

    ngOnChanges(): void {
        this.currentPage = WizardDef.find(r => r.index === this.index);
        this.previousPage = WizardDef.find(r => r.index === this.index - 1);
        this.nextPage = WizardDef.find(r => r.index === this.index + 1);
        this.isLastPage = WizardDef[WizardDef.length - 1].index === this.index;
        this.isFirstPage = WizardDef[0].index === this.index;
        this.wizard = WizardDef;

        this.wizardIsValid$ = this.store.select(fromEditor.getEditorIsValid);
        this.wizardIsInvalid$ = this.wizardIsValid$.map(valid => !valid);
    }
} /* istanbul ignore next */
