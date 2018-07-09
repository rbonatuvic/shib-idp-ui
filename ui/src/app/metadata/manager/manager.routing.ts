import { Routes } from '@angular/router';
import { DashboardResolversListComponent } from './container/dashboard-resolvers-list.component';
import { DashboardProvidersListComponent } from './container/dashboard-providers-list.component';
import { ManagerComponent } from './container/manager.component';

export const ManagerRoutes: Routes = [
    { path: '', redirectTo: 'manager', pathMatch: 'prefix' },
    {
        path: 'manager',
        component: ManagerComponent,
        children: [
            { path: '', redirectTo: 'resolvers', pathMatch: 'prefix' },
            { path: 'resolvers', component: DashboardResolversListComponent },
            { path: 'providers', component: DashboardProvidersListComponent },
        ]
    }
];
