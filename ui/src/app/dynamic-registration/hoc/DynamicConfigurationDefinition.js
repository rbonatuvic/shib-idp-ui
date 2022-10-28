import { BASE_PATH } from '../../App.constant';

export const DynamicRegistrationDefinition = {
    label: 'Dynamic Registration',
    type: '@DynamicRegistration',
    steps: [
        {
            id: 'common',
            label: 'label.dynamic-registration',
            index: 1,
            fields: [
                'name',
                'resourceId',
                'redirectUris',
                'responseTypes',
                'grantTypes',
                'applicationType',
                'contacts',
                'subjectType',
                'jwks',
                'jwksUri',
                'tokenEndpointAuthMethod',
                'logoUri',
                'policyUri',
                'tosUri',
                'scope'
            ]
        }
    ],
    schema: `${BASE_PATH}assets/schema/dynamic-registration/oidc.json`,

    uiSchema: {
        layout: {
            groups: [
                {
                    size: 6,
                    classNames: '',
                    fields: [
                        'name',
                        'resourceId',
                        'redirectUris',
                        'responseTypes',
                        'grantTypes',
                        'applicationType',
                        'contacts',
                        'subjectType',
                        'jwks',
                        'jwksUri',
                        'tokenEndpointAuthMethod',
                        'logoUri',
                        'policyUri',
                        'tosUri',
                        'scope'
                    ]
                },
            ]
        },
    },

    parser: (changes) => changes,
    formatter: (changes) => changes,
    display: (changes) => changes,
}

export default DynamicRegistrationDefinition;

