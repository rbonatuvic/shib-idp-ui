import React from 'react';
import { useForm } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import Translate from '../../i18n/components/translate';
import { InfoIcon } from '../../form/component/InfoIcon';
import { useTranslator } from '../../i18n/hooks';

export function MetadataFilterTypeSelector({ types = [], children, actions}) {

    const translator = useTranslator();

    const { register, handleSubmit, watch } = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            type: 'NameIDFormat'
        },
        resolver: undefined,
        context: undefined,
        criteriaMode: "firstError",
        shouldFocusError: true,
        shouldUnregister: false,
    });

    const type = watch('type');

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-end">
                        <div className="w-50">
                            <Form onSubmit={handleSubmit()}>
                                <Form.Group className="mb-0">
                                    <Form.Label>
                                        <span><Translate value={'label.metadata-provider-type'} /></span>
                                        <InfoIcon value="tooltip.metadata-provider-type" />
                                    </Form.Label>
                                    <Form.Control custom as="select" defaultValue={''} placeholder={translator(`label.select-metadata-type`)} {...register('type', { required: true })}>
                                        <option disabled value="">{translator(`label.select-metadata-type`)}</option>
                                        {types.map(t => <option key={t} value={t}>{t}</option>)}
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            {type && 
                children(type)
            }
        </div>
    );
}