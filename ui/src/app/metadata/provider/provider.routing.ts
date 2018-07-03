import { Routes } from '@angular/router';

import { ProviderComponent } from './container/provider.component';
import { ProviderWizardComponent } from './container/provider-wizard.component';
import { ProviderWizardSummaryComponent } from './container/provider-wizard-summary.component';
import { ProviderWizardStepComponent } from './container/provider-wizard-step.component';

export const ProviderRoutes: Routes = [
    {
        path: 'provider',
        component: ProviderComponent,
        children: [
            {
                path: 'wizard',
                redirectTo: `wizard/new`,
                pathMatch: 'prefix'
            },
            {
                path: 'wizard',
                component: ProviderWizardComponent,
                canActivate: [],
                children: [
                    {
                        path: 'new',
                        component: ProviderWizardStepComponent
                    },
                    {
                        path: 'summary',
                        component: ProviderWizardSummaryComponent,
                        canActivate: []
                    }
                ]
            }
        ]
    }
];
