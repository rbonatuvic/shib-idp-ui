import { Routes } from '@angular/router';

import { NewProviderComponent } from './container/new-provider.component';
import { ProviderWizardComponent } from './container/provider-wizard.component';

export const ProviderRoutes: Routes = [
    {
        path: 'provider',
        component: NewProviderComponent,
        children: [
            {
                path: 'wizard',
                redirectTo: `wizard/new`,
                pathMatch: 'prefix'
            },
            {
                path: 'wizard/new',
                component: ProviderWizardComponent,
                canActivate: []
            }
        ]
    }
];
