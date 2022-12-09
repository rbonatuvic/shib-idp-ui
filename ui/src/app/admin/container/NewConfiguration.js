import React from 'react';

import { Prompt, useHistory } from 'react-router-dom';
import Translate from '../../i18n/components/translate';
import { useConfiguration } from '../hooks';
import { Schema } from '../../form/Schema';
import { ConfigurationForm } from '../component/ConfigurationForm';

import { createNotificationAction, NotificationTypes } from '../../store/notifications/NotificationSlice';
import { useTranslator } from '../../i18n/hooks';
import { BASE_PATH } from '../../App.constant';
import { PropertiesProvider } from '../hoc/PropertiesProvider';
import { useDispatch } from 'react-redux';

export function NewConfiguration({ configurations }) {
    const history = useHistory();
    const notifier = useDispatch();
    const translator = useTranslator();

    const { post, response, loading } = useConfiguration({});

    const [blocking, setBlocking] = React.useState(false);

    async function save(config) {
        let toast;
        const resp = await post(``, config);
        if (response.ok) {
            gotoList({ refresh: true });
            toast = createNotificationAction(`Added configuration successfully.`, NotificationTypes.SUCCESS);
        } else {
            toast = createNotificationAction(`${resp.errorCode} - ${translator(resp.errorMessage)}`, NotificationTypes.ERROR);
        }
        if (toast) {
            notifier(toast);
        }
    };

    const cancel = () => {
        gotoList();
    };

    const gotoList = (state = null) => {
        setBlocking(false);
        history.push(`/configurations`, state);
    };

    const [configuration] = React.useState({});

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
                            <span className="lead"><Translate value="label.new-configuration">Create new configuration set</Translate></span>
                        </div>
                    </div>
                </div>
                <div className="section-body p-4 border border-top-0 border-info">
                    <PropertiesProvider>
                        <Schema path={`/${BASE_PATH}assets/schema/configuration/configuration.json`}>
                            {(schema) =>
                                <ConfigurationForm
                                    configuration={configuration}
                                    configurations={configurations}
                                    schema={schema}
                                    loading={loading}
                                    onSave={(data) => save(data)}
                                    onCancel={() => cancel()} />}
                        </Schema>
                    </PropertiesProvider>
                </div>
            </section>
        </div>
    );
}