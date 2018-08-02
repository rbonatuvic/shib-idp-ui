import { NgModule, ModuleWithProviders } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { EffectsModule } from '@ngrx/effects';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { ProviderWizardComponent } from './container/provider-wizard.component';
import { ProviderWizardStepComponent } from './container/provider-wizard-step.component';
import { ProviderWizardSummaryComponent } from './component/provider-wizard-summary.component';
import { ProviderComponent } from './container/provider.component';
import { WizardModule } from '../../wizard/wizard.module';
import * as fromProvider from './reducer';
import { EditorEffects } from './effect/editor.effect';

import { WidgetRegistry} from 'ngx-schema-form';
import { FormModule } from '../../schema-form/schema-form.module';
import { CustomWidgetRegistry } from '../../schema-form/registry';
import { SummaryPropertyComponent } from './component/summary-property.component';
import { CollectionEffects } from './effect/collection.effect';
import { SharedModule } from '../../shared/shared.module';
import { ProviderEditComponent } from './container/provider-edit.component';
import { ProviderSelectComponent } from './container/provider-select.component';
import { ProviderEditStepComponent } from './container/provider-edit-step.component';
import { EntityEffects } from './effect/entity.effect';
import { ProviderFilterListComponent } from './container/provider-filter-list.component';

import { ProviderEditorNavComponent } from './component/provider-editor-nav.component';
import { ProviderResolver } from './resolver/provider.resolver';

@NgModule({
    declarations: [
        ProviderComponent,
        ProviderWizardComponent,
        ProviderWizardStepComponent,
        ProviderWizardSummaryComponent,
        ProviderEditComponent,
        ProviderEditStepComponent,
        ProviderSelectComponent,
        ProviderFilterListComponent,
        SummaryPropertyComponent,
        ProviderEditorNavComponent
    ],
    entryComponents: [],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        WizardModule,
        RouterModule,
        SharedModule,
        FormModule,
        RouterModule,
        NgbDropdownModule
    ],
    exports: []
})
export class ProviderModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RootProviderModule,
            providers: [
                { provide: WidgetRegistry, useClass: CustomWidgetRegistry },
                ProviderResolver
            ]
        };
    }
}

@NgModule({
    imports: [
        ProviderModule,
        StoreModule.forFeature('provider', fromProvider.reducers),
        EffectsModule.forFeature([EntityEffects, EditorEffects, CollectionEffects])
    ]
})
export class RootProviderModule { }
