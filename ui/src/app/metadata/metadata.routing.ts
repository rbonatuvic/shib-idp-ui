import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MetadataPageComponent } from './metadata.component';

import { ResolverRoutes } from './resolver/resolver.routing';
import { ProviderRoutes } from './provider/provider.routing';
import { ManagerRoutes } from './manager/manager.routing';
import { VersionRoutes } from './version/version.routing';
import { ConfigurationRoutes } from './configuration/configuration.routing';

const routes: Routes = [
    {
        path: '',
        component: MetadataPageComponent,
        children: [
            ...ManagerRoutes,
            ...ResolverRoutes,
            ...ProviderRoutes,
            ...VersionRoutes,
            ...ConfigurationRoutes
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
