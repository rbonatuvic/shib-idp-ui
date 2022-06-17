import React from 'react';

import Modal from 'react-bootstrap/Modal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Translate from '../../i18n/components/translate';

export function SessionModal({ show, children }) {

    return (
        <>
            <Modal show={show}>
                <Modal.Header><Translate value="message.session-timeout-heading">Session timed out</Translate></Modal.Header>
                <Modal.Body className="d-flex align-content-center">
                    <FontAwesomeIcon className="text-danger me-4" size="4x" icon={faExclamationTriangle} />
                    <p className="text-danger font-weight-bold mb-0">
                        <Translate value="message.session-timeout-body">Your session has timed out. Please login again.</Translate>
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    {children}
                </Modal.Footer>
            </Modal>
        </>
    );
}