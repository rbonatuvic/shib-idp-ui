import { NgModule, ModuleWithProviders } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { ProviderWizardComponent } from './container/provider-wizard.component';
import { ProviderWizardStepComponent } from './container/provider-wizard-step.component';
import { ProviderWizardSummaryComponent } from './component/provider-wizard-summary.component';
import { ProviderComponent } from './container/provider.component';
import { WizardModule } from '../../wizard/wizard.module';
import * as fromProvider from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { EditorEffects } from './effect/editor.effect';

import { WidgetRegistry} from 'ngx-schema-form';
import { FormModule } from '../../schema-form/schema-form.module';
import { CustomWidgetRegistry } from '../../schema-form/registry';
import { SummaryPropertyComponent } from './component/summary-property.component';
import { CollectionEffects } from './effect/collection.effect';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
    declarations: [
        ProviderComponent,
        ProviderWizardComponent,
        ProviderWizardStepComponent,
        ProviderWizardSummaryComponent,
        SummaryPropertyComponent
    ],
    entryComponents: [],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        WizardModule,
        RouterModule,
        SharedModule,
        FormModule
    ],
    exports: []
})
export class ProviderModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RootProviderModule,
            providers: [
                { provide: WidgetRegistry, useClass: CustomWidgetRegistry }
            ]
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
