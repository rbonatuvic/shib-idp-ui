import { AdvancedInfoFormComponent } from '../metadata-provider/component/forms/advanced-info-form.component';
import { OrganizationInfoFormComponent } from '../metadata-provider/component/forms/organization-info-form.component';
import { MetadataUiFormComponent } from '../metadata-provider/component/forms/metadata-ui-form.component';
import { KeyInfoFormComponent } from '../metadata-provider/component/forms/key-info-form.component';
import { LogoutFormComponent } from '../metadata-provider/component/forms/logout-form.component';
import { AssertionFormComponent } from '../metadata-provider/component/forms/assertion-form.component';
import { DescriptorInfoFormComponent } from '../metadata-provider/component/forms/descriptor-info-form.component';
import { RelyingPartyFormComponent } from '../metadata-provider/component/forms/relying-party-form.component';
import { AttributeReleaseFormComponent } from '../metadata-provider/component/forms/attribute-release-form.component';
import { FinishFormComponent } from '../metadata-provider/component/forms/finish-form.component';

export interface EditorFlowDefinition {
    index: number;
    path: string;
    label: string;
    component: any;
}

export const COMMON: EditorFlowDefinition[] = [
    { index: 3, path: 'metadata-ui', label: 'User Interface / MDUI Information', component: MetadataUiFormComponent },
    { index: 4, path: 'descriptor-info', label: 'SP SSO Descriptor Information', component: DescriptorInfoFormComponent },
    { index: 5, path: 'logout-endpoints', label: 'Logout Endpoints', component: LogoutFormComponent },
    { index: 6, path: 'key-info', label: 'Security Information', component: KeyInfoFormComponent },
    { index: 7, path: 'assertion', label: 'Assertion Consumer Service', component: AssertionFormComponent },
    { index: 8, path: 'relying-party', label: 'Relying Party Overrides', component: RelyingPartyFormComponent },
    { index: 9, path: 'attribute', label: 'Attribute Release', component: AttributeReleaseFormComponent }
];

export const EDITOR: EditorFlowDefinition[] = [
    { index: 2, path: 'sp-org-info', label: 'SP/Organization Information', component: AdvancedInfoFormComponent },
    ...COMMON
];

export const WIZARD: EditorFlowDefinition[] = [
    { index: 2, path: 'org-info', label: 'Organization Information', component: OrganizationInfoFormComponent },
    ...COMMON,
    { index: 10, path: 'finish', label: 'Finished!', component: FinishFormComponent }
];
