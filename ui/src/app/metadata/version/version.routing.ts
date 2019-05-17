import { Routes } from '@angular/router';
import { VersionHistoryComponent } from './container/version-history.component';

export const VersionRoutes: Routes = [
    {
        path: ':type/:id/versions',
        component: VersionHistoryComponent
    }
];
