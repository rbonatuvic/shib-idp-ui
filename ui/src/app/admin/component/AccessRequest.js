import React from 'react';
import Button from 'react-bootstrap/Button';
import Translate from '../../i18n/components/translate';

export function AccessRequest({ users, roles, onDeleteUser, onChangeUserRole }) {

    return (
        <>
        {(!users || !users.length) ?
        <>
            <div className="d-flex justify-content-center">
                <div className="w-25 alert alert-info m-3">
                    <p className="text-center">There are no new user requests at this time.</p>
                </div>
            </div>
        </>
        :
        users.map((user, i) => (
        <div key={i}>
            <div className="p-3 bg-light border-light rounded m-3">
                <div className="row align-items-center">
                    <div className="col-10">
                        <div className="row">
                            <div className="col text-end font-weight-bold">
                                <Translate value="label.user-id">UserId</Translate>
                            </div>
                            <div className="col">{ user.username }</div>
                            <div className="col text-end font-weight-bold">
                                <Translate value="label.email">Email</Translate>
                            </div>
                            <div className="col">{ user.emailAddress }</div>
                        </div>
                        <div className="w-100 my-1"></div>
                        <div className="row">
                            <div className="col text-end font-weight-bold" >
                                <Translate value="label.name">Name</Translate>
                            </div>
                            <div className="col">{ user.firstName } { user.lastName }</div>
                            <label htmlFor={`role-${i}`} className="d-block col text-end font-weight-bold" >
                                <Translate value="label.role">Role</Translate>
                            </label>
                            <div className="col">
                                <select id={`role-${i}`} name={user.username} value={user.role} className="form-control form-control-sm"
                                    disablevalidation="true" onChange={(event) => onChangeUserRole(user, event.target.value)}>
                                    {roles.map((role, ridx) =>
                                        <option value={role} key={ridx}>{ role }</option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="col-2 text-end">
                        <Button variant="danger" size="sm" onClick={() => onDeleteUser(user.username)}>
                            <i className="fa fa-trash fa-lg"></i>
                            &nbsp;
                            <span>
                                <Translate value="label.delete-request">Delete Request</Translate>
                            </span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        ))}
    </>
    );
}