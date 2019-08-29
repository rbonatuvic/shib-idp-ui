import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import {
    ConfigurationState,
    getConfigurationModelKind,
    getRestorationIsSaving,
    getRestorationIsValid,
    getInvalidRestorationForms
} from '../../configuration/reducer';
import { RestoreVersionRequest, CancelRestore } from '../action/restore.action';
import { NAV_FORMATS } from '../../domain/component/editor-nav.component';
import { Metadata } from '../../domain/domain.type';
import { getVersionModel } from '../reducer';
import { map } from 'rxjs/operators';


@Component({
    selector: 'restore-edit',
    templateUrl: './restore-edit.component.html',
    styleUrls: []
})

export class RestoreEditComponent {

    model$: Observable<Metadata> = this.store.select(getVersionModel);
    kind$: Observable<string> = this.store.select(getConfigurationModelKind);

    isInvalid$: Observable<boolean> = this.store.select(getRestorationIsValid).pipe(map(v => !v));
    status$: Observable<any> = this.store.select(getInvalidRestorationForms);
    isSaving$: Observable<boolean> = this.store.select(getRestorationIsSaving);

    validators$: Observable<any>;

    formats = NAV_FORMATS;

    constructor(
        private store: Store<ConfigurationState>
    ) {
        // this.status$.subscribe(console.log);
    }

    save() {
        this.store.dispatch(new RestoreVersionRequest());
    }

    cancel() {
        this.store.dispatch(new CancelRestore());
    }
}

