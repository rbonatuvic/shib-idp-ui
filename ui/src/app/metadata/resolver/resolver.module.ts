import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { NewResolverComponent } from './container/new-resolver.component';

import { ProviderEditorFormModule } from '../domain/component';
import { UploadResolverComponent } from './container/upload-resolver.component';
import { BlankResolverComponent } from './container/blank-resolver.component';
import { CopyResolverComponent } from './container/copy-resolver.component';
import { ResolverComponent } from './container/resolver.component';
import { SharedModule } from '../../shared/shared.module';
import { SearchIdEffects } from './effect/search.effect';
import * as fromProvider from './reducer';
import { ConfirmCopyComponent } from './container/confirm-copy.component';
import { CopyIsSetGuard } from './guard/copy-isset.guard';
import { CopyResolverEffects } from './effect/copy.effect';
import { DomainModule } from '../domain/domain.module';
import { DraftComponent } from './container/draft.component';
import { EditorComponent } from './container/editor.component';
import { WizardComponent } from './container/wizard.component';

@NgModule({
    declarations: [
        NewResolverComponent,
        UploadResolverComponent,
        BlankResolverComponent,
        CopyResolverComponent,
        ConfirmCopyComponent,
        ResolverComponent,
        DraftComponent,
        EditorComponent,
        WizardComponent
    ],
    entryComponents: [],
    imports: [
        DomainModule,
        SharedModule,
        HttpClientModule,
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        ProviderEditorFormModule
    ],
    exports: [
        ProviderEditorFormModule
    ],
    providers: []
})
export class ResolverModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RootResolverModule,
            providers: [
                CopyIsSetGuard
            ]
        };
    }
}

export const routes: Routes = [
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
            }
        ]
    }
];

@NgModule({
    imports: [
        ResolverModule,
        RouterModule.forChild(routes),
        StoreModule.forFeature('provider', fromProvider.reducers),
        EffectsModule.forFeature([
            SearchIdEffects,
            CopyResolverEffects
        ])
    ],
})
export class RootResolverModule { }
