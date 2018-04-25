import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
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


@NgModule({
    declarations: [
        NewProviderComponent,
        UploadProviderComponent,
        BlankProviderComponent,
        PrettyXml,
    ],
    entryComponents: [],
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
        RouterModule.forChild([
            { path: 'new', component: NewProviderComponent }
        ]),
    ],
})
export class RootProviderModule { }
