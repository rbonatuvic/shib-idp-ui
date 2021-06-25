export const SCHEMA = {
    'title': 'MetadataResolver',
    'type': 'object',
    'widget': {
        'id': 'fieldset'
    },
    'properties': {
        'name': {
            'title': 'Metadata Provider Name (Dashboard Display Only)',
            'description': 'Metadata Provider Name (Dashboard Display Only)',
            'type': 'string',
            'widget': {
                'id': 'string',
                'help': 'Must be unique.'
            }
        },
        '@type': {
            'title': 'Metadata Provider Type',
            'description': 'Metadata Provider Type',
            'ui:placeholder': 'Select a metadata provider type',
            'type': 'string',
            'widget': {
                'id': 'select'
            },
            'oneOf': [
                {
                    'enum': [
                        'FileBackedHttpMetadataResolver'
                    ],
                    'description': 'FileBackedHttpMetadataProvider'
                }
            ]
        },
        'list': {
            'title': 'label.retained-roles',
            'description': 'tooltip.retained-roles',
            'type': 'array',
            'items': {
                'widget': {
                    'id': 'select'
                },
                'type': 'string',
                'oneOf': [
                    {
                        'enum': [
                            'SPSSODescriptor'
                        ],
                        'description': 'value.spdescriptor'
                    },
                    {
                        'enum': [
                            'AttributeAuthorityDescriptor'
                        ],
                        'description': 'value.attr-auth-descriptor'
                    }
                ]
            }
        },
        'formatFilterTarget': {
            'title': 'label.search-criteria',
            'description': 'tooltip.search-criteria',
            'type': 'object',
            'widget': {
                'id': 'filter-target',
                'target': 'formatFilterTargetType'
            },
            'properties': {
                'formatFilterTargetType': {
                    'title': '',
                    'type': 'string',
                    'default': 'ENTITY',
                    'oneOf': [
                        {
                            'enum': [
                                'ENTITY'
                            ],
                            'description': 'value.entity-id'
                        },
                        {
                            'enum': [
                                'REGEX'
                            ],
                            'description': 'value.regex'
                        },
                        {
                            'enum': [
                                'CONDITION_SCRIPT'
                            ],
                            'description': 'value.script'
                        }
                    ]
                },
                'value': {
                    'type': 'array',
                    'minItems': 1,
                    'uniqueItems': true,
                    'items': {
                        'type': 'string'
                    }
                }
            },
            'required': [
                'value',
                'nameIdFormatFilterTargetType'
            ]
        }
    },
    'required': [
        'name',
        '@type'
    ],
    'fieldsets': [
        {
            'type': 'section',
            'fields': [
                'name',
                '@type'
            ]
        }
    ],
    'definitions': {
        'description': {
            'title': 'Description',
            'description': 'A description of the object',
            'type': 'string',
            'widget': 'string'
        }
    }
};

export default SCHEMA;