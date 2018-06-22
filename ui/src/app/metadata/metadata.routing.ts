import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagerComponent } from './manager/container/manager.component';
import { BlankResolverComponent } from './resolver/container/blank-resolver.component';
import { NewResolverComponent } from './resolver/container/new-resolver.component';
import { UploadResolverComponent } from './resolver/container/upload-resolver.component';
import { CopyResolverComponent } from './resolver/container/copy-resolver.component';
import { ConfirmCopyComponent } from './resolver/container/confirm-copy.component';
import { CopyIsSetGuard } from './resolver/guard/copy-isset.guard';
import { MetadataPageComponent } from './metadata.component';
import { ResolverComponent } from './resolver/container/resolver.component';
import { EditorComponent } from './resolver/container/editor.component';
import { CanDeactivateGuard } from '../core/service/can-deactivate.guard';
import { DraftComponent } from './resolver/container/draft.component';
import { WizardComponent } from './resolver/container/wizard.component';
import { NewProviderComponent } from './provider/container/new-provider.component';
import { ProviderWizardComponent } from './provider/container/wizard.component';

const routes: Routes = [
    {
        path: '',
        component: MetadataPageComponent,
        children: [
            { path: '', component: ManagerComponent },
            {
                path: 'resolver',
                children: [
                    {
                        path: 'new',
                        component: NewResolverComponent,
                        children: [
                            { path: '', redirectTo: 'blank', pathMatch: 'prefix' },
                            {
                                path: 'blank',
                                component: BlankResolverComponent,
                                canDeactivate: []
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
                        component: ResolverComponent,
                        canActivate: [],
                        children: [
                            { path: 'edit', redirectTo: 'edit/2' },
                            {
                                path: 'edit/:index',
                                component: EditorComponent,
                                canDeactivate: [CanDeactivateGuard]
                            }
                        ]
                    },
                    {
                        path: ':entityId',
                        component: DraftComponent,
                        canActivate: [],
                        children: [
                            { path: 'wizard', redirectTo: 'wizard/2' },
                            {
                                path: 'wizard/:index',
                                component: WizardComponent,
                                canDeactivate: [CanDeactivateGuard]
                            }
                        ]
                    }
                ]
            },
            {
                path: 'provider',
                children: [
                    {
                        path: 'new',
                        component: NewProviderComponent
                    }
                ]
            }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class MetadataRoutingModule { }
