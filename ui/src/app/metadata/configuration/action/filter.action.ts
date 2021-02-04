import { Action } from '@ngrx/store';
import { Metadata } from '../../domain/domain.type';
import { FormDefinition } from '../../../wizard/model/form-definition';
import { FilterComparison } from '../model/compare';
import { Schema } from '../model/schema';

export enum FilterCompareActionTypes {
    LOAD_SCHEMA_REQUEST = '[Filter Compare Version] Compare Version Request',
    LOAD_SCHEMA_SUCCESS = '[Filter Compare Version] Compare Version Success',
    LOAD_SCHEMA_ERROR = '[Filter Compare Version] Compare Version Error',
    SET_SCHEMA = '[Filter Compare Version] Set Schema',
    SET_DEFINITION = '[Filter Compare Version] Set Definition',
    COMPARE_FILTERS = '[Filter Compare Version] Compare Filters',
    CLEAR = '[Filter Compare Version] Clear Filter Comparison'
}

export class LoadFilterSchemaRequest implements Action {
    readonly type = FilterCompareActionTypes.LOAD_SCHEMA_REQUEST;

    constructor(public payload: string) { }
}

export class LoadFilterSchemaSuccess implements Action {
    readonly type = FilterCompareActionTypes.LOAD_SCHEMA_SUCCESS;

    constructor(public payload: Schema) { }
}

export class LoadFilterSchemaError implements Action {
    readonly type = FilterCompareActionTypes.LOAD_SCHEMA_ERROR;

    constructor(public payload: any) { }
}

export class SetFilterComparisonSchema implements Action {
    readonly type = FilterCompareActionTypes.SET_SCHEMA;
    constructor(public payload: any) { }
}

export class SetFilterComparisonDefinition implements Action {
    readonly type = FilterCompareActionTypes.SET_DEFINITION;
    constructor(public payload: FormDefinition<Metadata>) { }
}

export class ClearFilterComparison implements Action {
    readonly type = FilterCompareActionTypes.CLEAR;
}

export class CompareFilterVersions implements Action {
    readonly type = FilterCompareActionTypes.COMPARE_FILTERS;

    constructor(public payload: FilterComparison) { }
}

export type FilterCompareActionsUnion =
    | LoadFilterSchemaRequest
    | LoadFilterSchemaSuccess
    | LoadFilterSchemaError
    | SetFilterComparisonSchema
    | SetFilterComparisonDefinition
    | CompareFilterVersions
    | ClearFilterComparison;
