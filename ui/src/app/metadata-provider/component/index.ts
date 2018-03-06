import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap/popover/popover.module';
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

import { InfoLabelDirective } from '../directive/info-label.directive';
import { InputDefaultsDirective } from '../directive/input-defaults.directive';
import { I18nTextComponent } from './i18n-text.component';

import { ValidationClassDirective } from '../../widget/validation/validation-class.directive';
import { AutoCompleteComponent } from '../../widget/autocomplete/autocomplete.component';



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
    ProviderFormFragmentComponent,
    AutoCompleteComponent
];

export const declarations = [
    ...COMPONENTS,
    InfoLabelDirective,
    InputDefaultsDirective,
    ValidationClassDirective,
    I18nTextComponent
];

@NgModule({
    declarations: declarations,
    entryComponents: COMPONENTS,
    exports: declarations,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterModule,
        NgbPopoverModule,
        NgbModalModule
    ],
    providers: []
})
export class ProviderEditorFormModule {}
