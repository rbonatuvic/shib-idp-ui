import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Translate from '../../i18n/components/translate';


export function UserConfirmation({children}) {
    const [confirm, setConfirm] = React.useState(false);
    const [confirmCallback, setConfirmCallback] = React.useState(null);
    const [message, setMessage] = React.useState('');

    function getConfirmation(message, callback) {
        setConfirmCallback(() => callback);
        setConfirm(true);
        setMessage(message);
    }

    return (<>{children(message, confirm, confirmCallback, setConfirm, getConfirmation)}</>);
}

export function ConfirmWindow ({message, confirm, setConfirm, confirmCallback}) {
    const allowTransition = () => {
        setConfirm(false);
        confirmCallback(true);
    }

    const blockTransition = () => {
        setConfirm(false);
        confirmCallback(false);
    }

    return (
        <Modal show={confirm} onHide={blockTransition}>
            <Modal.Header closeButton>
                <Modal.Title>Are you sure?</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <p><Translate value={message}>{message}</Translate></p>
            </Modal.Body>

            <Modal.Footer className="justify-content-start">
                <Button variant="primary" onClick={allowTransition}><Translate value={`action.discard-changes`} /></Button>
                <Button onClick={blockTransition} variant="outline-secondary"><Translate value={`action.cancel`} /></Button>
            </Modal.Footer>
        </Modal>
    );
}