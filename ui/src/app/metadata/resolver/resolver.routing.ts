import { Routes } from '@angular/router';

import { ResolverComponent } from './container/resolver.component';
import { EditorComponent } from './container/editor.component';
import { DraftComponent } from './container/draft.component';
import { WizardComponent } from './container/wizard.component';

import { BlankResolverComponent } from './container/blank-resolver.component';
import { NewResolverComponent } from './container/new-resolver.component';
import { UploadResolverComponent } from './container/upload-resolver.component';
import { CopyResolverComponent } from './container/copy-resolver.component';
import { ConfirmCopyComponent } from './container/confirm-copy.component';
import { CopyIsSetGuard } from './guard/copy-isset.guard';

import { CanDeactivateGuard } from '../../core/service/can-deactivate.guard';

export const ResolverRoutes: Routes = [
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
    }
];
