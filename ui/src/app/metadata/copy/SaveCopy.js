import React from 'react';
import Check from 'react-bootstrap/FormCheck';
import Button from 'react-bootstrap/Button';
import { faArrowCircleLeft, faCheck, faSave, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useForm } from 'react-hook-form';

import { MetadataDefinitionContext, MetadataSchemaContext } from '../hoc/MetadataSchema';
import { useMetadataConfiguration } from '../hooks/configuration';
import { removeNull } from '../../core/utility/remove_null';

import { MetadataConfiguration } from '../component/MetadataConfiguration';
import Translate from '../../i18n/components/translate';

import { InfoIcon } from '../../form/component/InfoIcon';


export function useCopiedModel (copy) {
    const { properties, target, serviceProviderName, entityId } = copy;
    const copied = removeNull(properties.reduce((c, section) => ({ ...c, ...{ [section]: target[section] } }), {}));
    const model = {
        serviceProviderName,
        entityId,
        ...copied
    };
    return model;
}

export function useCopiedConfiguration(model, schema, definition) {
    return useMetadataConfiguration([model], schema, definition);
}

export function SaveCopy ({ copy, saving, onSave, onBack }) {
    const definition = React.useContext(MetadataDefinitionContext);
    const schema = React.useContext(MetadataSchemaContext);

    const model = useCopiedModel(copy);
    const configuration = useCopiedConfiguration(model, schema, definition);

    const { register, handleSubmit } = useForm({
        mode: 'onChange',
        reValidateMode: 'onBlur',
        defaultValues: {
            serviceEnabled: false
        },
        resolver: undefined,
        context: undefined,
        criteriaMode: "firstError",
        shouldFocusError: true,
        shouldUnregister: false,
    });

    const onFinish = (data) => {
        onSave({
            ...model,
            ...data
        })
    };

    return (
    <>
            <div className="row">
                <div className="col col-xs-12">
                    <ul className="nav nav-wizard m-3">
                        <li className="nav-item">
                            <Button type="button" className="nav-link previous btn d-flex justify-content-between align-items-start" onClick={onBack}>
                                <span className="direction d-flex flex-column align-items-center">
                                    <FontAwesomeIcon icon={faArrowCircleLeft} size="2x" />
                                    <Translate value="action.back">Back</Translate>
                                </span>
                                <span className="label">
                                    <Translate value="label.name-and-entityid">
                                    Name and Entity ID.
                                    </Translate>
                                </span>
                            </Button>
                        </li>
                        <li className="nav-item">
                            <h3 className="tag tag-primary">
                                <span className="index">
                                    <FontAwesomeIcon icon={faCheck} />
                                </span>
                                <Translate value="label.finish-summary-validation">Finished!</Translate>
                            </h3>
                        </li>
                        <li className="nav-item">
                            <Button className="nav-link save btn d-flex justify-content-between align-items-start" aria-label="Save" onClick={() => handleSubmit(onFinish)()} type="button">
                                <span className="label"><Translate value="action.save">Save</Translate></span>
                                <span className="direction d-flex flex-column align-items-center">
                                    <FontAwesomeIcon icon={saving ? faSpinner : faSave} pulse={saving} size="2x" />
                                    <Translate value="action.save">Save</Translate>
                                </span>
                            </Button>
                        </li>
                    </ul>
                </div>
            </div>
            <form onSubmit={ handleSubmit(onFinish) }>
                <div className="row">
                    <fieldset className="col-xl-6 form-section">
                        <section className="entity-section">
                            <div className="form-group d-flex">
                                <label htmlFor="serviceEnabled" className="mr-2"><Translate value="label.enable-this-service" /></label>
                                <Check custom
                                    id="serviceEnabled"
                                    className="mr-2"
                                    type={'checkbox'}
                                    {...register('serviceEnabled')}
                                />
                                <InfoIcon value={`tooltip.enable-this-service-upon-saving`} placement="right" />
                            </div>
                        </section>
                    </fieldset>
                </div>
            </form>

        <MetadataConfiguration configuration={configuration} />
    </>
    );
}