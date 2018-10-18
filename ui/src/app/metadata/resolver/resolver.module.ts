import { NgModule, ModuleWithProviders } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { NgbDropdownModule, NgbPopoverModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';

import { NewResolverComponent } from './container/new-resolver.component';
import { UploadResolverComponent } from './container/upload-resolver.component';
import { BlankResolverComponent } from './container/blank-resolver.component';
import { CopyResolverComponent } from './container/copy-resolver.component';
import { SharedModule } from '../../shared/shared.module';
import { SearchIdEffects } from './effect/search.effect';
import * as fromResolver from './reducer';
import { ConfirmCopyComponent } from './container/confirm-copy.component';
import { CopyIsSetGuard } from './guard/copy-isset.guard';
import { CopyResolverEffects } from './effect/copy.effect';
import { DomainModule } from '../domain/domain.module';
import { ResolverWizardComponent } from './container/resolver-wizard.component';
import { ResolverCollectionEffects } from './effect/collection.effects';
import { DraftCollectionEffects } from './effect/draft-collection.effects';
import { WizardEffects } from './effect/wizard.effect';
import { I18nModule } from '../../i18n/i18n.module';
import { MetadataSourceWizard } from '../domain/model/wizards/metadata-source-wizard';
import { METADATA_SOURCE_WIZARD, METADATA_SOURCE_EDITOR } from './wizard-definition';
import { EntityEffects } from './effect/entity.effect';
import { ResolverWizardStepComponent } from './container/resolver-wizard-step.component';
import { WizardModule } from '../../wizard/wizard.module';
import { FormModule } from '../../schema-form/schema-form.module';
import { ResolverEditComponent } from './container/resolver-edit.component';
import { ResolverEditStepComponent } from './container/resolver-edit-step.component';
import { ResolverSelectComponent } from './container/resolver-select.component';
import { MetadataSourceEditor } from '../domain/model/wizards/metadata-source-editor';
import { FinishFormComponent } from './component/finish-form.component';
import { ProviderFormFragmentComponent } from './component/provider-form-fragment.component';

@NgModule({
    declarations: [
        NewResolverComponent,
        UploadResolverComponent,
        BlankResolverComponent,
        CopyResolverComponent,
        ConfirmCopyComponent,
        ResolverEditComponent,
        ResolverEditStepComponent,
        ResolverSelectComponent,
        ResolverWizardComponent,
        ResolverWizardStepComponent,
        FinishFormComponent,
        ProviderFormFragmentComponent
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
        NgbDropdownModule,
        I18nModule,
        WizardModule,
        FormModule,
        NgbPopoverModule,
        NgbModalModule
    ],
    exports: [],
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
            EntityEffects
        ])
    ],
    providers: [
        { provide: METADATA_SOURCE_WIZARD, useClass: MetadataSourceWizard },
        { provide: METADATA_SOURCE_EDITOR, useClass: MetadataSourceEditor }
    ]
})
export class RootResolverModule { }
