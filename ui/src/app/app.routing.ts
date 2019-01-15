import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule'
    },
    {
        path: 'metadata',
        loadChildren: './metadata/metadata.module#MetadataModule'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, {
        preloadingStrategy: PreloadAllModules
    })],
    exports: [RouterModule]
})
export class AppRoutingModule { }
