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
