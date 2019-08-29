import { Component, OnDestroy } from '@angular/core';
import { Observable, combineLatest, of, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
    ConfigurationState, getFormattedModel
} from '../reducer';
import { getWizardDefinition, getSchema, getValidators, getCurrent, getWizardIndex } from '../../../wizard/reducer';
import { Wizard, WizardStep } from '../../../wizard/model';
import { Metadata } from '../../domain/domain.type';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';
import { NAV_FORMATS } from '../../domain/component/editor-nav.component';
import { UpdateRestorationChangesRequest, UpdateRestoreFormStatus } from '../action/restore.action';
import { LockEditor, UnlockEditor } from '../../../wizard/action/wizard.action';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'restore-edit-step',
    templateUrl: './restore-edit-step.component.html',
    styleUrls: []
})

export class RestoreEditStepComponent implements OnDestroy {

    private ngUnsubscribe: Subject<void> = new Subject<void>();

    readonly lockChange$: Subject<boolean> = new Subject<boolean>();
    readonly statusChange$: Subject<any> = new Subject<any>();

    definition$: Observable<Wizard<Metadata>> = this.store.select(getWizardDefinition);
    schema$: Observable<any> = this.store.select(getSchema);
    model$: Observable<Metadata> = this.store.select(getFormattedModel);
    step$: Observable<WizardStep> = this.store.select(getCurrent);

    lockable$: Observable<boolean> = this.step$.pipe(map(step => step.locked));

    validators$: Observable<any>;

    formats = NAV_FORMATS;

    constructor(
        private store: Store<ConfigurationState>,
        private route: ActivatedRoute
    ) {
        this.validators$ = this.definition$.pipe(
            map(def => def.validatorParams),
            switchMap(params => combineLatest(params.map(p => this.store.select(p)))),
            switchMap(selections => this.store.select(getValidators(selections)))
        );

        this.step$
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(s => this.lockChange$.next(s && s.locked ? true : false));

        this.lockChange$
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe(locked => this.store.dispatch(locked ? new LockEditor() : new UnlockEditor()));

        this.statusChange$
            .pipe(
                takeUntil(this.ngUnsubscribe),
                withLatestFrom(this.store.select(getWizardIndex))
            )
            .subscribe(([errors, currentPage]) => {
                const status = { [currentPage]: !(errors.value) ? 'VALID' : 'INVALID' };
                this.store.dispatch(new UpdateRestoreFormStatus(status));
            });
    }

    onChange(changes: any): void {
        this.store.dispatch(new UpdateRestorationChangesRequest(changes));
    }

    ngOnDestroy() {
        this.ngUnsubscribe.next();
        this.ngUnsubscribe.complete();
    }
}
