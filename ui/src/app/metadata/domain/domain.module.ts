import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpModule } from '@angular/http';
import { EffectsModule } from '@ngrx/effects';
import { CommonModule } from '@angular/common';

import { ResolverService } from './service/resolver.service';
import { ListValuesService } from './service/list-values.service';
import { ProviderStatusEmitter, ProviderValueEmitter } from './service/provider-change-emitter.service';
import { EntityIdService } from './service/entity-id.service';
import { EntityDraftService } from './service/draft.service';

import { MetadataProviderService } from './service/provider.service';
import { EntityEffects } from './effect/entity.effect';
import { I18nTextComponent } from './component/i18n-text.component';
import { PreviewDialogComponent } from './component/preview-dialog.component';

export const COMPONENTS = [];

export const DECLARATIONS = [
    ...COMPONENTS,
    I18nTextComponent,
    PreviewDialogComponent
];

@NgModule({
    declarations: DECLARATIONS,
    entryComponents: COMPONENTS,
    imports: [
        HttpModule,
        CommonModule
    ],
    exports: DECLARATIONS,
    providers: []
})
export class DomainModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RootDomainModule,
            providers: [
                ResolverService,
                EntityIdService,
                EntityDraftService,
                ListValuesService,
                ProviderStatusEmitter,
                ProviderValueEmitter,
                MetadataProviderService
            ]
        };
    }
}

@NgModule({
    imports: [
        DomainModule,
        EffectsModule.forFeature([
            EntityEffects
        ])
    ],
})
export class RootDomainModule { }
