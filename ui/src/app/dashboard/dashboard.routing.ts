import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardPageComponent } from './container/dashboard.component';
import { ManagerComponent } from '../metadata/manager/container/manager.component';
import { MetadataPageComponent } from '../metadata/metadata.component';
import { DashboardResolversListComponent } from '../metadata/manager/container/dashboard-resolvers-list.component';
import { DashboardProvidersListComponent } from '../metadata/manager/container/dashboard-providers-list.component';
import { UserPageComponent } from '../user/user.component';
import { AdminComponent } from '../user/admin/admin.component';
import { AdminManagementPageComponent } from '../user/admin/container/admin-management.component';
import { AdminGuard } from '../core/service/admin.guard';

const routes: Routes = [
    {
        path: '',
        component: DashboardPageComponent,
        children: [
            { path: '', redirectTo: 'metadata', pathMatch: 'prefix' },
            {
                path: 'metadata',
                component: MetadataPageComponent,
                children: [
                    { path: '', redirectTo: 'manager', pathMatch: 'prefix' },
                    {
                        path: 'manager',
                        component: ManagerComponent,
                        children: [
                            { path: '', redirectTo: 'resolvers', pathMatch: 'prefix' },
                            { path: 'resolvers', component: DashboardResolversListComponent },
                            { path: 'providers', component: DashboardProvidersListComponent, canActivate: [AdminGuard] },
                        ]
                    }
                ]
            },
            {
                path: 'users',
                component: UserPageComponent,
                canActivate: [AdminGuard],
                children: [
                    { path: '', redirectTo: 'admin', pathMatch: 'prefix' },
                    {
                        path: 'admin',
                        component: AdminComponent,
                        children: [
                            { path: '', redirectTo: 'management', pathMatch: 'prefix' },
                            {
                                path: 'management',
                                component: AdminManagementPageComponent
                            }
                        ]
                    }
                ]
            }
        ],
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
    ],
    exports: [RouterModule]
})
export class DashboardRoutingModule { }
