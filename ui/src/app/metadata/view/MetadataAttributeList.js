import React from 'react';
import { faEdit, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import { Translate } from '../../i18n/components/translate';
import { useTranslator } from '../../i18n/hooks';

import { DeleteConfirmation } from '../component/DeleteConfirmation';

export function MetadataAttributeList ({entities, onDelete}) {

    const translator = useTranslator();

    const remove = (id) => {
        onDelete(id);
    }

    return (
        <DeleteConfirmation title={`message.delete-attribute-title`} body={`message.delete-attribute-body`}>
            {(block) =>
            <div className="container-fluid p-3">
                <section className="section">
                    <div className="section-body border border-top-0 border-primary">
                        <div className="section-header bg-primary p-2 text-light">
                            <span className="lead">
                                <Translate value="label.custom-entity-attributes">Custom Entity Attributes</Translate>
                            </span>
                        </div>
                        <div className="p-3">
                            <div className="d-flex justify-content-end w-100">
                                <Link to="./new" className="btn btn-sm btn-success">
                                    <FontAwesomeIcon icon={faPlusCircle} /> &nbsp;
                                <Translate value="action.add-new-attribute">Add new attribute</Translate>
                                </Link>
                            </div>
                            <div className="table-responsive mt-3">
                                <table className="table table-striped w-100 table-hover">
                                    <thead>
                                        <tr>
                                            <th>
                                                <Translate value="label.attribute-name">Attribute Name</Translate>
                                            </th>
                                            <th>
                                                <Translate value="label.type">Type</Translate>
                                            </th>
                                            <th>
                                                <Translate value="label.help-text">Help Text</Translate>
                                            </th>
                                            <th>
                                                <Translate value="label.default-value">Default Value</Translate>
                                            </th>
                                            <th><span className="sr-only"><Translate value="label.actions">Actions</Translate></span></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {entities.map((attr, i) =>
                                            <tr key={i}>
                                                <td>{attr.name}</td>
                                                <td>{translator(`value.${attr.attributeType}`)}</td>
                                                <td>{attr.helpText}</td>
                                                <td>{attr.defaultValue?.toString()}</td>
                                                <td className="text-right">
                                                    <Link to={`../attributes/${attr.resourceId}/edit`} className="btn btn-link text-primary">
                                                        <FontAwesomeIcon icon={faEdit} size="lg" />
                                                        <span className="sr-only">
                                                            <Translate value="action.edit">Edit</Translate>
                                                        </span>
                                                    </Link>
                                                    <Button variant="link" className="text-danger" onClick={() => block(() => remove(attr.resourceId))}>
                                                        <FontAwesomeIcon icon={faTrash} size="lg" />
                                                        <span className="sr-only">
                                                            <Translate value="action.delete">Delete</Translate>
                                                        </span>
                                                    </Button>
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
            }
        </DeleteConfirmation>
    );
}