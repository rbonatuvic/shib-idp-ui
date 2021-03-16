import { Routes } from '@angular/router';

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
import { AdminGuard } from '../../core/service/admin.guard';
import { MetadataProviderPageComponent } from './provider.component';

export const ProviderRoutes: Routes = [
    {
        path: 'provider',
        component: MetadataProviderPageComponent,
        canActivate: [AdminGuard],
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
                        component: ProviderWizardStepComponent,
                        data: { title: `Create Provider`, subtitle: true }
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
                            { path: '', redirectTo: 'common', pathMatch: 'prefix' },
                            {
                                path: ':form',
                                component: ProviderEditStepComponent,
                                data: { title: `Edit Metadata Provider`, subtitle: true }
                            }
                        ],
                        canDeactivate: [
                            CanDeactivateGuard
                        ]
                    },
                    {
                        path: 'filters',
                        component: ProviderFilterListComponent,
                        data: { title: `Metadata Filter List` }
                    }
                ]
            },
            {
                path: ':providerId/filter',
                component: FilterComponent,
                children: [
                    {
                        path: 'new',
                        component: NewFilterComponent,
                        data: { title: `Create New Filter` }
                    },
                    {
                        path: ':filterId',
                        component: SelectFilterComponent,
                        canActivate: [],
                        children: [
                            {
                                path: 'edit',
                                component: EditFilterComponent,
                                data: { title: `Edit Metadata Filter` }
                            }
                        ]
                    }
                ]
            }
        ]
    }
];
