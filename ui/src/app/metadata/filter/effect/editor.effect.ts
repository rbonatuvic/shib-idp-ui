import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { SchemaService } from '../../../schema-form/service/schema.service';

import { map, switchMap, catchError, debounceTime } from 'rxjs/operators';
import { of } from 'rxjs';
import {
    LoadSchemaRequest,
    LoadSchemaSuccess,
    LoadSchemaFail,
    SetDefinition,
    WizardActionTypes
} from '../../../wizard/action/wizard.action';
import { ResetChanges } from '../action/filter.action';

import { CancelContentionAction, ContentionActionTypes } from '../../../contention/action/contention.action';

@Injectable()
export class EditorEffects {

    @Effect()
    $loadSchemaRequest = this.actions$.pipe(
        ofType<LoadSchemaRequest>(WizardActionTypes.LOAD_SCHEMA_REQUEST),
        map(action => action.payload),
        debounceTime(100),
        switchMap((schemaPath: string) =>
            this.schemaService
                .get(schemaPath)
                .pipe(
                    map(schema => new LoadSchemaSuccess(schema)),
                    catchError(error => of(new LoadSchemaFail(error)))
                )
        )
    );

    @Effect()
    $resetChanges = this.actions$.pipe(
        ofType<SetDefinition>(WizardActionTypes.SET_DEFINITION),
        map(() => new ResetChanges())
    );

    @Effect()
    $resetChangesOnContentionFail = this.actions$.pipe(
        ofType<CancelContentionAction>(ContentionActionTypes.CANCEL_CONTENTION),
        map(() => new ResetChanges())
    );

    constructor(
        private schemaService: SchemaService,
        private actions$: Actions
    ) { }
}  /* istanbul ignore next */
