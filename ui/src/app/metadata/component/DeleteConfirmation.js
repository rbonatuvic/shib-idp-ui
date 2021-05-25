import React from 'react';

import Modal from 'react-bootstrap/Modal';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Translate from '../../i18n/components/translate';

export function DeleteConfirmation({ children, onConfirm, onCancel, body, title }) {

    const [deleting, setDeleting] = React.useState(false);

    const ref = React.useRef();

    const onConfirmClick = () => {
        if (onConfirm) {
            onConfirm();
        }
        if (ref.current && typeof ref.current === 'function') {
            ref.current();
        }
        setDeleting(false);
    }

    const onCancelClick = () => {
        if (onCancel) {
            onCancel();
        }
        setDeleting(false);
    };

    const onShow = (callback) => {
        ref.current = callback;
        setDeleting(true);
    };

    return (
        <>
            {children((callback) => onShow(callback))}
            <Modal show={deleting} onHide={() => onCancelClick()}>
                {title && <Modal.Header><Translate value={title}>Delete Metadata Source?</Translate></Modal.Header>}
                <Modal.Body className="d-flex align-content-center">
                    <FontAwesomeIcon className="text-danger mr-4" size="4x" icon={faExclamationTriangle} />
                    <p className="text-danger font-weight-bold mb-0">
                        <Translate value={ body }>You are deleting an entity. This cannot be undone. Continue?</Translate>
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-danger" onClick={() => onConfirmClick()}>
                        <Translate value="action.delete">Delete</Translate>
                    </button>{' '}
                    <button className="btn btn-secondary" onClick={() => onCancelClick()}>
                        <Translate value="action.cancel">Cancel</Translate>
                    </button>
                </Modal.Footer>
            </Modal>
        </>
    );
}