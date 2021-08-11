import React from 'react';

import { Prompt, useHistory } from 'react-router';
import { useParams } from 'react-router-dom';
import Translate from '../../i18n/components/translate';
import { useGroups } from '../hooks';
import { Schema } from '../../form/Schema';
import { FormManager } from '../../form/FormManager';

import { GroupForm } from '../component/GroupForm';
import { GroupProvider } from '../hoc/GroupProvider';
import { createNotificationAction, NotificationTypes, useNotificationDispatcher } from '../../notifications/hoc/Notifications';
import { useTranslator } from '../../i18n/hooks';

export function EditGroup() {

    const { id } = useParams();

    const notifier = useNotificationDispatcher();
    const translator = useTranslator();

    const history = useHistory();

    const { put, response, loading } = useGroups();

    const [blocking, setBlocking] = React.useState(false);

    async function save(metadata) {
        let toast;
        const resp = await put(``, metadata);
        if (response.ok) {
            gotoDetail({ refresh: true });
            toast = createNotificationAction(`Updated group successfully.`, NotificationTypes.SUCCESS);
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
        history.push(`/groups`, state);
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
                            <span className="display-6"><Translate value="label.edit-group">Edit group</Translate></span>
                        </div>
                    </div>
                </div>
                <div className="section-body p-4 border border-top-0 border-info">
                    <GroupProvider id={id}>
                        {(group) =>
                            <Schema path={`/assets/schema/groups/group.json`}>
                                {(schema) => 
                                <>{group && 
                                    <FormManager initial={group}>
                                        {(data, errors) =>
                                            <GroupForm
                                                group={data}
                                                errors={errors}
                                                schema={schema}
                                                loading={loading}
                                                onSave={(data) => save(data)}
                                                onCancel={() => cancel()} />}
                                    </FormManager>
                                }</>}
                            </Schema>
                        }
                    </GroupProvider>
                </div>
            </section>
        </div>
    );
}