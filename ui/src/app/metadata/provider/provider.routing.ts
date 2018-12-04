import { Routes } from '@angular/router';

import { ProviderComponent } from './container/provider.component';
import { ProviderWizardComponent } from './container/provider-wizard.component';
import { ProviderWizardStepComponent } from './container/provider-wizard-step.component';
import { ProviderEditComponent } from './container/provider-edit.component';
import { ProviderEditStepComponent } from './container/provider-edit-step.component';
import { ProviderSelectComponent } from './container/provider-select.component';
import { ProviderFilterListComponent } from './container/provider-filter-list.component';
import { NewFilterComponent } from '../filter/container/new-filter.component';
import { SelectFilterComponent } from '../filter/container/select-filter.component';
import { EditFilterComponent } from '../filter/container/edit-filter.component';
import { CanDeactivateGuard } from '../../core/service/can-deactivate.guard';
import { FilterComponent } from '../filter/container/filter.component';

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
                        path: '',
                        component: FilterComponent,
                        children: [
                            {
                                path: 'filter/new',
                                component: NewFilterComponent
                            },
                            {
                                path: 'filter/:id',
                                component: SelectFilterComponent,
                                canActivate: [],
                                children: [
                                    {
                                        path: 'edit',
                                        component: EditFilterComponent
                                    }
                                ]
                            }
                        ]
                    },
                    {
                        path: 'filters',
                        component: ProviderFilterListComponent
                    },
                    {
                        path: 'edit',
                        component: ProviderEditComponent,
                        children: [
                            { path: '', redirectTo: 'common', pathMatch: 'prefix' },
                            {
                                path: ':form',
                                component: ProviderEditStepComponent
                            }
                        ],
                        canDeactivate: [
                            CanDeactivateGuard
                        ]
                    }
                ]
            }
        ]
    }
];
