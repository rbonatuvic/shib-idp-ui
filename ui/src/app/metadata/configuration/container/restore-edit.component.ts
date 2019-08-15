import { Component } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import {
    ConfigurationState, getConfigurationModelKind
} from '../../configuration/reducer';
import { RestoreVersionRequest, CancelRestore } from '../action/restore.action';
import { NAV_FORMATS } from '../../domain/component/editor-nav.component';
import { Metadata } from '../../domain/domain.type';
import { getVersionModel } from '../reducer';


@Component({
    selector: 'restore-edit',
    templateUrl: './restore-edit.component.html',
    styleUrls: []
})

export class RestoreEditComponent {

    model$: Observable<Metadata> = this.store.select(getVersionModel);
    kind$: Observable<string> = this.store.select(getConfigurationModelKind);

    isInvalid$: Observable<boolean> = of(false);
    canFilter$: Observable<boolean> = of(false);
    status$: Observable<string> = of('VALID');
    isSaving$: Observable<boolean> = of(false);

    validators$: Observable<any>;

    formats = NAV_FORMATS;

    constructor(
        private store: Store<ConfigurationState>
    ) {}

    save() {
        this.store.dispatch(new RestoreVersionRequest());
    }

    cancel() {
        this.store.dispatch(new CancelRestore());
    }
}

