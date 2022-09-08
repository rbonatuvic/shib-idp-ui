import React from 'react';

import { Prompt, useHistory, useParams } from 'react-router-dom';
import Translate from '../../i18n/components/translate';
import { useConfiguration } from '../hooks';
import { ConfigurationForm } from '../component/ConfigurationForm';

import { createNotificationAction, NotificationTypes, useNotificationDispatcher } from '../../notifications/hoc/Notifications';
import { useTranslator } from '../../i18n/hooks';
import { PropertiesProvider } from '../hoc/PropertiesProvider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

export function EditConfiguration({ configurations }) {
    const history = useHistory();
    const notifier = useNotificationDispatcher();
    const translator = useTranslator();
    const { id } = useParams();

    const { put, get, response, loading } = useConfiguration({});

    const [blocking, setBlocking] = React.useState(false);

    const [configuration, setConfiguration] = React.useState();

    async function save(config) {
        let toast;
        const resp = await put(`${config.resourceId}`, config);
        if (response.ok) {
            gotoList({ refresh: true });
            toast = createNotificationAction(`Updated configuration successfully.`, NotificationTypes.SUCCESS);
        } else {
            toast = createNotificationAction(`${resp.errorCode} - ${translator(resp.errorMessage)}`, NotificationTypes.ERROR);
        }
        if (toast) {
            notifier(toast);
        }
    };

    async function loadConfiguration(id) {
        const config = await get(`/${id}`);
        if (response.ok) {
            setConfiguration(config);
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => { loadConfiguration(id) }, []);

    const cancel = () => {
        gotoList();
    };

    const gotoList = (state = null) => {
        setBlocking(false);
        history.push(`/configurations`, state);
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
                            <span className="lead"><Translate value="label.edit-configuration">Edit configuration set</Translate></span>
                        </div>
                    </div>
                </div>
                <div className="section-body p-4 border border-top-0 border-info">
                    {loading ? 
                    <div className="d-flex justify-content-end flex-fill">
                        <FontAwesomeIcon icon={faSpinner} spin={true} pulse={true} size="lg" />
                    </div>
                    :
                    <PropertiesProvider>
                        {configuration && <ConfigurationForm
                            configuration={configuration}
                            configurations={configurations}
                            loading={loading}
                            onSave={(data) => save(data)}
                            onCancel={() => cancel()} /> }
                    </PropertiesProvider>
                    }
                </div>
            </section>
        </div>
    );
}