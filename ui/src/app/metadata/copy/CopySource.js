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
import { useMetadataSourceSections } from '../domain/source/definition/sections';

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

    const { register, handleSubmit, control, formState, setValue, getValues, watch } = useForm({
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

    const target = watch('target');

    const { errors, isValid } = formState;

    React.useEffect(() => {
        setValue('properties', selected);
    }, [selected, setValue]);

    const sourceIds = data.map(p => p.entityId);

    const sections = useMetadataSourceSections();

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
                            <Form.Group className={`mb-3 ${errors.target ? 'is-invalid text-danger' : ''}`}>
                                <EntityTypeahead id="target" name="target" control={control}>
                                    <span>
                                        <Translate value="label.select-entity-id-to-copy">Select the Entity ID to copy</Translate>
                                        <FontAwesomeIcon icon={faAsterisk} className="text-danger ms-2" />
                                    </span>
                                </EntityTypeahead>
                                <Form.Text id="target-help"
                                        className={`text-danger ${errors?.target?.type === 'required' ? '' : 'sr-only'}`}>
                                    <Translate value="message.target-required">Entity ID to copy is Required</Translate>
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className={`mb-3 ${errors.serviceProviderName ? 'text-danger is-invalid' : ''}`}>
                                <Form.Label htmlFor="serviceProviderName">
                                    <span>
                                    <Translate value="label.metadata-source-name-dashboard-display-only">Metadata Source Name (Dashboard Display Only)</Translate>
                                    <FontAwesomeIcon icon={faAsterisk} className="text-danger ms-2" />
                                    </span>
                                </Form.Label>
                                <Form.Control id="serviceProviderName" type="text" className="form-control"
                                    {...register('serviceProviderName', {required: true})}
                                    aria-describedby="serviceProviderName-help" disabled={!target} />
                                <Form.Text className={`form-text text-danger ${errors?.serviceProviderName?.type === 'required' ? '' : 'sr-only'}`}
                                    id="serviceProviderName-help">
                                    <Translate value="message.service-resolver-name-required">Service Resolver Name is required</Translate>
                                </Form.Text>
                            </Form.Group>
                            <Form.Group className={`${errors.entityId ? 'is-invalid text-danger' : ''}`}>
                                <Form.Label htmlFor="entityId">
                                    <span>
                                    <Translate value="label.service-resolver-entity-id">New Entity ID</Translate>
                                    <FontAwesomeIcon icon={faAsterisk} className="text-danger ms-2" />
                                    </span>
                                </Form.Label>
                                <Form.Control id="entityId" type="text"
                                    isInvalid={errors.entityId}
                                    aria-describedby="entityId-help" 
                                    disabled={!target}
                                    {...register('entityId', {
                                        required: true, validate: {
                                            unique: v => !(sourceIds.indexOf(v) > -1)
                                        }
                                    })} />
                                <Form.Text className={errors?.entityId ? 'text-danger' : 'sr-only'} id="entityId-help">
                                    {errors?.entityId?.type === 'required' &&
                                        <Translate value="message.entity-id-required">Entity ID is required</Translate>
                                    }
                                    {errors?.entityId?.type === 'unique' &&
                                        <Translate value="message.entity-id-must-be-unique">Entity ID must be unique</Translate>
                                    }
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
                                    <td><span className="mb-0" id={`property-checkbox-${i}`}><Translate value={`label.${kebabCase(item.i18nKey)}`} /></span></td>
                                    <td>
                                        <Form.Check
                                            custom={'true'}
                                            type={'checkbox'}
                                            id={`property-checkbox-${i}-check`}
                                            onChange={({ target: { checked } }) => onSelect(item, checked)}
                                            checked={selected.indexOf(item.property) > -1}
                                            aria-labelledby={`property-checkbox-${i}`}
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