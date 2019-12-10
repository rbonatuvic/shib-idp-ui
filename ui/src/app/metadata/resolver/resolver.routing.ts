import { Routes } from '@angular/router';

import { ResolverWizardComponent } from './container/resolver-wizard.component';

import { NewResolverComponent } from './container/new-resolver.component';
import { UploadResolverComponent } from './container/upload-resolver.component';
import { CopyResolverComponent } from './container/copy-resolver.component';
import { ConfirmCopyComponent } from './container/confirm-copy.component';
import { CopyIsSetGuard } from './guard/copy-isset.guard';

import { CanDeactivateGuard } from '../../core/service/can-deactivate.guard';
import { ResolverWizardStepComponent } from './container/resolver-wizard-step.component';
import { ResolverEditComponent } from './container/resolver-edit.component';
import { ResolverEditStepComponent } from './container/resolver-edit-step.component';
import { ResolverSelectComponent } from './container/resolver-select.component';
import { MetadataResolverPageComponent } from './resolver.component';
import { IndexResolver } from '../configuration/service/index-resolver.service';

export const ResolverRoutes: Routes = [
    {
        path: 'resolver',
        component: MetadataResolverPageComponent,
        children: [
            {
                path: 'new',
                component: NewResolverComponent,
                children: [
                    { path: '', redirectTo: 'blank/common', pathMatch: 'prefix' },
                    {
                        path: 'blank/:index',
                        component: ResolverWizardComponent,
                        resolve: [IndexResolver],
                        canDeactivate: [
                            CanDeactivateGuard
                        ],
                        children: [
                            {
                                path: '',
                                component: ResolverWizardStepComponent,
                                data: { title: `Create Metadata Source`, subtitle: true },
                                resolve: []
                            }
                        ]
                    },
                    {
                        path: 'upload',
                        component: UploadResolverComponent,
                        canDeactivate: [],
                        data: { title: `Upload Metadata Source` }
                    },
                    {
                        path: 'copy',
                        component: CopyResolverComponent,
                        canDeactivate: [],
                        data: { title: `Copy Metadata Source` }
                    }
                ]
            },
            {
                path: 'new/copy/confirm',
                component: ConfirmCopyComponent,
                canActivate: [CopyIsSetGuard],
                data: { title: `Confirm Metadata Source Copy` }
            },
            {
                path: ':id',
                component: ResolverSelectComponent,
                children: [
                    {
                        path: 'edit',
                        component: ResolverEditComponent,
                        children: [
                            { path: '', redirectTo: 'common', pathMatch: 'prefix' },
                            {
                                path: ':index',
                                resolve: [IndexResolver],
                                component: ResolverEditStepComponent,
                                data: { title: `Edit Metadata Source`, subtitle: true }
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
