import React from 'react';
import { useForm } from 'react-hook-form';
import Form from 'react-bootstrap/Form';
import Translate from '../../i18n/components/translate';
import { InfoIcon } from '../../form/component/InfoIcon';
import { useTranslator } from '../../i18n/hooks';

export function MetadataFilterTypeSelector({ types = [], children}) {

    const translator = useTranslator();

    const { register, handleSubmit, watch } = useForm({
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            type: null
        },
        resolver: undefined,
        context: undefined,
        criteriaMode: "firstError",
        shouldFocusError: true,
        shouldUnregister: false,
    });

    const type = watch('type');

    const [base, setBase] = React.useState({});

    React.useEffect(() => {
        setBase({
            '@type': type
        });
    }, [type])

    return (
        <div className="container-fluid">
            <div className="row">
                <div className="col-12">
                    <div className="d-flex justify-content-between align-items-end">
                        <div className="w-50">
                            <Form onSubmit={handleSubmit()}>
                                <Form.Group className="mb-0">
                                    <Form.Label>
                                        <span><Translate value={'label.metadata-filter-type'} /></span>
                                        <InfoIcon value="tooltip.metadata-filter-type" />
                                    </Form.Label>
                                    <Form.Select
                                        defaultValue={''}
                                        placeholder={translator(`label.select-metadata-filter-type`)}
                                        {...register('type', { required: true })}>
                                        <option disabled value="">{translator(`label.select-metadata-filter-type`)}</option>
                                        {types.map(t => <option key={t} value={t}>{t}</option>)}
                                    </Form.Select>
                                </Form.Group>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            {type && 
                children(type, base)
            }
        </div>
    );
}