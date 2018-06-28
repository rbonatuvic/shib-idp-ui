import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagerComponent } from './manager/container/manager.component';
import { MetadataPageComponent } from './metadata.component';

import { ResolverRoutes } from './resolver/resolver.routing';
import { ProviderRoutes } from './provider/provider.routing';

const routes: Routes = [
    {
        path: '',
        component: MetadataPageComponent,
        children: [
            { path: '', component: ManagerComponent },
            ...ResolverRoutes,
            ...ProviderRoutes
        ]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
})
export class MetadataRoutingModule { }
