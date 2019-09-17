import { Injectable } from '@angular/core';
import { Effect, Actions, ofType } from '@ngrx/effects';
import {
    LoadFilterSchemaRequest,
    CompareFilterVersions,
    SetFilterComparisonDefinition,
    LoadFilterSchemaSuccess,
    LoadFilterSchemaError,
    SetFilterComparisonSchema
} from '../action/filter.action';
import { Store } from '@ngrx/store';
import { State } from '../reducer';
import { FilterCompareActionTypes } from '../action/filter.action';
import { MetadataConfigurationService } from '../service/configuration.service';
import { switchMap, map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class FilterCompareVersionEffects {

    @Effect()
    setDefinition$ = this.actions$.pipe(
        ofType<CompareFilterVersions>(FilterCompareActionTypes.COMPARE_FILTERS),
        map(action => action.payload),
        map(comparison => {
            const def = this.configService.getDefinition(comparison.modelType);
            return new SetFilterComparisonDefinition(def);
        })
    );

    @Effect()
    loadSchemaOnDefinitionSet$ = this.actions$.pipe(
        ofType<SetFilterComparisonDefinition>(FilterCompareActionTypes.SET_DEFINITION),
        map(action => action.payload),
        map(def => new LoadFilterSchemaRequest(def.schema))
    );

    @Effect()
    loadSchemaData$ = this.actions$.pipe(
        ofType<LoadFilterSchemaRequest>(FilterCompareActionTypes.LOAD_SCHEMA_REQUEST),
        switchMap(action =>
            this.configService
                .loadSchema(action.payload)
                .pipe(
                    map(schema => new LoadFilterSchemaSuccess(schema)),
                    catchError(error => of(new LoadFilterSchemaError(error)))
                )
        )
    );

    @Effect()
    loadSchemaSuccess$ = this.actions$.pipe(
        ofType<LoadFilterSchemaSuccess>(FilterCompareActionTypes.LOAD_SCHEMA_SUCCESS),
        map(action => action.payload),
        map(schema => new SetFilterComparisonSchema(schema))
    );

    constructor(
        private configService: MetadataConfigurationService,
        private store: Store<State>,
        private actions$: Actions
    ) {}
}
