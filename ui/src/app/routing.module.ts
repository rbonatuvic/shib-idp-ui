import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
    {
        path: 'dashboard',
        loadChildren: './dashboard/dashboard.module#DashboardModule',
        canActivate: []
    },
    {
        path: 'provider',
        loadChildren: './edit-provider/editor.module#EditorModule',
        canActivate: []
    },
    {
        path: 'filter',
        loadChildren: './metadata-filter/filter.module#FilterModule',
        canActivate: []
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
