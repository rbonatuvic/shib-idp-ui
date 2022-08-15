import React from 'react';

import { Prompt, useHistory } from 'react-router-dom';
import Translate from '../../i18n/components/translate';
import { useProperties } from '../hooks';
import { Schema } from '../../form/Schema';
import { FormManager } from '../../form/FormManager';
import { ConfigurationForm } from '../component/ConfigurationForm';

import { createNotificationAction, NotificationTypes, useNotificationDispatcher } from '../../notifications/hoc/Notifications';
import { useTranslator } from '../../i18n/hooks';
import { BASE_PATH } from '../../App.constant';

export function NewConfiguration() {
    const history = useHistory();
    const notifier = useNotificationDispatcher();
    const translator = useTranslator();

    const { post, response, loading } = useProperties({});

    const [blocking, setBlocking] = React.useState(false);

    async function save(property) {
        let toast;
        const resp = await post(``, property);
        if (response.ok) {
            gotoDetail({ refresh: true });
            toast = createNotificationAction(`Added property successfully.`, NotificationTypes.SUCCESS);
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
        history.push(`/properties`, state);
    };

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
                            <span className="lead"><Translate value="label.new-property">Add a new property</Translate></span>
                        </div>
                    </div>
                </div>
                <div className="section-body p-4 border border-top-0 border-info">
                    <Schema path={`/${BASE_PATH}assets/schema/configuration/configuration.json`}>
                        {(schema) =>
                            <FormManager initial={{}}>
                                {(data, errors) =>
                                    <ConfigurationForm
                                        property={data}
                                        errors={errors}
                                        schema={schema}
                                        loading={loading}
                                        onSave={(data) => save(data)}
                                        onCancel={() => cancel()} />}
                            </FormManager>}
                    </Schema>
                </div>
            </section>
        </div>
    );
}