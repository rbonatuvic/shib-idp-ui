import { Action } from '@ngrx/store';

export const TOGGLE_ENTITY_DISPLAY = '[Dashboard] Display Entity';

export class ToggleEntityDisplay implements Action {
    readonly type = TOGGLE_ENTITY_DISPLAY;

    constructor(public payload: string) { }
}

export type Actions =
    | ToggleEntityDisplay;
