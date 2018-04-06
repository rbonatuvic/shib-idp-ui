import { Action } from '@ngrx/store';
import { MetadataEntity } from '../../domain/domain.type';

export const TOGGLE_ENTITY_DISPLAY = '[Dashboard] Display Entity';
export const PREVIEW_ENTITY = '[Dashboard] Preview Entity';

export class ToggleEntityDisplay implements Action {
    readonly type = TOGGLE_ENTITY_DISPLAY;

    constructor(public payload: string) { }
}

export class PreviewEntity implements Action {
    readonly type = PREVIEW_ENTITY;

    constructor(public payload: MetadataEntity) { }
}

export type Actions =
    | ToggleEntityDisplay
    | PreviewEntity;
