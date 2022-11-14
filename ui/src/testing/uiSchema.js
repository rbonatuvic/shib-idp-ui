const schema = {
    "ui:order": {
        "0": "serviceProviderName",
        "1": "*",
        "ui:widget": "hidden"
    },
    "layout": {
        "groups": [
            {
                "sizes": {
                    "xs": 12,
                },
                "fields": [
                    "protocol",
                    "serviceProviderName",
                    "entityId",
                    "organization"
                ]
            },
            {
                "sizes": {
                    "xs": 6,
                },
                "fields": [
                    "contacts"
                ]
            },
            {
                "sizes": {
                    "xs": 12,
                },
                "fields": [
                    "mdui"
                ]
            },
            {
                "sizes": {
                    "xs": 12,
                },
                "fields": [
                    "serviceProviderSsoDescriptor"
                ]
            },
            {
                "sizes": {
                    "xs": 12,
                    "xxl": 8
                },
                "fields": [
                    "logoutEndpoints"
                ]
            },
            {
                "sizes": {
                    "xs": 12,
                },
                "fields": [
                    "securityInfo"
                ]
            },
            {
                "sizes": {
                    "xs": 12,
                },
                "fields": [
                    "assertionConsumerServices"
                ]
            },
            {
                "sizes": {
                    "xs": 12,
                },
                "fields": [
                    "relyingPartyOverrides"
                ]
            },
            {
                "sizes": {
                    "xs": 12,
                },
                "fields": [
                    "attributeRelease"
                ]
            }
        ],
        "ui:widget": "hidden"
    },
    "serviceEnabled": {
         "ui:widget": "hidden"
    },
    "contacts": {
        "ui:options": {
            "orderable": false
        },
        "type": "contact",
        "ui:title": false
    },
    "attributeRelease": {
        "ui:widget": "hidden"
    },
    "logoutEndpoints": {
        "type": "endpoint",
        "ui:options": {
            "orderable": false
        },
        "ui:title": false,
        "ui:widget": "hidden"
    },
    "assertionConsumerServices": {
        "type": "service",
        "ui:options": {
            "orderable": false
        },
        "ui:title": false,
        "ui:widget": "hidden"
    },
    "relyingPartyOverrides": {
        "nameIdFormats": {
            "ui:options": {
                "orderable": false
            },
            "items": {
                "ui:widget": "OptionWidget"
            }
        },
        "authenticationMethods": {
            "ui:options": {
                "orderable": false
            },
            "items": {
                "ui:widget": "OptionWidget"
            }
        },
        "ui:widget": "hidden"
    },
    "serviceProviderSsoDescriptor": {
        "protocolSupportEnum": {
            "ui:placeholder": "label.select-protocol"
        },
        "nameIdFormats": {
            "ui:options": {
                "orderable": false
            },
            "items": {
                "ui:widget": "OptionWidget"
            }
        },
        "ui:widget": "hidden"
    },
    "securityInfo": {
        "layout": {
            "groups": [
                {
                    "sizes": {
                        "xs": 12,
                        "xxl": 8,
                    },
                    "fields": [
                        "authenticationRequestsSigned",
                        "wantAssertionsSigned",
                        "keyDescriptors"
                    ]
                }
            ]
        },
        "authenticationRequestsSigned": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true
            }
        },
        "wantAssertionsSigned": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true
            }
        },
        "keyDescriptors": {
            "type": "certificate",
            "ui:options": {
                "orderable": false
            },
            "ui:order": [
                "name",
                "elementType",
                "type",
                "value",
            ],
            "items": {
                "type": {
                    "ui:widget": "radio",
                    "ui:description": false,
                    "ui:options": {
                        "inline": true
                    }
                },
                "value": {
                    "ui:widget": "textarea"
                }
            }
        },
        "ui:widget": "hidden"
    },
    "mdui": {
        "layout": {
            "groups": [
                {
                    "sizes": {
                        "lg": 6,
                        "xs": 12,
                    },
                    "fields": [
                        "displayName",
                        "informationUrl",
                        "description"
                    ]
                },
                {
                    "sizes": {
                        "lg": 6,
                        "xs": 12,
                    },
                    "fields": [
                        "privacyStatementUrl",
                        "logoUrl",
                        "logoWidth",
                        "logoHeight"
                    ]
                }
            ]
        },
        "description": {
            "ui:widget": "textarea"
        },
        "logoHeight": {
            "ui:widget": "updown"
        },
        "logoWidth": {
            "ui:widget": "updown"
        },
        "ui:widget": "hidden"
    },
    "serviceProviderName": {},
    "entityId": {},
    "organization": {},
    "protocol": {
        "ui:readonly": true,
    },
    "ui:disabled": false
};

export default schema;