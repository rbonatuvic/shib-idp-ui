import React from 'react';
import { useForm } from 'react-hook-form';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight, faAsterisk, faCheck, faTimes } from '@fortawesome/free-solid-svg-icons';

import { Translate } from '../../i18n/components/translate';
import { EntityTypeahead } from './EntityTypeahead';
import kebabCase from 'lodash/kebabCase';
import { useMetadataSources } from '../hooks/api';

const sections = [
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

export function CopySource({ copy, onNext }) {

    const { data = [] } = useMetadataSources({ cachePolicy: 'no-cache' }, []);

    const [selected, setSelected] = React.useState(copy.properties);
    const onSelect = (item, checked) => {
        let s = [...selected];
        if (checked) {
            s = [...s, item.property];
        } else {
            s = s.filter(i => i === item.property);
        }
        setSelected(s);
    };
    const onSelectAll = () => {
        setSelected(sections.map(s => s.property));
    };
    const onUnselectAll = () => {
        setSelected([]);
    };

    const { register, handleSubmit, control, formState, setValue, getValues } = useForm({
        mode: 'onChange',
        reValidateMode: 'onBlur',
        defaultValues: {
            ...copy
        },
        resolver: undefined,
        context: undefined,
        criteriaMode: "firstError",
        shouldFocusError: true,
        shouldUnregister: false,
    });

    const { errors, isValid } = formState;

    React.useEffect(() => {
        setValue('properties', selected);
    }, [selected, setValue]);

    const sourceIds = data.map(p => p.entityId);

    return (
        <>
            <div className="row">
                <div className="col col-xs-12 col-xl-6">
                    <ul className="nav nav-wizard m-3">
                        <li className="nav-item">
                            <h3 className="tag tag-primary">
                                <span className="index">1</span>
                                1. <Translate value="label.name-and-entityid">Name and EntityId</Translate>
                            </h3>
                        </li>
                        <li className="nav-item">
                            <Button className="nav-link next btn d-flex justify-content-between align-items-start"
                                onClick={() => onNext(getValues())}
                                disabled={!isValid}
                                aria-label="Next: Step 2, Organization information"
                                type="button">
                                <span className="label">
                                    <Translate value="label.finish-summary-validation">
                                        Finished!
                                    </Translate>
                                </span>
                                <span className="direction d-flex flex-column align-items-center">
                                    <FontAwesomeIcon icon={faArrowCircleRight} size="2x" />
                                    <Translate value="action.next">Next</Translate>
                                </span>
                            </Button>
                        </li>
                    </ul>
                </div>
            </div>
            <div className="row">
                <div className="col col-xs-12 col-xl-6">
                    <form onSubmit={handleSubmit(onNext)}>
                        <fieldset className="bg-light border rounded p-4">
                            <div className={`form-group ${errors?.target ? 'is-invalid' : ''}`}>
                                <label htmlFor="target">
                                    <Translate value="label.select-entity-id-to-copy">Select the Entity ID to copy</Translate>
                                    <FontAwesomeIcon icon={faAsterisk} className="text-danger" />
                                </label>
                                <EntityTypeahead name="target" control={control} />
                                {errors?.target?.type === 'required' &&
                                <small id="target-help"
                                    className={`form-text text-danger ${'sr-only'}`}>
                                    <Translate value="message.target-required">Entity ID to copy is Required</Translate>
                                </small>
                                }
                            </div>
                            <div className="form-group">
                                <label htmlFor="serviceProviderName">
                                    <Translate value="label.metadata-source-name-dashboard-display-only">Metadata Source Name (Dashboard Display Only)</Translate>
                                    <FontAwesomeIcon icon={faAsterisk} className="text-danger" />
                                </label>
                                <input id="serviceProviderName" type="text" className="form-control"
                                    {...register('serviceProviderName', {required: true})}
                                    aria-describedby="serviceProviderName-help" />
                                {errors?.serviceProviderName?.type === 'required' && <small className="form-text text-danger"
                                    id="serviceProviderName-help">
                                    <Translate value="message.service-resolver-name-required">Service Resolver Name is required</Translate>
                                </small>}
                            </div>
                            <Form.Group className={`form-group ${errors.entityId ? 'text-danger' : ''}`}>
                                <Form.Label htmlFor="entityId">
                                    <Translate value="label.service-resolver-entity-id">New Entity ID</Translate>
                                    <FontAwesomeIcon icon={faAsterisk} className="text-danger" />
                                </Form.Label>
                                <Form.Control id="entityId" type="text"
                                    isInvalid={errors.entityId}
                                    aria-describedby="entityId-help" 
                                    {...register('entityId', {
                                        required: true, validate: {
                                            unique: v => !(sourceIds.indexOf(v) > -1)
                                        }
                                    })} />
                                <Form.Text className={errors.entityId ? 'text-danger' : 'text-muted'}>
                                    {errors?.entityId?.type === 'unique' && <Translate value={`message.must-be-unique`} />}
                                    {errors?.entityId?.type === 'required' && <Translate value={`message.entity-id-required`} />}
                                </Form.Text>
                            </Form.Group>
                        </fieldset>
                    </form>
                </div>
                <div className="col col-xs-12 col-xl-6">
                    <table className="table table-striped table-sm">
                        <thead>
                            <tr className="table-secondary">
                                <th><Translate value="label.sections-to-copy">Sections to Copy?</Translate></th>
                                <th><Translate value="label.yes">Yes</Translate></th>
                            </tr>
                        </thead>
                        <tbody>
                            {sections.map((item, i) =>
                                <tr key={i}>
                                    <td><label className="mb-0" htmlFor={`property-checkbox-${i}`}><Translate value={`label.${kebabCase(item.i18nKey)}`} /></label></td>
                                    <td>
                                        <Form.Check
                                            custom
                                            type={'checkbox'}
                                            id={`property-checkbox-${i}`}
                                            onChange={({ target: { checked } }) => onSelect(item, checked)}
                                            checked={selected.indexOf(item.property) > -1}
                                        />
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <td><Translate value="label.check-all-attributes">Check All Attributes</Translate></td>
                                <td>
                                    <Button variant="text" className="text-success btn-sm" onClick={() => onSelectAll()}>
                                        <FontAwesomeIcon icon={faCheck} />
                                        <span className="sr-only"><Translate value="label.check-all-attributes">Check All Attributes</Translate></span>
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td><Translate value="label.clear-all-attributes">Clear All Attributes</Translate></td>
                                <td>
                                    <Button variant="text" className="text-danger btn-sm" onClick={() => onUnselectAll()}>
                                        <FontAwesomeIcon icon={faTimes} />
                                        <span className="sr-only"><Translate value="label.clear-all-attributes">Clear All Attributes</Translate></span>
                                    </Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <Button className="nav-link next btn d-flex justify-content-between align-items-start sr-only"
                    onClick={() => onNext(getValues())}
                    disabled={!isValid}
                    aria-label="Next: Step 2, Organization information"
                    type="button">
                    <span className="label">
                        <Translate value="label.finish-summary-validation">
                            Finished!
                                    </Translate>
                    </span>
                </Button>
            </div>
        </>
    );
}