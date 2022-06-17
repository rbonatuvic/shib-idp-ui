import React from 'react';

import { Prompt, useHistory } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Translate from '../../i18n/components/translate';
import { useRoles } from '../hooks';
import { Schema } from '../../form/Schema';
import { FormManager } from '../../form/FormManager';

import { RoleForm } from '../component/RoleForm';
import { RoleProvider } from '../hoc/RoleProvider';
import { createNotificationAction, NotificationTypes, useNotificationDispatcher } from '../../notifications/hoc/Notifications';
import { useTranslator } from '../../i18n/hooks';
import { BASE_PATH } from '../../App.constant';

export function EditRole() {

    const { id } = useParams();

    const notifier = useNotificationDispatcher();
    const translator = useTranslator();

    const history = useHistory();

    const { put, response, loading } = useRoles();

    const [blocking, setBlocking] = React.useState(false);

    async function save(role) {
        let toast;
        const resp = await put(`/${role.resourceId}`, role);
        if (response.ok) {
            gotoDetail({ refresh: true });
            toast = createNotificationAction(`Updated role successfully.`, NotificationTypes.SUCCESS);
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
        history.push(`/roles`, state);
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
                            <span className="lead"><Translate value="label.edit-role">Edit role</Translate></span>
                        </div>
                    </div>
                </div>
                <div className="section-body p-4 border border-top-0 border-info">
                    <RoleProvider id={id}>
                        {(role) =>
                            <Schema path={`/${BASE_PATH}assets/schema/roles/role.json`}>
                                {(schema) =>
                                    <>{role &&
                                        <FormManager initial={role}>
                                            {(data, errors) =>
                                                <RoleForm
                                                    role={data}
                                                    errors={errors}
                                                    schema={schema}
                                                    loading={loading}
                                                    onSave={(data) => save(data)}
                                                    onCancel={() => cancel()} />}
                                        </FormManager>
                                    }</>}
                            </Schema>
                        }
                    </RoleProvider>
                </div>
            </section>
        </div>
    );
}