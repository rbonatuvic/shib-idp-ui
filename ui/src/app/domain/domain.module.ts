import { NgModule, ModuleWithProviders } from '@angular/core';

import { EntityDescriptorService } from './service/entity-descriptor.service';
import { ListValuesService } from './service/list-values.service';
import { ProviderStatusEmitter, ProviderValueEmitter } from './service/provider-change-emitter.service';
import { EntityIdService } from './service/entity-id.service';
import { EntityDraftService } from './service/entity-draft.service';
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
            providers: [
                EntityDescriptorService,
                EntityIdService,
                EntityDraftService,
                ListValuesService,
                ProviderStatusEmitter,
                ProviderValueEmitter
            ]
        };
    }
}

@NgModule({
    imports: [],
})
export class RootDomainModule { }
