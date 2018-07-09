import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { WizardComponent } from './component/wizard.component';
import { reducers } from './reducer';

@NgModule({
    declarations: [
        WizardComponent
    ],
    entryComponents: [],
    imports: [
        CommonModule
    ],
    exports: [
        WizardComponent
    ]
})
export class WizardModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RootWizardModule,
            providers: []
        };
    }
}

@NgModule({
    imports: [
        WizardModule,
        StoreModule.forFeature('wizard', reducers),
        EffectsModule.forFeature([]),
    ],
})
export class RootWizardModule { }
