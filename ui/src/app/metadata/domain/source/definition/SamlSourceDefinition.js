import defaultsDeep from 'lodash/defaultsDeep';
import API_BASE_PATH from '../../../../App.constant';
import { SourceBase, SourceEditor, SourceWizard } from './SourceDefinition';

export const SamlSourceBase = defaultsDeep({
    label: 'SAML Metadata Source',
    type: '@MetadataProvider',
    schema: `assets/schema/source/metadata-source-saml.json`,
    uiSchema: defaultsDeep({
        securityInfo: {
            keyDescriptors: {
                items: {
                    elementType: {
                        'ui:readonly': true
                    }
                }
            }
        }
    }, SourceBase.uiSchema)
}, SourceBase);

console.log(SamlSourceBase);

export const SamlSourceEditor = defaultsDeep({
    ...SourceEditor,
}, SamlSourceBase);

export const SamlSourceWizard = defaultsDeep({
    ...SourceWizard,
}, SamlSourceBase);


