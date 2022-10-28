import { OidcSourceWizard, OidcSourceEditor } from './definition/OidcSourceDefinition';
import { SamlSourceEditor, SamlSourceWizard } from './definition/SamlSourceDefinition';

export const MetadataSourceWizardTypes = {
    OIDC: OidcSourceWizard,
    SAML: SamlSourceWizard,
};

export const MetadataSourceEditorTypes = {
    OIDC: OidcSourceEditor,
    SAML: SamlSourceEditor,
};
