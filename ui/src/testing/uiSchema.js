const schema = {
    "ui:order": {
        "0": "serviceProviderName",
        "1": "*",
        "ui:widget": "hidden"
    },
    "layout": {
        "groups": [
            {
                "size": 6,
                "fields": [
                    "serviceProviderName",
                    "entityId",
                    "organization"
                ]
            },
            {
                "size": 6,
                "fields": [
                    "contacts"
                ]
            },
            {
                "size": 12,
                "fields": [
                    "mdui"
                ]
            },
            {
                "size": 6,
                "fields": [
                    "serviceProviderSsoDescriptor"
                ]
            },
            {
                "size": 6,
                "fields": [
                    "logoutEndpoints"
                ]
            },
            {
                "size": 12,
                "fields": [
                    "securityInfo"
                ]
            },
            {
                "size": 6,
                "fields": [
                    "assertionConsumerServices"
                ]
            },
            {
                "size": 6,
                "fields": [
                    "relyingPartyOverrides"
                ]
            },
            {
                "size": 6,
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
                    "size": 6,
                    "fields": [
                        "authenticationRequestsSigned",
                        "wantAssertionsSigned",
                        "x509Certificates"
                    ]
                }
            ]
        },
        "x509CertificateAvailable": {
            "ui:widget": "hidden"
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
        "x509Certificates": {
            "type": "certificate",
            "ui:options": {
                "orderable": false
            },
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
                    "size": 6,
                    "fields": [
                        "displayName",
                        "informationUrl",
                        "description"
                    ]
                },
                {
                    "size": 6,
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
    "ui:disabled": false
};

export default schema;