import { AdvancedInfoFormComponent } from '../domain/component/forms/advanced-info-form.component';
import { OrganizationInfoFormComponent } from '../domain/component/forms/organization-info-form.component';
import { MetadataUiFormComponent } from '../domain/component/forms/metadata-ui-form.component';
import { KeyInfoFormComponent } from '../domain/component/forms/key-info-form.component';
import { LogoutFormComponent } from '../domain/component/forms/logout-form.component';
import { AssertionFormComponent } from '../domain/component/forms/assertion-form.component';
import { DescriptorInfoFormComponent } from '../domain/component/forms/descriptor-info-form.component';
import { RelyingPartyFormComponent } from '../domain/component/forms/relying-party-form.component';
import { AttributeReleaseFormComponent } from '../domain/component/forms/attribute-release-form.component';
import { FinishFormComponent } from '../domain/component/forms/finish-form.component';

export interface EditorFlowDefinition {
    index: number;
    path: string;
    label: string;
    component: any;
}

export const COMMON: EditorFlowDefinition[] = [
    { index: 3, path: 'metadata-ui', label: 'label.metadata-ui', component: MetadataUiFormComponent },
    { index: 4, path: 'descriptor-info', label: 'label.descriptor-info', component: DescriptorInfoFormComponent },
    { index: 5, path: 'logout-endpoints', label: 'label.logout-endpoints', component: LogoutFormComponent },
    { index: 6, path: 'key-info', label: 'label.key-info', component: KeyInfoFormComponent },
    { index: 7, path: 'assertion', label: 'label.assertion', component: AssertionFormComponent },
    { index: 8, path: 'relying-party', label: 'label.relying-party', component: RelyingPartyFormComponent },
    { index: 9, path: 'attribute', label: 'label.attribute-release', component: AttributeReleaseFormComponent }
];

export const EDITOR: EditorFlowDefinition[] = [
    { index: 2, path: 'sp-org-info', label: 'label.sp-org-info', component: AdvancedInfoFormComponent },
    ...COMMON
];

export const WIZARD: EditorFlowDefinition[] = [
    { index: 2, path: 'org-info', label: 'label.org-info', component: OrganizationInfoFormComponent },
    ...COMMON,
    { index: 10, path: 'finish', label: 'label.finished', component: FinishFormComponent }
];
