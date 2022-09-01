import React from 'react';
import Button from 'react-bootstrap/Button';
import { useFieldArray, useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faSave, faTrash } from '@fortawesome/free-solid-svg-icons';

import Translate from '../../i18n/components/translate';
import PropertySelector from './PropertySelector';

import { useProperties } from '../hoc/PropertiesProvider';

import Form from 'react-bootstrap/Form';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import { useTranslator } from '../../i18n/hooks';
import { includes } from 'lodash';

export function ConfigurationForm({ configurations, configuration = {}, loading, onSave, onCancel }) {

    const [names, setNames] = React.useState([]);

    const { control, register, getValues, watch, formState: { errors, isValid }, handleSubmit } = useForm({
        defaultValues: {
            ...configuration
        },
        reValidateMode: 'onChange',
        mode: 'onChange',
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "properties",
    });

    const properties = useProperties();
    const selected = watch('properties');

    const addProperties = (props) => {

        const parsed = props.reduce((coll, prop, idx) => {
            if (prop.isCategory) {
                return [...coll, ...properties.filter(p => p.category === prop.category)];
            } else {
                return [...coll, prop];
            }
        }, []);

        const names = selected.map(p => p.propertyName);

        const filtered = parsed.filter(p => includes(names, p.propertyName) ? false : true);

        append(filtered);
    };

    const saveConfig = (formValues) => {
        const parsed = formValues.properties.map(p => ({
            propertyName: p.propertyName,
            propertyValue: p.propertyValue,
            configFile: p.configFile,
            category: p.category,
            displayType: p.displayType
        }));
        onSave({
            ...formValues,
            properties: parsed
        });
    };

    const translator = useTranslator();

    React.useEffect(() => {
        setNames(configurations.map(p => p.name));
    }, [configurations]);

    const onNext = (data) => {};

    return (<>
        <div className="container-fluid">
            <div className="d-flex justify-content-end align-items-center">
                <React.Fragment>
                    <Button variant="info" className="me-2"
                        type="button"
                        onClick={() => saveConfig(getValues())}
                        disabled={ !isValid || loading}
                        aria-label="Save changes to the metadata source. You will return to the dashboard">
                        <FontAwesomeIcon icon={loading ? faSpinner : faSave} pulse={loading} />&nbsp;
                        <Translate value="action.save">Save</Translate>
                    </Button>
                    <Button variant="secondary"
                        type="button"
                        onClick={() => onCancel()}
                        disabled={loading}
                        aria-label="Cancel changes, go back to dashboard">
                        <Translate value="action.cancel">Cancel</Translate>
                    </Button>
                </React.Fragment>
            </div>
            <hr />
            <Form onSubmit={handleSubmit(onNext)}>
                <div className="row">
                    <div className="col-12 col-lg-5">
                        <Form.Group className="mb-3" controlId="formName">
                            <Form.Label><Translate value="label.configuration-name">Name</Translate></Form.Label>
                            <Form.Control
                                type="text"
                                required
                                isInvalid={errors.name}
                                placeholder={translator('label.configuration-name-placeholder')}
                                {...register(`name`, {
                                    required: true,
                                    validate: {
                                        unique: v => !includes(names, v)
                                    }
                                })} />
                            <Form.Text className={errors.name ? 'text-danger' : 'text-muted'}>
                                {errors?.name?.type === 'unique' && <Translate value={`message.must-be-unique`} />}
                                {errors?.name?.type === 'required' && <Translate value={`message.name-required`} />}
                            </Form.Text>
                        </Form.Group>
                    </div>
                </div>
                <div className="row">
                    <div className="col-12 col-lg-6 order-2">
                        <div className="d-flex align-items-end">
                            <PropertySelector options={properties} properties={fields} onAddProperties={ addProperties } />
                        </div>
                    </div>
                </div>
                <div className="my-4"></div>
                <div className='row'>
                    <div className='col-12'>
                        <table className='w-100 table align-middle'>
                            <thead>
                                <tr>
                                    <th><Translate value="label.configuration-property">Property</Translate></th>
                                    <th><Translate value="label.configuration-category">Category</Translate></th>
                                    <th><Translate value="label.configuration-type">Type</Translate></th>
                                    <th><Translate value="label.configuration-value">Value</Translate></th>
                                    <th className="text-end"><Translate value="label.configuration-action">Action</Translate></th>
                                </tr>
                            </thead>
                            <tbody>
                                {fields.map((p, idx) => (
                                    <tr key={p.id}>
                                        <td>{ p.propertyName }</td>
                                        <td>{ p.category }</td>
                                        <td>{ p.displayType }</td>
                                        <td>
                                            {p.displayType !== 'boolean' ?
                                                <FloatingLabel
                                                    controlId={`valueInput-${p.propertyName}`}
                                                    label={translator('label.configuration-value')}>
                                                    <Form.Control
                                                        type={p.displayType === 'number' ? 'number' : 'text'}
                                                        placeholder="value"
                                                        {...register(`properties.${idx}.propertyValue`)} />
                                                </FloatingLabel>
                                            :
                                                <Form.Check type="switch"
                                                    label={ watch(`properties.${idx}.propertyValue`) === true ? translator('value.true') : translator('value.false') }
                                                    reverse={'true'} {...register(`properties.${idx}.propertyValue`)}
                                                    className="my-3" />
                                            }
                                        </td>
                                        <td className="text-end">
                                            <Button variant="danger" onClick={() => remove(idx)}>
                                                <FontAwesomeIcon icon={faTrash} size="lg" />
                                                &nbsp; <Translate value="action.remove">Remove</Translate>
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Form>
        </div>
    </>)
}
