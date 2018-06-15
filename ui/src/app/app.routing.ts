import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: '/metadata/manager', pathMatch: 'full' },
    {
        path: 'metadata',
        loadChildren: './metadata/metadata.module#MetadataModule'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
