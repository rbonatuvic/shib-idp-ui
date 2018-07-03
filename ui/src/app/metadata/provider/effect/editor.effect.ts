import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { SchemaService } from '../../../schema-form/service/schema.service';

import {
    LoadSchemaRequest,
    LoadSchemaSuccess,
    LoadSchemaFail,
    EditorActionTypes
} from '../action/editor.action';
import { map, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { SetDefinition, WizardActionTypes } from '../../../wizard/action/wizard.action';
import { ResetChanges } from '../action/entity.action';

@Injectable()
export class EditorEffects {

    @Effect()
    $loadSchemaRequest = this.actions$.pipe(
        ofType<LoadSchemaRequest>(EditorActionTypes.LOAD_SCHEMA_REQUEST),
        map(action => action.payload),
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

    constructor(
        private schemaService: SchemaService,
        private actions$: Actions
    ) { }
}  /* istanbul ignore next */
