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
import { CreateDraftResolverService } from './service/create-draft.resolver';

export const ResolverRoutes: Routes = [
    {
        path: 'resolver',
        children: [
            {
                path: 'new',
                component: NewResolverComponent,
                resolve: {
                    draft: CreateDraftResolverService
                },
                children: [
                    { path: '', redirectTo: 'blank/common', pathMatch: 'prefix' },
                    {
                        path: 'blank/:index',
                        component: ResolverWizardComponent,
                        canDeactivate: [
                            CanDeactivateGuard
                        ],
                        children: [
                            {
                                path: '',
                                component: ResolverWizardStepComponent
                            }
                        ]
                    },
                    {
                        path: 'upload',
                        component: UploadResolverComponent,
                        canDeactivate: []
                    },
                    {
                        path: 'copy',
                        component: CopyResolverComponent,
                        canDeactivate: []
                    }
                ]
            },
            {
                path: 'new/copy/confirm',
                component: ConfirmCopyComponent,
                canActivate: [CopyIsSetGuard]
            },
            {
                path: ':id',
                component: ResolverSelectComponent,
                canActivate: [],
                children: [
                    {
                        path: 'edit',
                        component: ResolverEditComponent,
                        children: [
                            { path: '', redirectTo: 'common', pathMatch: 'prefix' },
                            {
                                path: ':form',
                                component: ResolverEditStepComponent
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
