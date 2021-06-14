import React from 'react';
import Modal from 'react-bootstrap/Modal';
import useFetch from 'use-http';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Button from 'react-bootstrap/Button';

import Translate from '../../i18n/components/translate';
import API_BASE_PATH from '../../App.constant';
import { NotificationContext, createNotificationAction} from '../../notifications/hoc/Notifications';

export default function UserManagement({ users, children, reload }) {

    const [roles, setRoles] = React.useState([]);

    const { dispatch } = React.useContext(NotificationContext);

    const { get, patch, del, response } = useFetch(`${API_BASE_PATH}`, {});

    async function loadRoles() {
        const roles = await get('/supportedRoles')
        if (response.ok) {
            setRoles(roles);
        }
    }

    async function setUserRoleRequest(user, role) {
        await patch(`/admin/users/${user.username}`, {
            ...user,
            role
        });
        if (response.ok && reload) {
            dispatch(createNotificationAction(
                `User update successful for ${user.username}.`
            ));
            reload();
        }
    }

    async function deleteUserRequest(id) {
        await del(`/admin/users/${id}`);
        if (response.ok && reload) {
            dispatch(createNotificationAction(
                `User deleted.`
            ));
            reload();
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => {
        loadRoles();
    }, []);

    const [modal, setModal] = React.useState(false);

    const toggle = () => setModal(!modal);

    const [deleting, setDeleting] = React.useState(null);

    const deleteUser = (id) => {
        deleteUserRequest(deleting);
        setDeleting(null);
    };

    return (
        <div className="user-management">
            {children(users, roles, setUserRoleRequest, (id) => setDeleting(id))}
            <Modal show={!!deleting} onHide={() => setDeleting(null)}>
                <Modal.Header toggle={toggle}><Translate value="message.delete-user-title">Delete User?</Translate></Modal.Header>
                <Modal.Body className="d-flex align-content-center">
                    <FontAwesomeIcon className="text-danger mr-4" size="4x" icon={faExclamationTriangle} />
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
