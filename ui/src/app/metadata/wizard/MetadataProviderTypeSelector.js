import React from 'react';
import { faArrowCircleRight, faAsterisk, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useForm } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Translate from '../../i18n/components/translate';
import { InfoIcon } from '../../form/component/InfoIcon';
import { useTranslator } from '../../i18n/hooks';
import { useMetadataProviders } from '../hooks/api';

export function MetadataProviderTypeSelector({ type, types = [], loading, children}) {

    const translator = useTranslator();

    const { data = [] } = useMetadataProviders({cachePolicy: 'no-cache'}, []);

    const [showSelector, setShowSelector] = React.useState(true);

    const { register, formState, handleSubmit, getValues } = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            name: null,
            type: null
        },
        resolver: undefined,
        context: undefined,
        criteriaMode: "firstError",
        shouldFocusError: true,
        shouldUnregister: false,
    });

    const { isValid, errors } = formState;

    const onNext = (data) => {
        setShowSelector(false);
    };

    const onShowSelector = () => {
        setShowSelector(true);
    }

    const providerNames = data.map(p => p.name);

    return (
        <>{showSelector ?
            <>
                <nav>
                    <ul className="nav nav-wizard">
                        <li className="nav-item">
                            <h3 className="tag tag-primary">
                                <span className="index">
                                    1
                                </span>
                                1.&nbsp;<Translate value={`label.select-metadata-${type}-type`} />
                            </h3>
                        </li>
                        <li className="nav-item">
                            {isValid &&
                            <Button className="nav-link next btn d-flex justify-content-between align-items-start text-white" onClick={() => onNext(getValues())} aria-label={() => <Translate value={`label.common-attributes`} />}
                                    type="button">
                                    <span className="label">
                                    2.&nbsp;
                                    <Translate value={`label.common-attributes`}>{`label.common-attributes`}</Translate>
                                    </span>
                                    <span className="direction d-flex flex-column align-items-center">
                                        <FontAwesomeIcon icon={faArrowCircleRight} size="2x" />
                                        <Translate value="action.next">Next</Translate>
                                    </span>
                                </Button>
                            }
                        </li>
                    </ul>
                </nav>
                <hr />
                <div className="row">
                    <div className="col col-xl-6 col-lg-9 col-xs-12">
                        <div className="bg-light border rounded px-4 pt-4 pb-1">
                            <Form onSubmit={handleSubmit(onNext)}>
                                <Form.Group className={`${errors.name ? 'text-danger' : ''} mb-3`}>
                                    <Form.Label>
                                        <span>
                                            <Translate value={'label.metadata-provider-name-dashboard-display-only'} />
                                            <FontAwesomeIcon icon={faAsterisk} className="ms-2 text-danger" size="sm" /> 
                                        </span>
                                        <InfoIcon value="tooltip.metadata-provider-name" />
                                    </Form.Label>
                                    <Form.Control
                                        isInvalid={errors.name}
                                        type="text" {...register('name', {required: true, validate: {
                                            unique: v => !(providerNames.indexOf(v) > -1)
                                        }})} />
                                    <Form.Text className={errors.name ? 'text-danger' : 'text-muted'}>
                                        {errors?.name?.type === 'unique' && <Translate value={`message.must-be-unique`} />}
                                        {errors?.name?.type === 'required' && <Translate value={`message.service-resolver-name-required`} />}
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <span>
                                            <Translate value={'label.metadata-provider-type'} />
                                            <FontAwesomeIcon icon={faAsterisk} className="ms-2 text-danger" size="sm" />
                                            {loading && <FontAwesomeIcon icon={faSpinner} size="lg" spin={true} pulse={true} className="ms-2" /> }
                                        </span>
                                        <InfoIcon value="tooltip.metadata-provider-type" />
                                    </Form.Label>
                                    <Form.Select disabled={loading} defaultValue={''} placeholder={translator(`label.select-metadata-type`)} {...register('type', {required: true})}>
                                        <option disabled value="">{translator(`label.select-metadata-type`)}</option>
                                        {types.map(t => <option key={t} value={t}>{t}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </Form>
                        </div>
                    </div>
                </div>
            </>
            :
            children(getValues(), onShowSelector)
            }
        </>
        );
}