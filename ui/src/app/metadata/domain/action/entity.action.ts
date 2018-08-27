import { Action } from '@ngrx/store';
import { MetadataEntity } from '../../domain/model';

export const PREVIEW_ENTITY = '[Domain] Preview Entity';

export class PreviewEntity implements Action {
    readonly type = PREVIEW_ENTITY;

    constructor(public payload: {
        id: string,
        entity: MetadataEntity
    }) { }
}

export type Actions =
    | PreviewEntity;
