import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { WizardComponent } from './component/wizard.component';
import { reducers } from './reducer';
import { I18nModule } from '../i18n/i18n.module';
import { WizardService } from './service/wizard.service';

@NgModule({
    declarations: [
        WizardComponent
    ],
    entryComponents: [],
    imports: [
        CommonModule,
        I18nModule
    ],
    exports: [
        WizardComponent
    ]
})
export class WizardModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RootWizardModule,
            providers: [WizardService]
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
