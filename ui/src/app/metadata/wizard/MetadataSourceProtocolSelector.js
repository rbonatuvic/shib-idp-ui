import React from 'react';
import { faArrowCircleRight, faAsterisk, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useForm } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import Translate from '../../i18n/components/translate';
import { InfoIcon } from '../../form/component/InfoIcon';
import { useTranslator } from '../../i18n/hooks';
import { useMetadataSources } from '../hooks/api';
import Button from 'react-bootstrap/Button';

export function MetadataSourceProtocolSelector({ types = [], loading, children}) {

    const [sourceNames, setSourceNames] = React.useState([]);
    const [sourceIds, setSourceIds] = React.useState([]);

    const translator = useTranslator();

    const { data = [] } = useMetadataSources({ cachePolicy: 'no-cache' }, []);

    const [showSelector, setShowSelector] = React.useState(true);

    const { register, formState, handleSubmit, getValues } = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            serviceProviderName: null,
            protocol: 'SAML',
            entityID: null,
        },
        resolver: undefined,
        context: undefined,
        criteriaMode: 'firstError',
        shouldFocusError: true,
        shouldUnregister: false,
    });

    const { isValid, errors } = formState;

    const onNext = (data) => {
        setShowSelector(false);
    };

    const onShowSelector = () => {
        setShowSelector(true);
    };

    React.useEffect(() => {
        setSourceNames(data.map(s => s.serviceProviderName));
        setSourceIds(data.map(s => s.entityId));
    }, [data]);

    React.useState(() => console.log(sourceNames), [sourceNames]);

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
                                1.&nbsp;<Translate value={`label.name-and-entity-id-protocol`} />
                            </h3>
                        </li>
                        <li className="nav-item">
                            {isValid &&
                            <Button
                                className="nav-link next btn d-flex justify-content-between align-items-start"
                                onClick={() => onNext(getValues())}
                                aria-label={() => <Translate value={`label.common-attributes`} />}
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
                                <Form.Group className="mb-3">
                                    <Form.Label>
                                        <span>
                                            <Translate value={'label.metadata-source-protocol'} />
                                            <FontAwesomeIcon icon={faAsterisk} className="ms-2 text-danger" size="sm" />
                                            {loading && <FontAwesomeIcon icon={faSpinner} size="lg" spin={true} pulse={true} className="ms-2" /> }
                                        </span>
                                        <InfoIcon value="tooltip.metadata-source-protocol" />
                                    </Form.Label>
                                    <Form.Select disabled={loading} defaultValue={''} placeholder={translator(`label.select-source-protocol`)} {...register('protocol', {required: true})}>
                                        <option disabled value="">{translator(`label.select-metadata-source-protocol`)}</option>
                                        {types.map(t => <option key={t.value} value={t.value}><Translate value={t.label} /></option>)}
                                    </Form.Select>
                                </Form.Group>
                                <Form.Group className={`${errors.serviceProviderName ? 'text-danger' : ''} mb-3`}>
                                    <Form.Label>
                                        <span>
                                            <Translate value={'label.metadata-source-name-dashboard-display-only'} />
                                            <FontAwesomeIcon icon={faAsterisk} className="ms-2 text-danger" size="sm" /> 
                                        </span>
                                        <InfoIcon value="tooltip.metadata-source-name" />
                                    </Form.Label>
                                    <Form.Control
                                        isInvalid={errors.serviceProviderName}
                                        type="text" {...register('serviceProviderName', {required: true, validate: {
                                            unique: v => !(sourceNames.indexOf(v) > -1)
                                        }})} />
                                    <Form.Text className={errors.serviceProviderName ? 'text-danger' : 'text-muted'}>
                                        {errors?.serviceProviderName?.type === 'unique' && <Translate value={`message.must-be-unique`} />}
                                        {errors?.serviceProviderName?.type === 'required' && <Translate value={`message.service-resolver-name-required`} />}
                                    </Form.Text>
                                </Form.Group>
                                <Form.Group className={`${errors.entityId ? 'text-danger' : ''} mb-3`}>
                                    <Form.Label>
                                        <span>
                                            <Translate value={'label.entity-id'} />
                                            <FontAwesomeIcon icon={faAsterisk} className="ms-2 text-danger" size="sm" /> 
                                        </span>
                                        <InfoIcon value="tooltip.entity-id" />
                                    </Form.Label>
                                    <Form.Control
                                        isInvalid={errors.entityId}
                                        type="text" {...register('entityId', {required: true, validate: {
                                            unique: v => !(sourceIds.indexOf(v) > -1)
                                        }})} />
                                    <Form.Text className={errors.entityId ? 'text-danger' : 'text-muted'}>
                                        {errors?.entityId?.type === 'unique' && <Translate value={`message.must-be-unique`} />}
                                        {errors?.entityId?.type === 'required' && <Translate value={`message.service-resolver-name-required`} />}
                                    </Form.Text>
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