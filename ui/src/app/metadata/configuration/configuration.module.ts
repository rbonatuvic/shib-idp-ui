import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { I18nModule } from '../../i18n/i18n.module';
import { MetadataConfigurationComponent } from './component/metadata-configuration.component';
import { ConfigurationComponent } from './container/configuration.component';
import { MetadataConfigurationService } from './service/configuration.service';
import * as fromConfig from './reducer';
import { MetadataConfigurationEffects } from './effect/configuration.effect';
import { ConfigurationPropertyComponent } from './component/configuration-property.component';
import { DomainModule } from '../domain/domain.module';
import { PrimitivePropertyComponent } from './component/primitive-property.component';
import { ObjectPropertyComponent } from './component/object-property.component';
import { ArrayPropertyComponent } from './component/array-property.component';
import { RouterModule } from '@angular/router';
import { MetadataOptionsComponent } from './container/metadata-options.component';
import { MetadataXmlComponent } from './container/metadata-xml.component';
import { MetadataHeaderComponent } from './component/metadata-header.component';

@NgModule({
    declarations: [
        MetadataConfigurationComponent,
        MetadataOptionsComponent,
        MetadataXmlComponent,
        ConfigurationPropertyComponent,
        PrimitivePropertyComponent,
        ObjectPropertyComponent,
        ArrayPropertyComponent,
        ConfigurationComponent,
        MetadataHeaderComponent
    ],
    entryComponents: [],
    imports: [
        CommonModule,
        I18nModule,
        NgbPopoverModule,
        RouterModule
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
