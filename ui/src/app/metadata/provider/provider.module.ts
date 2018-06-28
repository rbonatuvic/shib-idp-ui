import { NgModule, ModuleWithProviders } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';

import { ProviderWizardComponent } from './container/provider-wizard.component';
import { NewProviderComponent } from './container/new-provider.component';
import { WizardModule } from '../../wizard/wizard.module';
import * as fromProvider from './reducer';
import { EffectsModule } from '@ngrx/effects';
import { EditorEffects } from './effect/editor.effect';
// import { SchemaFormModule } from '../../schema-form/form.module';

import { SchemaFormModule, WidgetRegistry, DefaultWidgetRegistry } from 'ngx-schema-form';
import { FormModule } from '../../schema-form/schema-form.module';
import { CustomWidgetRegistry } from '../../schema-form/registry';


@NgModule({
    declarations: [
        NewProviderComponent,
        ProviderWizardComponent
    ],
    entryComponents: [],
    imports: [
        ReactiveFormsModule,
        CommonModule,
        WizardModule,
        RouterModule,
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
        EffectsModule.forFeature([EditorEffects])
    ]
})
export class RootProviderModule { }