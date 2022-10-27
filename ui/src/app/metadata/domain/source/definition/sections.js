import { useMetadataSchemaContext } from '../../../hoc/MetadataSchema';

export const sections = [
    { i18nKey: 'organizationInformation', property: 'organization' },
    { i18nKey: 'contacts', property: 'contacts' },
    { i18nKey: 'uiMduiInfo', property: 'mdui' },
    { i18nKey: 'spSsoDescriptorInfo', property: 'serviceProviderSsoDescriptor' },
    { i18nKey: 'logoutEndpoints', property: 'logoutEndpoints' },
    { i18nKey: 'securityDescriptorInfo', property: 'securityInfo' },
    { i18nKey: 'assertionConsumerServices', property: 'assertionConsumerServices' },
    { i18nKey: 'relyingPartyOverrides', property: 'relyingPartyOverrides' },
    { i18nKey: 'attributeRelease', property: 'attributeRelease' }
];

export function useMetadataSourceSections() {
    const schema = useMetadataSchemaContext();

    const keys = Object.keys(schema.properties);
    const properties = sections.map((s) => s.property);
    
    const reduced = keys.reduce(
        (collection, key) => {
            if (properties.indexOf(key) > -1) {
                collection.push(sections.find(s => s.property === key));
            }
            return collection;
        },
        []
    );

    return reduced;
}