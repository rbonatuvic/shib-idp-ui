import React from 'react';

import { MetadataForm } from '../hoc/MetadataFormContext';
import { MetadataSourceWizard } from '../wizard/MetadataSourceWizard';
import { MetadataProviderWizard } from '../wizard/MetadataProviderWizard';
import { Wizard } from '../wizard/Wizard';
import { useMetadataEntity } from '../hooks/api';
import { createNotificationAction, NotificationTypes, useNotificationDispatcher } from '../../notifications/hoc/Notifications';
import { Prompt, useHistory } from 'react-router';

export function MetadataWizard ({type, data, onCallback}) {

    const history = useHistory();

    const { post, loading, response } = useMetadataEntity(type === 'source' ? 'source' : 'provider');

    const notificationDispatch = useNotificationDispatcher();

    const [blocking, setBlocking] = React.useState(false);

    async function save(metadata) {
        await post('', metadata);
        if (response.ok) {
            setBlocking(false);
            history.push(`/dashboard/metadata/manager/${type === 'source' ? 'resolvers' : 'providers'}`);
        } else {
            const { errorCode, errorMessage, cause } = response.data;
            notificationDispatch(createNotificationAction(
                `${errorCode}: ${errorMessage} ${cause ? `-${cause}` : ''}`,
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