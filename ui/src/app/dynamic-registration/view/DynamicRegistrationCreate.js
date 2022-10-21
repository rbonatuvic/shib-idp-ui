import React from 'react';
import { Prompt, useHistory, useParams } from 'react-router-dom';

import { useDynamicRegistrationApi } from '../hoc/DynamicRegistrationContext';
import Translate from '../../i18n/components/translate';
import { BASE_PATH } from '../../App.constant';
import { Schema } from '../../form/Schema';
import { FormManager } from '../../form/FormManager';
import { DynamicRegistrationForm } from '../component/DynamicRegistrationForm';
import { createNotificationAction, NotificationTypes, useNotificationDispatcher } from '../../notifications/hoc/Notifications';
import { useTranslator } from '../../i18n/hooks';

export function DynamicRegistrationCreate () {

    const history = useHistory();
    const translator = useTranslator();
    const notifier = useNotificationDispatcher();
    const { create } = useDynamicRegistrationApi();

    async function save(reg) {
        let toast;
        const resp = await create(``, reg);
        if (resp.ok) {
            gotoDetail({ refresh: true });
            toast = createNotificationAction(`Added group successfully.`, NotificationTypes.SUCCESS);
        } else {
            toast = createNotificationAction(`${resp.errorCode} - ${translator(resp.errorMessage)}`, NotificationTypes.ERROR);
        }
        if (toast) {
            notifier(toast);
        }
    };

    const cancel = () => {
        gotoDetail();
    };

    const gotoDetail = (state = null) => {
        setBlocking(false);
        history.push(`/dashboard/dynamic-registration`, state);
    };

    const [blocking, setBlocking] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

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
                    <Schema path={`/${BASE_PATH}assets/schema/dynamic-registration/oidc.json`}>
                        {(schema) => 
                        <FormManager initial={{}}>
                            {(data, errors) =>
                            <>
                                <DynamicRegistrationForm
                                    registration={data}
                                    errors={errors}
                                    schema={schema}
                                    loading={loading}
                                    onSave={(data) => save(data)}
                                    onCancel={() => cancel()} />
                            </>}
                        </FormManager> }
                    </Schema>
                </div>
            </section>
        </div>
    )
}