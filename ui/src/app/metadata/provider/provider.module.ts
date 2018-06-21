import { NgModule, ModuleWithProviders } from '@angular/core';

@NgModule({
    declarations: [],
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
        ProviderModule,
        // StoreModule.forFeature('provider', fromResolver.reducers),
        // EffectsModule.forFeature([])
    ],
})
export class RootProviderModule { }
