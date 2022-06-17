import React from 'react';

import { MetadataForm } from '../hoc/MetadataFormContext';
import { MetadataSourceWizard } from '../wizard/MetadataSourceWizard';
import { MetadataProviderWizard } from '../wizard/MetadataProviderWizard';
import { Wizard } from '../wizard/Wizard';
import { useMetadataEntity } from '../hooks/api';
import { createNotificationAction, NotificationTypes, useNotificationDispatcher } from '../../notifications/hoc/Notifications';
import { Prompt, useHistory } from 'react-router-dom';
import { useTranslator } from '../../i18n/hooks';

export function MetadataWizard ({type, data, onCallback}) {

    const history = useHistory();
    const translator = useTranslator();

    const { post, loading, response } = useMetadataEntity(type === 'source' ? 'source' : 'provider');

    const notificationDispatch = useNotificationDispatcher();

    const [blocking, setBlocking] = React.useState(false);

    const gotoDetail = () => {
        setTimeout(() => {
            history.push(`/dashboard/metadata/manager/${type === 'source' ? 'resolvers' : 'providers'}`);
        }, 1);
    };

    async function save(metadata) {
        await post('', metadata);
        if (response.ok) {
            setBlocking(false);
            gotoDetail();
        } else {
            let msg;
            if (response.status) {
                const { errorCode, errorMessage, cause } = response.data;
                msg = `${errorCode}: ${errorMessage} ${cause ? `-${cause}` : ''}`;
            } else {
                msg = translator('message.session-timeout');
            }
            
            notificationDispatch(createNotificationAction(
                msg,
                NotificationTypes.ERROR
            ));
        }
    }

    return (
        <MetadataForm initial={data}>
            <Prompt
                when={blocking}
                message={location =>
                    `message.unsaved-editor`
                }
            />
            <Wizard>
                {type === 'source' ?
                    <MetadataSourceWizard onSave={save} loading={loading} block={setBlocking} onShowNav={onCallback} />
                    :
                    <MetadataProviderWizard onSave={save} loading={loading} block={setBlocking} onRestart={onCallback} />
                }
            </Wizard>
        </MetadataForm>
    );
}