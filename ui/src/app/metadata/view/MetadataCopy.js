import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';

import { Translate } from '../../i18n/components/translate';
import { MetadataSchema } from '../hoc/MetadataSchema';

import {CopySource} from '../copy/CopySource';
import { SaveCopy } from '../copy/SaveCopy';
import { useMetadataEntity } from '../hooks/api';
import { useHistory } from 'react-router';

export function MetadataCopy () {

    const { post, response, loading } = useMetadataEntity('source');
    const history = useHistory();

    const [copy, setCopy] = React.useState({
        target: null,
        serviceProviderName: null,
        entityId: null,
        properties: []
    });
    const [confirm, setConfirm] = React.useState(false);

    const next = (data) => {
        setCopy(data);
        setConfirm(true)
    };

    const back = (data) => {
        setConfirm(false);
    };

    async function save (data) {
        await post('', data);
        if (response.ok) {
            history.push('/');
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