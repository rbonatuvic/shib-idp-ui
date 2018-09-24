import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbPopoverModule } from '@ng-bootstrap/ng-bootstrap/popover/popover.module';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';

import { AdvancedInfoFormComponent } from './forms/advanced-info-form.component';
import { OrganizationInfoFormComponent } from './forms/organization-info-form.component';
import { MetadataUiFormComponent } from './forms/metadata-ui-form.component';
import { KeyInfoFormComponent } from './forms/key-info-form.component';
import { AssertionFormComponent } from './forms/assertion-form.component';
import { DescriptorInfoFormComponent } from './forms/descriptor-info-form.component';
import { RelyingPartyFormComponent } from './forms/relying-party-form.component';
import { AttributeReleaseFormComponent } from './forms/attribute-release-form.component';
import { LogoutFormComponent } from './forms/logout-form.component';
import { FinishFormComponent } from './forms/finish-form.component';
import { ProviderFormFragmentComponent } from './forms/provider-form-fragment.component';

import { SharedModule } from '../../../shared/shared.module';
import { DomainModule } from '../../domain/domain.module';
import { I18nModule } from '../../../i18n/i18n.module';

export const COMPONENTS = [
    AdvancedInfoFormComponent,
    OrganizationInfoFormComponent,
    MetadataUiFormComponent,
    KeyInfoFormComponent,
    AssertionFormComponent,
    LogoutFormComponent,
    DescriptorInfoFormComponent,
    RelyingPartyFormComponent,
    AttributeReleaseFormComponent,
    FinishFormComponent,
    ProviderFormFragmentComponent
];

export const declarations = [
    ...COMPONENTS,
];

@NgModule({
    declarations: declarations,
    entryComponents: COMPONENTS,
    exports: [
        ...declarations
    ],
    imports: [
        CommonModule,
        DomainModule,
        ReactiveFormsModule,
        RouterModule,
        NgbPopoverModule,
        NgbModalModule,
        SharedModule,
        I18nModule
    ],
    providers: []
})
export class ProviderEditorFormModule {}
