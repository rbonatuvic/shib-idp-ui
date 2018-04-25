import { Action } from '@ngrx/store';
import { MetadataEntity } from '../../domain/domain.type';

export const PREVIEW_ENTITY = '[Domain] Preview Entity';

export class PreviewEntity implements Action {
    readonly type = PREVIEW_ENTITY;

    constructor(public payload: MetadataEntity) { }
}

export type Actions =
    | PreviewEntity;
