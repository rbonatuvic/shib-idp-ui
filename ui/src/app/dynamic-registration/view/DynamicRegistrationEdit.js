import React, { Fragment, useCallback } from 'react';
import { Prompt, useHistory, useParams } from 'react-router-dom';

import Translate from '../../i18n/components/translate';
import { Schema } from '../../form/Schema';
import { FormManager } from '../../form/FormManager';
import { DynamicRegistrationForm } from '../component/DynamicRegistrationForm';
import DynamicConfigurationDefinition from '../hoc/DynamicConfigurationDefinition';
import { useSelectDynamicRegistrationQuery, useUpdateDynamicRegistrationMutation } from '../../store/dynamic-registration/DynamicRegistrationSlice';
import Spinner from '../../core/components/Spinner';

export function DynamicRegistrationEdit () {

    const { id } = useParams();
    const history = useHistory();
    const [update, {isSuccess}] = useUpdateDynamicRegistrationMutation();

    const {data: detail, isFetching: loading} = useSelectDynamicRegistrationQuery({id});

    const cancel = () => {
        gotoDetail();
    };

    const gotoDetail = useCallback((state = null) => {
        setBlocking(false);
        history.push(`/dynamic-registration/${id}`, state);
    }, [id, history]);

    const [blocking, setBlocking] = React.useState(false);

    React.useEffect(() => {
        if (isSuccess) {
            gotoDetail({ refresh: true });
        }
    }, [isSuccess, gotoDetail]);

    return (
        <Fragment>
            {detail &&
                <div className="container-fluid p-3">
                    <Prompt
                        when={blocking}
                        message={location =>
                            `message.unsaved-editor`
                        }
                    />
                    <section className="section" tabIndex="0">
                        <div className="section-header bg-info p-2 text-white">
                            <div className="row justify-content-between">
                                <div className="col-md-12">
                                    <span className="lead"><Translate value="label.edit-dynamic-registration">Edit Dynamic Registration</Translate></span>
                                </div>
                            </div>
                        </div>
                        <div className="section-body p-4 border border-top-0 border-info">
                            <Schema path={DynamicConfigurationDefinition.schema}>
                                {(schema, loadingSchema) => 
                                <FormManager initial={{...detail}}>
                                    {(data, errors) =>
                                    <>
                                        <DynamicRegistrationForm
                                            registration={data}
                                            errors={errors}
                                            schema={schema}
                                            loading={loading}
                                            onSave={(registration) => update({ id: registration.resourceId, registration })}
                                            onCancel={() => cancel()} />
                                        <Fragment>{ loadingSchema && <div className="d-flex justify-content-center text-primary"><Spinner size="4x" /></div> }</Fragment>
                                    </>}
                                </FormManager> }
                            </Schema>
                        </div>
                    </section>
                </div>
            }
        </Fragment>
    )
}