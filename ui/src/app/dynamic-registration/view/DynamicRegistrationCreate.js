import React, {Fragment} from 'react';
import { Prompt, useHistory } from 'react-router-dom';

import Translate from '../../i18n/components/translate';
import { Schema } from '../../form/Schema';
import { FormManager } from '../../form/FormManager';
import { DynamicRegistrationForm } from '../component/DynamicRegistrationForm';
import DynamicConfigurationDefinition from '../hoc/DynamicConfigurationDefinition';
import { useCreateDynamicRegistrationMutation } from '../../store/dynamic-registration/DynamicRegistrationSlice';
import Spinner from '../../core/components/Spinner';

export function DynamicRegistrationCreate () {

    const history = useHistory();

    const [create, {isSuccess, isFetching: loading}] = useCreateDynamicRegistrationMutation();

    const save = React.useCallback(async (registration) => await create({registration}), [create]);
    
    const gotoDetail = React.useCallback((state = null) => {
        setBlocking(false);
        history.push(`/dashboard/dynamic-registration`, state);
    }, [history]);

    React.useEffect(() => {
        if (isSuccess) {
            gotoDetail({ refresh: true });
        }
    }, [isSuccess, gotoDetail])

    const [blocking, setBlocking] = React.useState(false);

    return (
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
                            <span className="lead"><Translate value="label.new-dynamic-registration">New Dynamic Registration</Translate></span>
                        </div>
                    </div>
                </div>
                <div className="section-body p-4 border border-top-0 border-info">
                    <Schema path={DynamicConfigurationDefinition.schema}>
                        {(schema, loadingSchema) => 
                        <FormManager initial={{}}>
                            {(data, errors) =>
                            <>
                                <DynamicRegistrationForm
                                    registration={data}
                                    errors={errors}
                                    schema={schema}
                                    loading={loading}
                                    onSave={(data) => save(data)}
                                    onCancel={() => gotoDetail()} />
                                <Fragment>{ loadingSchema && <div className="d-flex justify-content-center text-primary"><Spinner size="4x" /></div> }</Fragment>
                            </>}
                        </FormManager> }
                    </Schema>
                </div>
            </section>
        </div>
    )
}