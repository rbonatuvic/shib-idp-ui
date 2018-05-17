import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { NewProviderComponent } from './container/new-provider.component';

import { ProviderEditorFormModule } from './component';
import { PrettyXml } from './pipe/pretty-xml.pipe';
import { UploadProviderComponent } from './container/upload-provider.component';
import { BlankProviderComponent } from './container/blank-provider.component';
import { CopyProviderComponent } from './container/copy-provider.component';
import { SharedModule } from '../shared/shared.module';
import { SearchIdEffects } from './effect/search.effect';
import * as fromProvider from './reducer';
import { ConfirmCopyComponent } from './container/confirm-copy.component';
import { CopyIsSetGuard } from './guard/copy-isset.guard';
import { CopyProviderEffects } from './effect/copy.effect';

@NgModule({
    declarations: [
        NewProviderComponent,
        UploadProviderComponent,
        BlankProviderComponent,
        CopyProviderComponent,
        ConfirmCopyComponent,
        PrettyXml
    ],
    entryComponents: [],
    imports: [
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
export class MetadataProviderModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: RootProviderModule,
            providers: [
                CopyIsSetGuard
            ]
        };
    }
}

export const routes: Routes = [
    {
        path: 'new',
        component: NewProviderComponent,
        canActivate: [],
        children: [
            { path: '', redirectTo: 'blank', pathMatch: 'prefix' },
            {
                path: 'blank',
                component: BlankProviderComponent,
                canDeactivate: []
            },
            {
                path: 'upload',
                component: UploadProviderComponent,
                canDeactivate: []
            },
            {
                path: 'copy',
                component: CopyProviderComponent,
                canDeactivate: []
            }
        ]
    },
    {
        path: 'new/copy/confirm',
        component: ConfirmCopyComponent,
        canActivate: [CopyIsSetGuard]
    }
];

@NgModule({
    imports: [
        MetadataProviderModule,
        RouterModule.forChild(routes),
        StoreModule.forFeature('provider', fromProvider.reducers),
        EffectsModule.forFeature([
            SearchIdEffects,
            CopyProviderEffects
        ])
    ],
})
export class RootProviderModule { }
