import React from 'react';

import { Prompt, useHistory } from 'react-router-dom';
import Translate from '../../i18n/components/translate';
import { useGroups } from '../hooks';
import { Schema } from '../../form/Schema';
import { FormManager } from '../../form/FormManager';
import { GroupForm } from '../component/GroupForm';

import { createNotificationAction, NotificationTypes } from '../../store/notifications/NotificationSlice';
import { useTranslator } from '../../i18n/hooks';
import { BASE_PATH } from '../../App.constant';
import { useDispatch } from 'react-redux';

export function NewGroup({ groups }) {
    const history = useHistory();
    const notifier = useDispatch();
    const translator = useTranslator();

    const { post, response, loading } = useGroups({});

    const [blocking, setBlocking] = React.useState(false);

    async function save(group) {
        let toast;
        const resp = await post(``, group);
        if (response.ok) {
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
                            <span className="lead"><Translate value="label.new-group">Add a new group</Translate></span>
                        </div>
                    </div>
                </div>
                <div className="section-body p-4 border border-top-0 border-info">
                    <Schema path={`/${BASE_PATH}assets/schema/groups/group.json`}>
                        {(schema) => 
                        <FormManager initial={{}}>
                            {(data, errors) =>
                            <>
                                <GroupForm
                                    context={ { groups } }
                                    group={data}
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
    );
}