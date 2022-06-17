import React from 'react';
import { MetadataSchema } from '../hoc/MetadataSchema';

import { CopySource } from '../copy/CopySource';
import { SaveCopy } from '../copy/SaveCopy';
import { useMetadataEntity } from '../hooks/api';
import { useHistory } from 'react-router-dom';
import { createNotificationAction, NotificationTypes, useNotificationDispatcher } from '../../notifications/hoc/Notifications';

export function MetadataCopy ({ onShowNav }) {

    const { post, response, loading } = useMetadataEntity('source');
    const history = useHistory();

    const dispatch = useNotificationDispatcher();

    const [copy, setCopy] = React.useState({
        target: null,
        serviceProviderName: null,
        entityId: null,
        properties: []
    });
    const [confirm, setConfirm] = React.useState(false);

    const next = (data) => {
        setCopy(data);
        setConfirm(true);
        onShowNav(false);
    };

    const back = (data) => {
        setConfirm(false);
        onShowNav(true);
    };

    async function save (data) {
        await post('', data);
        if (response.ok) {
            history.push('/');
        } else {
            const { errorCode, errorMessage, cause } = response.data;
            dispatch(createNotificationAction(
                `${errorCode}: ${errorMessage} ${cause ? `-${cause}` : ''}`,
                NotificationTypes.ERROR
            ));
        }
    }

    return (
        <React.Fragment>
            {!confirm && 
            <CopySource copy={copy} onNext={next} />
            }
            {confirm && copy &&
                <MetadataSchema type="source">
                    <SaveCopy copy={copy} onBack={back} onSave={save} saving={loading} />
                </MetadataSchema>
            }
        </React.Fragment>
    );
}