import { NgModule, ModuleWithProviders } from '@angular/core';

@NgModule({
    declarations: [],
    entryComponents: [],
    imports: [],
    exports: [],
    providers: []
})
export class DomainModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RootDomainModule,
            providers: []
        };
    }
}

@NgModule({
    imports: [],
})
export class RootDomainModule { }
