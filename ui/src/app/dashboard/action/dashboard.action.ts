import { Action } from '@ngrx/store';
import { MetadataProvider } from '../../domain/model/metadata-provider';

export const TOGGLE_PROVIDER_DISPLAY = '[Dashboard] Display Provider';
export const PREVIEW_PROVIDER = '[Dashboard] Preview Provider';

export class ToggleProviderDisplay implements Action {
    readonly type = TOGGLE_PROVIDER_DISPLAY;

    constructor(public payload: string) { }
}

export class PreviewProvider implements Action {
    readonly type = PREVIEW_PROVIDER;

    constructor(public payload: MetadataProvider) { }
}

export type Actions =
    | ToggleProviderDisplay
    | PreviewProvider;
