import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { DraftEffects } from './effect/draft.effects';
import { ProviderEffects } from './effect/provider.effects';
import { reducers } from './reducer';

import { NewProviderComponent } from './container/new-provider.component';


import { ProviderEditorFormModule } from './component';
import { PreviewProviderDialogComponent } from './component/preview-provider-dialog.component';
import { PretttyXml } from './pipe/pretty-xml.pipe';
import { UploadProviderComponent } from './container/upload-provider.component';
import { BlankProviderComponent } from './container/blank-provider.component';


@NgModule({
    declarations: [
        NewProviderComponent,
        UploadProviderComponent,
        BlankProviderComponent,
        PreviewProviderDialogComponent,
        PretttyXml,
    ],
    entryComponents: [
        PreviewProviderDialogComponent
    ],
    imports: [
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
            providers: []
        };
    }
}

@NgModule({
    imports: [
        MetadataProviderModule,
        StoreModule.forFeature('providers', reducers),
        EffectsModule.forFeature([DraftEffects, ProviderEffects]),
        RouterModule.forChild([
            { path: 'new', component: NewProviderComponent }
        ]),
    ],
})
export class RootProviderModule { }
