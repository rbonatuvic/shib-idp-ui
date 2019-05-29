import { Routes } from '@angular/router';
import { ConfigurationComponent } from './container/configuration.component';

export const ConfigurationRoutes: Routes = [
    {
        path: ':type/:id/configuration',
        component: ConfigurationComponent
    }
];
