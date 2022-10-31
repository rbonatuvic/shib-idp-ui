import defaultsDeep from 'lodash/defaultsDeep';
import {API_BASE_PATH} from '../../../../App.constant';
import { SourceBase, SourceEditor, SourceWizard } from './SourceDefinition';

export const SamlSourceBase = defaultsDeep({
    label: 'SAML Metadata Source',
    type: '@MetadataProvider',
    schema: `${API_BASE_PATH}/ui/MetadataSources?protocol=SAML`,
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

export const SamlSourceEditor = defaultsDeep({
    ...SourceEditor,
}, SamlSourceBase);

export const SamlSourceWizard = defaultsDeep({
    ...SourceWizard,
}, SamlSourceBase);


