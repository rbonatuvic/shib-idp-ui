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

    constructor(
        private schemaService: SchemaService,
        private actions$: Actions
    ) { }
}  /* istanbul ignore next */
