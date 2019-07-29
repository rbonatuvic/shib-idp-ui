import { NgModule, ModuleWithProviders } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { EffectsModule } from '@ngrx/effects';
import { NgbDropdownModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { ProviderWizardComponent } from './container/provider-wizard.component';
import { ProviderWizardStepComponent } from './container/provider-wizard-step.component';
import { WizardModule } from '../../wizard/wizard.module';
import * as fromProvider from './reducer';
import { EditorEffects } from './effect/editor.effect';

import { FormModule } from '../../schema-form/schema-form.module';
import { CollectionEffects } from './effect/collection.effect';
import { SharedModule } from '../../shared/shared.module';
import { ProviderEditComponent } from './container/provider-edit.component';
import { ProviderSelectComponent } from './container/provider-select.component';
import { ProviderEditStepComponent } from './container/provider-edit-step.component';
import { ProviderFilterListComponent } from './container/provider-filter-list.component';

import { ContentionModule } from '../../contention/contention.module';
import { DeleteFilterComponent } from './component/delete-filter.component';
import { I18nModule } from '../../i18n/i18n.module';
import { DomainModule } from '../domain/domain.module';
import { MetadataProviderPageComponent } from './provider.component';
import { FilterModule } from '../filter/filter.module';

@NgModule({
    declarations: [
        ProviderWizardComponent,
        ProviderWizardStepComponent,
        ProviderEditComponent,
        ProviderEditStepComponent,
        ProviderSelectComponent,
        ProviderFilterListComponent,
        DeleteFilterComponent,
        MetadataProviderPageComponent
    ],
    entryComponents: [
        DeleteFilterComponent
    ],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        WizardModule,
        RouterModule,
        SharedModule,
        FormModule,
        RouterModule,
        ContentionModule,
        NgbDropdownModule,
        NgbModalModule,
        I18nModule,
        DomainModule,
        FilterModule
    ],
    exports: []
})
export class ProviderModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RootProviderModule
        };
    }
}

@NgModule({
    imports: [
        ProviderModule,
        StoreModule.forFeature('provider', fromProvider.reducers),
        EffectsModule.forFeature([EditorEffects, CollectionEffects])
    ]
})
export class RootProviderModule { }
