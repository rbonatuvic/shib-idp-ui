import { NgModule, ModuleWithProviders } from '@angular/core';
import { HttpModule } from '@angular/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { EntityDescriptorService } from './service/entity-descriptor.service';
import { ListValuesService } from './service/list-values.service';
import { ProviderStatusEmitter, ProviderValueEmitter } from './service/provider-change-emitter.service';
import { EntityIdService } from './service/entity-id.service';
import { EntityDraftService } from './service/entity-draft.service';

import { reducers } from './reducer';
import { DraftCollectionEffects } from './effect/draft-collection.effects';
import { ProviderCollectionEffects } from './effect/provider-collection.effects';
import { FilterCollectionEffects } from './effect/filter-collection.effect';
import { MetadataResolverService } from './service/metadata-resolver.service';
import { EntityEffects } from './effect/entity.effect';
import { PreviewDialogModule } from '../shared/preview/preview-dialog.module';

@NgModule({
    declarations: [],
    entryComponents: [],
    imports: [
        HttpModule,
        PreviewDialogModule
    ],
    exports: [],
    providers: []
})
export class DomainModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RootDomainModule,
            providers: [
                EntityDescriptorService,
                EntityIdService,
                EntityDraftService,
                ListValuesService,
                ProviderStatusEmitter,
                ProviderValueEmitter,
                MetadataResolverService
            ]
        };
    }
}

@NgModule({
    imports: [
        DomainModule,
        StoreModule.forFeature('collections', reducers),
        EffectsModule.forFeature([
            FilterCollectionEffects,
            DraftCollectionEffects,
            ProviderCollectionEffects,
            EntityEffects
        ])
    ],
})
export class RootDomainModule { }
