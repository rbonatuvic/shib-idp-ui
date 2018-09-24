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
import { PreviewDialogComponent } from './component/preview-dialog.component';
import { MetadataFilterService } from './service/filter.service';
import { AttributesService } from './service/attributes.service';
import { I18nModule } from '../../i18n/i18n.module';

export const COMPONENTS = [
    PreviewDialogComponent
];

export const DECLARATIONS = [
    ...COMPONENTS
];

@NgModule({
    declarations: DECLARATIONS,
    entryComponents: COMPONENTS,
    imports: [
        HttpModule,
        CommonModule,
        I18nModule
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
                MetadataProviderService,
                MetadataFilterService,
                AttributesService
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
