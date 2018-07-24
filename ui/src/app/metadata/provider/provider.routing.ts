import { Routes } from '@angular/router';

import { ProviderComponent } from './container/provider.component';
import { ProviderWizardComponent } from './container/provider-wizard.component';
import { ProviderWizardStepComponent } from './container/provider-wizard-step.component';
import { ProviderEditComponent } from './container/provider-edit.component';
import { ProviderEditStepComponent } from './container/provider-edit-step.component';
import { ProviderSelectComponent } from './container/provider-select.component';
import { ProviderFilterListComponent } from './container/provider-filter-list.component';

export const ProviderRoutes: Routes = [
    {
        path: 'provider',
        component: ProviderComponent,
        children: [
            {
                path: 'wizard',
                redirectTo: `wizard/new`
            },
            {
                path: 'wizard',
                component: ProviderWizardComponent,
                canActivate: [],
                children: [
                    {
                        path: 'new',
                        component: ProviderWizardStepComponent
                    }
                ]
            },
            {
                path: ':providerId',
                component: ProviderSelectComponent,
                children: [
                    {
                        path: 'edit',
                        component: ProviderEditComponent,
                        children: [
                            {
                                path: 'filter-list',
                                component: ProviderFilterListComponent
                            },
                            {
                                path: ':form',
                                component: ProviderEditStepComponent
                            }
                        ]
                    }
                ]
            }
        ]
    }
];
