import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';

import { Translate } from '../../i18n/components/translate';
import { MetadataSchema } from '../hoc/MetadataSchema';

import {CopySource} from '../copy/CopySource';
import { SaveCopy } from '../copy/SaveCopy';

export function MetadataCopy () {

    const next = (data) => {
        setCopy(data);
    };

    const [copy, setCopy] = React.useState();

    return (
        <React.Fragment>
            {!copy && 
            <CopySource onNext={next} />
            }
            {copy &&
                <MetadataSchema type="source">
                    <SaveCopy copy={copy} />
                </MetadataSchema>
            }
            <button type="button"
                className="btn btn-primary sr-only"
                disabled={!copy}
                onClick={() => next()}>
                <Translate value="action.next">Next</Translate>
                <FontAwesomeIcon icon={faArrowCircleRight} size="lg" />
            </button>
        </React.Fragment>
    );
}