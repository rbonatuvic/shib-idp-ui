import React from 'react';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

import { useMetadataEntity } from '../../../hooks/api';
import Translate from '../../../../i18n/components/translate';
import { noop } from 'lodash';

export function DeleteSourceConfirmation ({children}) {

    const { del, response } = useMetadataEntity('source');

    const cb = React.useRef(null);

    const [deleting, setDeleting] = React.useState(null);

    const onConfirm = (id, cb = () => {}) => {
        deleteSource(deleting);
        setDeleting(null);
    }

    const onDeleteSource = (id, onComplete) => {
        setDeleting(id);
        cb.current = onComplete;
    };

    async function deleteSource(id) {
        await del(`/${id}`);
        if (response.ok) {
            cb.current && typeof cb.current === 'function' ? cb.current() : noop();
        }
    }

    return (
        <>
            {children(onDeleteSource)}
            <Modal isOpen={!!deleting} toggle={() => setDeleting(null)}>
                <ModalHeader toggle={() => setDeleting(null)}><Translate value="message.delete-source-title">Delete Metadata Source?</Translate></ModalHeader>
                <ModalBody className="d-flex align-content-center">
                    <FontAwesomeIcon className="text-danger mr-4" size="4x" icon={faExclamationTriangle} />
                    <p className="text-danger font-weight-bold mb-0">
                        <Translate value="message.delete-source-body">You are deleting a metadata source. This cannot be undone. Continue?</Translate>
                    </p>
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={() => onConfirm(deleting)}>
                        <Translate value="action.delete">Delete</Translate>
                    </Button>{' '}
                    <Button color="secondary" onClick={() => setDeleting(null)}>
                        <Translate value="action.cancel">Cancel</Translate>
                    </Button>
                </ModalFooter>
            </Modal>
        </>
    );
}