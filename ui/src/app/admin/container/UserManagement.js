import React from 'react';
import Modal from 'react-bootstrap/Modal';
import useFetch from 'use-http';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';

import Translate from '../../i18n/components/translate';
import API_BASE_PATH from '../../App.constant';
import { useRemoveUserMutation, useSetUserGroupRequestMutation, useSetUserRoleRequestMutation } from '../../store/user/UserSlice';

export default function UserManagement({ users, children, reload}) {

    const [roles, setRoles] = React.useState([]);

    const { get, response, loading } = useFetch(`${API_BASE_PATH}`, {});

    async function loadRoles() {
        const roles = await get('/supportedRoles')
        if (response.ok) {
            setRoles(roles);
        }
    }

    const [setUserGroupRequest] = useSetUserGroupRequestMutation();
    const [setUserRoleRequest] = useSetUserRoleRequestMutation();
    const [deleteUserRequest] = useRemoveUserMutation();


    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => {
        loadRoles();
    }, []);

    const [deleting, setDeleting] = React.useState(null);

    const deleteUser = (id) => {
        deleteUserRequest({ id });
        setDeleting(null);
    };

    return (
        <div className="user-management">
            {children(users, roles, setUserRoleRequest, setUserGroupRequest, (id) => setDeleting(id), loading)}
            <Modal show={!!deleting} onHide={() => setDeleting(null)}>
                <Modal.Header><Translate value="message.delete-user-title">Delete User?</Translate></Modal.Header>
                <Modal.Body className="d-flex align-content-center">
                    <FontAwesomeIcon className="text-danger me-4" size="4x" icon={faExclamationTriangle} />
                    <p className="text-danger font-weight-bold mb-0">
                        <Translate value="message.delete-user-body">You are requesting to delete a user. If you complete this process the user will be removed. This cannot be undone. Do you wish to continue?</Translate>
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger"type="button" onClick={() => deleteUser(deleting)}>
                        <Translate value="action.delete">Delete</Translate>
                    </Button>{' '}
                    <Button variant="secondary" type="button" onClick={() => setDeleting(null)}>
                        <Translate value="action.cancel">Cancel</Translate>
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
