import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { reducers } from './reducer';
import { HttpClientModule } from '@angular/common/http';
import { I18nService } from './service/i18n.service';
import { MessageEffects } from './effect/message.effect';
import { I18nPipe } from './pipe/i18n.pipe';
import { CoreModule } from '../core/core.module';

export const COMPONENTS = [];
export const DIRECTIVES = [];
export const PIPES = [
    I18nPipe
];

@NgModule({
    imports: [
        CommonModule,
        HttpClientModule,
        CoreModule
    ],
    declarations: [
        ...PIPES,
        ...COMPONENTS,
        ...DIRECTIVES
    ],
    exports: [
        ...PIPES,
        ...COMPONENTS,
        ...DIRECTIVES
    ],
})
export class I18nModule {
    static forRoot() {
        return {
            ngModule: RootI18nModule,
            providers: [
                I18nService
            ]
        };
    }
}

@NgModule({
    imports: [
        StoreModule.forFeature('i18n', reducers),
        EffectsModule.forFeature([MessageEffects]),
    ],
})
export class RootI18nModule { }
