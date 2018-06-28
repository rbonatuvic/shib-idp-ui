import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { NewResolverComponent } from './container/new-resolver.component';

import { ProviderEditorFormModule } from '../domain/component';
import { UploadResolverComponent } from './container/upload-resolver.component';
import { BlankResolverComponent } from './container/blank-resolver.component';
import { CopyResolverComponent } from './container/copy-resolver.component';
import { ResolverComponent } from './container/resolver.component';
import { SharedModule } from '../../shared/shared.module';
import { SearchIdEffects } from './effect/search.effect';
import * as fromResolver from './reducer';
import { ConfirmCopyComponent } from './container/confirm-copy.component';
import { CopyIsSetGuard } from './guard/copy-isset.guard';
import { CopyResolverEffects } from './effect/copy.effect';
import { DomainModule } from '../domain/domain.module';
import { DraftComponent } from './container/draft.component';
import { EditorComponent } from './container/editor.component';
import { WizardComponent } from './container/wizard.component';
import { WizardNavComponent } from './component/wizard-nav.component';
import { ResolverCollectionEffects } from './effect/collection.effects';
import { DraftCollectionEffects } from './effect/draft-collection.effects';
import { WizardEffects } from './effect/wizard.effect';
import { EditorEffects } from './effect/editor.effect';
import { UnsavedDialogComponent } from './component/unsaved-dialog.component';

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
        WizardComponent,
        WizardNavComponent,
        UnsavedDialogComponent
    ],
    entryComponents: [
        UnsavedDialogComponent
    ],
    imports: [
        DomainModule,
        SharedModule,
        HttpClientModule,
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        ProviderEditorFormModule,
        NgbDropdownModule
    ],
    exports: [
        ProviderEditorFormModule,
        WizardNavComponent
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

@NgModule({
    imports: [
        ResolverModule,
        StoreModule.forFeature('resolver', fromResolver.reducers),
        EffectsModule.forFeature([
            SearchIdEffects,
            CopyResolverEffects,
            ResolverCollectionEffects,
            DraftCollectionEffects,
            WizardEffects,
            EditorEffects
        ])
    ],
})
export class RootResolverModule { }