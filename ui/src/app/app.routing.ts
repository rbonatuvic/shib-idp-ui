import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
    },
    {
        path: 'metadata',
        loadChildren: () => import('./metadata/metadata.module').then(m => m.MetadataModule)
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    scrollOffset: [0, 64],
    anchorScrolling: 'enabled',
    scrollPositionRestoration: 'enabled',
    relativeLinkResolution: 'legacy',
    paramsInheritanceStrategy: 'always'
})],
    exports: [RouterModule]
})
export class AppRoutingModule { }
