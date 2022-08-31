import React from 'react';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from 'react-bootstrap/Button';
import { useParams } from 'react-router';
import Translate from '../../i18n/components/translate';
import { MetadataObjectContext } from '../hoc/MetadataSelector';

import { MetadataXmlContext } from '../hoc/MetadataXmlLoader';
import { MetadataViewToggle } from '../component/MetadataViewToggle';
import { downloadAsXml } from '../../core/utility/download_as';

export function MetadataXml () {
    const { xml, reload } = React.useContext(MetadataXmlContext);
    const entity = React.useContext(MetadataObjectContext);
    const { type } = useParams();

    const download = () => downloadAsXml(entity.name ? entity.name : entity.serviceProviderName, xml);

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => {
        reload();
    }, []);

    return (
        <>
        <h2 className="mb-4">
            <Translate value={type === 'source' ? 'label.source' : 'label.provider'}>Source</Translate>&nbsp;Configuration
        </h2>
        <div className="container-fluid">
            <div className="px-3 my-3 d-flex justify-content-end">
                <MetadataViewToggle />
            </div>
            <div className="px-3 my-3">
                <figure role="img" aria-labelledby="pre-caption" tabIndex="0">
                    <pre className="border p-2 bg-light rounded"><code>{xml}</code></pre>
                    <figcaption id="pre-caption" className="sr-only">
                        { xml }
                    </figcaption>
                </figure>
                
                <Button type="button" variant="primary" onClick={() => download()}>
                    <FontAwesomeIcon icon={faSave} />&nbsp;
                    <Translate value="action.download-file">Download File</Translate>
                </Button>
            </div>
        </div>
        </>
    );
}