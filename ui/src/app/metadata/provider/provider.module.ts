import { NgModule, ModuleWithProviders } from '@angular/core';
import { ProviderWizardComponent } from './container/wizard.component';
import { NewProviderComponent } from './container/new-provider.component';

@NgModule({
    declarations: [
        NewProviderComponent,
        ProviderWizardComponent
    ],
    entryComponents: [],
    imports: [],
    exports: []
})
export class ProviderModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RootProviderModule,
            providers: []
        };
    }
}

@NgModule({
    imports: [
        ProviderModule
        // StoreModule.forFeature('provider', fromResolver.reducers),
        // EffectsModule.forFeature([])
    ]
})
export class RootProviderModule { }
