import React from 'react';
import API_BASE_PATH from '../../App.constant';
import { useFetch } from 'use-http';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Translate from '../../i18n/components/translate';
import { downloadAsXml } from '../../core/utility/download_as_xml';

export function FilterTargetPreview ({ entityId, children }) {

    const [show, setShow] = React.useState(false);

    const preview = () => {
        setShow(true);
    };

    const handleClose = () => {
        setShow(false);
    };

    //encodeURIComponent(id)
    /*eaders: new HttpHeaders({
                    'Accept': 'application/xml'
                }),
                responseType: 'text'*/

    const { data, loading } = useFetch(`${API_BASE_PATH}/entities/${ encodeURIComponent(entityId) }`, {
        cachePolicy: 'no-cache',
        headers: {
            'Content-Type': 'application/xml',
            'Accept': 'application/xml'
        },
        responseType: 'text'
    }, [entityId]);

    console.log(data);

    return (
        <React.Fragment>
            {children(preview, loading, data)}
            <Modal show={show} onHide={handleClose} dialogClassName="modal-xl">
                <Modal.Header closeButton>
                    <Modal.Title><Translate value="label.preview-provider">Preview XML</Translate></Modal.Title>
                </Modal.Header>
                <Modal.Body><pre className="border p-2 bg-light rounded"><code>{data}</code></pre></Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => downloadAsXml('metadata', data)}>
                        <Translate value="action.download-file">Download File</Translate>
                    </Button>
                    <Button variant="primary" onClick={handleClose}>
                        <Translate value="action.close">Close</Translate>
                    </Button>
                </Modal.Footer>
            </Modal>
        </React.Fragment>
    );
}