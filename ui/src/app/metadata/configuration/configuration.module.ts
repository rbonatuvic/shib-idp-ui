import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { I18nModule } from '../../i18n/i18n.module';
import { MetadataConfigurationComponent } from './component/metadata-configuration.component';
import { ConfigurationComponent } from './container/configuration.component';
import { MetadataConfigurationService } from './service/configuration.service';
import * as fromConfig from './reducer';
import { MetadataConfigurationEffects } from './effect/configuration.effect';

@NgModule({
    declarations: [
        MetadataConfigurationComponent,
        ConfigurationComponent
    ],
    entryComponents: [],
    imports: [
        CommonModule,
        I18nModule
    ],
    exports: [],
    providers: []
})
export class MetadataConfigurationModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RootMetadataConfigurationModule,
            providers: [
                MetadataConfigurationService
            ]
        };
    }
}

@NgModule({
    imports: [
        MetadataConfigurationModule,
        StoreModule.forFeature('metadata-configuration', fromConfig.reducers),
        EffectsModule.forFeature([MetadataConfigurationEffects])
    ],
    providers: []
})
export class RootMetadataConfigurationModule { }
