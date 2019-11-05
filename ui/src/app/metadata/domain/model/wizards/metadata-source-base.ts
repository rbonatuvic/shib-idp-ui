import { Wizard, WizardStep } from '../../../../wizard/model';
import { MetadataResolver } from '../metadata-resolver';
import { FormProperty } from 'ngx-schema-form/lib/model/formproperty';
import { ArrayProperty } from 'ngx-schema-form/lib/model/arrayproperty';
import { ObjectProperty } from 'ngx-schema-form/lib/model/objectproperty';
import { getAllOtherIds } from '../../../resolver/reducer';

/*istanbul ignore next */
export class MetadataSourceBase implements Wizard<MetadataResolver> {
    label = 'Metadata Source';
    type = '@MetadataProvider';
    steps: WizardStep[] = [];
    schema = '';

    validatorParams = [getAllOtherIds];

    bindings = {
        '/securityInfo/x509CertificateAvailable': [
            {
                'input': (event, property: FormProperty) => {
                    let available = !property.value,
                        parent = property.parent,
                        certs = parent.getProperty('x509Certificates');
                    if (available && !certs.value.length) {
                        certs.setValue([
                            {
                                name: '',
                                type: 'both',
                                value: ''
                            }
                        ], true);
                    }

                    if (!available && certs.value.length > 0) {
                        certs.setValue([], true);
                    }
                }
            }
        ],
        '/assertionConsumerServices/*/makeDefault': [
            {
                'input': (event, property: FormProperty) => {
                    let parent = property.parent.parent as ArrayProperty;
                    let props = parent.properties as ObjectProperty[];
                    props.forEach(prop => {
                        if (prop !== property) {
                            prop.setValue({
                                ...prop.value,
                                makeDefault: false
                            }, false);
                        }
                    });
                }
            }
        ]
    };

    parser(changes: Partial<MetadataResolver>, schema?: any): any {
        if (!changes.organization) {
            changes.organization = {};
        }
        return changes;
    }

    formatter(changes: Partial<MetadataResolver>, schema?: any): any {
        return changes;
    }

    getValidators(entityIdList: string[]): { [key: string]: any } {
        const validators = {
            '/': (value, property, form_current) => {
                let errors;
                // iterate all customer
                Object.keys(value).forEach((key) => {
                    const item = value[key];
                    const validatorKey = `/${key}`;
                    const validator = validators.hasOwnProperty(validatorKey) ? validators[validatorKey] : null;
                    const error = validator ? validator(item, form_current.getProperty(key), form_current) : null;
                    if (error) {
                        errors = errors || [];
                        errors.push(error);
                    }
                });
                return errors;
            },
            '/entityId': (value, property, form) => {
                const err = entityIdList.indexOf(value) > -1 ? {
                    code: 'INVALID_ID',
                    path: `#${property.path}`,
                    message: 'message.id-unique',
                    params: [value]
                } : null;
                return err;
            },
            '/relyingPartyOverrides': (value, property, form) => {
                if (!value.signAssertion && value.dontSignResponse) {
                    return {
                        code: 'INVALID_SIGNING',
                        path: `#${property.path}`,
                        message: 'message.invalid-signing',
                        params: [value]
                    };
                }
                return null;
            }
        };
        return validators;
    }
}
