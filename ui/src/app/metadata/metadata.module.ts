import { NgModule } from '@angular/core';


import { ResolverModule } from './resolver/resolver.module';
import { FilterModule } from './filter/filter.module';
import { DomainModule } from './domain/domain.module';
import { MetadataPageComponent } from './metadata.component';
import { ManagerModule } from './manager/manager.module';
import { MetadataRoutingModule } from './metadata.routing';


@NgModule({
    imports: [
        ResolverModule.forRoot(),
        FilterModule.forRoot(),
        DomainModule.forRoot(),
        ManagerModule.forRoot(),
        MetadataRoutingModule
    ],
    providers: [],
    declarations: [
        MetadataPageComponent
    ]
})
export class MetadataModule { }
