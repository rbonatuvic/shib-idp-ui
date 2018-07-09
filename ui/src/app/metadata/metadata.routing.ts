import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MetadataPageComponent } from './metadata.component';

import { ResolverRoutes } from './resolver/resolver.routing';
import { ProviderRoutes } from './provider/provider.routing';
import { ManagerRoutes } from './manager/manager.routing';

const routes: Routes = [
    {
        path: '',
        component: MetadataPageComponent,
        children: [
            ...ManagerRoutes,
            ...ResolverRoutes,
            ...ProviderRoutes
        ],
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
})
export class MetadataRoutingModule { }
