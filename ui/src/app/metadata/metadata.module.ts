import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ResolverModule } from './resolver/resolver.module';
import { FilterModule } from './filter/filter.module';
import { DomainModule } from './domain/domain.module';
import { MetadataPageComponent } from './metadata.component';
import { StoreModule } from '@ngrx/store';
import { reducers } from './metadata.reducer';

@NgModule({
    imports: [
        ResolverModule,
        FilterModule,
        DomainModule,
        StoreModule.forFeature('metadata', reducers),
        RouterModule.forChild([
            { path: '', component: MetadataPageComponent }
        ])
    ],
    providers: [],
    declarations: [
        MetadataPageComponent
    ]
})
export class MetadataModule { }
