import React from 'react';

import Modal from 'react-bootstrap/Modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';

import Translate from '../../../i18n/components/translate';
import { useTranslator } from '../../../i18n/hooks';
import { ChangeItem } from './ChangeItem';
import Alert from 'react-bootstrap/Alert';

export function ContentionModal ({ theirs = [], ours = [], onUseTheirs, onUseOurs, ...props }) {

    const translator = useTranslator();

    const resolutionObj = {};
    const rejectionObj = {};

    return (
        <Modal size="xl" { ...props } aria-label={translator('message.data-version-contention')}>
            <Modal.Header className="modal-header">
                <h4 className="modal-title"><Translate value="message.data-version-contention">Data Version Contention</Translate></h4>
            </Modal.Header>
            <Modal.Body>
                <div className="d-flex w-50 justify-content-center mb-4 mx-auto">
                    <FontAwesomeIcon icon={faExclamationTriangle} size="3x" className="text-warning" />
                    {theirs && theirs.length > 0 ?
                    <p className="ml-2">
                        <Translate value="message.contention-new-version">A newer version of this metadata source has been saved. Below are a list of changes. You can use your changes or their changes.</Translate>
                    </p>
                    :
                    <p className="ml-2">
                        <Translate value="message.contention-error">There was a problem saving due to a mismatched version.</Translate>
                    </p>
                    }
                </div>
                {theirs && theirs.length > 0 &&
                <div className="row">
                    <div className="col col-6">
                        <div className="card">
                            <div className="card-header bg-info text-white">
                                <Translate value="label.my-changes">My Changes</Translate>
                            </div>
                            <div className="list-group list-group-flush">
                                {ours && ours.map((item, idx) =>
                                    <div className="list-group-item" key={idx}>
                                        <ChangeItem className="list-group-item" item={item}></ChangeItem>
                                    </div>
                                )}
                                {ours && ours.length === 0 && 
                                    <Alert variant="info" className="m-2">
                                        You haven't made any changes.
                                    </Alert>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="col col-6">
                        <div className="card">
                            <div className="card-header bg-danger text-white">
                                <Translate value="label.their-changes">Their Changes</Translate>
                            </div>
                            <div className="list-group list-group-flush">
                                {theirs.map((item, idx) =>
                                    <div className="list-group-item" key={idx}>
                                        <ChangeItem className="list-group-item" item={item}></ChangeItem>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                }
            </Modal.Body>
            {theirs && theirs.length < 1 ?
            <Modal.Footer>
                <Button variant="secondary"
                    onClick={() => onUseTheirs()}><Translate value="action.cancel">Cancel</Translate></Button>
            </Modal.Footer>
            :
            ours && ours.length < 1 ?
                <Modal.Footer>
                    <Button variant="secondary"
                        onClick={() => onUseTheirs()}><Translate value="action.get-latest">Get latest</Translate></Button>
                </Modal.Footer>
            :
            <Modal.Footer>
                <Button variant="info" onClick={() => onUseOurs()} disabled={!resolutionObj}>
                    <Translate value="action.use-mine">Use My Changes</Translate>
                </Button>
                <Button variant="danger" onClick={() => onUseTheirs()} disabled={!rejectionObj}>
                    <Translate value="action.use-theirs">Use Their Changes</Translate>
                </Button>
            </Modal.Footer>
            }
        </Modal>
    );
}