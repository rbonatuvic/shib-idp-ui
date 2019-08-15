import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { RouterModule } from '@angular/router';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap';

import { I18nModule } from '../../i18n/i18n.module';
import { MetadataConfigurationComponent } from './component/metadata-configuration.component';
import { ConfigurationComponent } from './container/configuration.component';
import { MetadataConfigurationService } from './service/configuration.service';
import * as fromConfig from './reducer';
import { MetadataConfigurationEffects } from './effect/configuration.effect';
import { ConfigurationPropertyComponent } from './component/property/configuration-property.component';
import { PrimitivePropertyComponent } from './component/property/primitive-property.component';
import { ObjectPropertyComponent } from './component/property/object-property.component';
import { ArrayPropertyComponent } from './component/property/array-property.component';
import { FilterTargetPropertyComponent } from './component/property/filter-target-property.component';

import { MetadataOptionsComponent } from './container/metadata-options.component';
import { MetadataXmlComponent } from './container/metadata-xml.component';
import { MetadataHeaderComponent } from './component/metadata-header.component';
import { MetadataHistoryEffects } from './effect/history.effect';
import { MetadataHistoryService } from './service/history.service';
import { MetadataHistoryComponent } from './container/metadata-history.component';
import { HistoryListComponent } from './component/history-list.component';
import { DomainModule } from '../domain/domain.module';
import { MetadataComparisonComponent } from './container/metadata-comparison.component';
import { CompareVersionEffects } from './effect/compare.effect';
import { FilterModule } from '../filter/filter.module';
import { FilterConfigurationListComponent } from './component/filter-configuration-list.component';
import { FilterConfigurationListItemComponent } from './component/filter-configuration-list-item.component';
import { SharedModule } from '../../shared/shared.module';

import { RestoreComponent } from './container/restore.component';
import { RestoreEffects } from './effect/restore.effect';
import { VersionComponent } from './container/version.component';
import { VersionOptionsComponent } from './container/version-options.component';
import { VersionEffects } from './effect/version.effect';
import { MetadataEditorComponent } from './component/editor.component';
import { WizardModule } from '../../wizard/wizard.module';
import { FormModule } from '../../schema-form/schema-form.module';
import { RestoreEditComponent } from './container/restore-edit.component';
import { RestoreEditStepComponent } from './container/restore-edit-step.component';

import { IndexResolver } from './service/index-resolver.service';

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
        MetadataHeaderComponent,
        MetadataHistoryComponent,
        HistoryListComponent,
        MetadataComparisonComponent,
        FilterConfigurationListComponent,
        FilterConfigurationListItemComponent,
        FilterTargetPropertyComponent,
        RestoreComponent,
        VersionComponent,
        VersionOptionsComponent,
        MetadataEditorComponent,
        RestoreEditComponent,
        RestoreEditStepComponent
    ],
    entryComponents: [],
    imports: [
        CommonModule,
        I18nModule,
        NgbPopoverModule,
        RouterModule,
        DomainModule,
        FilterModule,
        SharedModule,
        WizardModule,
        FormModule
    ],
    exports: [],
    providers: [
        DatePipe,
        IndexResolver
    ]
})
export class MetadataConfigurationModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RootMetadataConfigurationModule,
            providers: [
                MetadataConfigurationService,
                MetadataHistoryService
            ]
        };
    }
}

@NgModule({
    imports: [
        MetadataConfigurationModule,
        StoreModule.forFeature('metadata-configuration', fromConfig.reducers),
        EffectsModule.forFeature(
            [
                MetadataConfigurationEffects,
                MetadataHistoryEffects,
                CompareVersionEffects,
                RestoreEffects,
                VersionEffects
            ])
    ],
    providers: []
})
export class RootMetadataConfigurationModule { }
