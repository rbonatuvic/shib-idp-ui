import React from 'react';
import { faEdit, faPlusCircle, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

import { Translate } from '../../i18n/components/translate';

import { AttributeBundleApi } from '../hoc/attribute/AttributeBundleApi';

import { AttributeBundleList } from '../hoc/attribute/AttributeBundleList';
import { TruncateText } from '../../core/components/TruncateText';

export function MetadataAttributeBundles({}) {

    return (
        <AttributeBundleApi>
            {(load, find, create, update, remove, loading) =>
                <AttributeBundleList load={load}>
                    {(bundles, reload) => 
                    <div className="container-fluid p-3">
                        <section className="section">
                            <div className="section-body border border-top-0 border-primary">
                                <div className="section-header bg-primary p-2 text-light">
                                    <span className="lead">
                                        <Translate value="label.attribute-bundles">Attribute Bundles</Translate>
                                    </span>
                                </div>
                                    <div className="p-3">
                                        <div className="d-flex justify-content-end w-100">
                                            <Link to="./bundles/new" className="btn btn-sm btn-success">
                                                <FontAwesomeIcon icon={faPlusCircle} /> &nbsp;
                                                <Translate value="action.add-new-bundle">Add new bundle</Translate>
                                            </Link>
                                        </div>
                                        <div className="table-responsive mt-3">
                                            <table className="table table-striped w-100 table-hover">
                                                <thead>
                                                    <tr>
                                                        <th>
                                                            <Translate value="label.bundle-name">Bundle Name</Translate>
                                                        </th>
                                                        <th><Translate value="label.bundled-attributes">Bundled Attributes</Translate></th>
                                                        <th><span className="sr-only"><Translate value="label.actions">Actions</Translate></span></th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {bundles.map((bundle, i) =>
                                                        <tr key={i}>
                                                            <td>{ bundle.name }</td>
                                                            <td><TruncateText text={ bundle?.attributes?.join(', ') } /></td>
                                                            <td className="text-right">
                                                                <Link to={`../attributes/bundles/${bundle.resourceId}/edit`} className="btn btn-link text-primary">
                                                                    <FontAwesomeIcon icon={faEdit} size="lg" />
                                                                    <span className="sr-only">
                                                                        <Translate value="action.edit">Edit</Translate>
                                                                    </span>
                                                                </Link>
                                                                <Button variant="link" className="text-danger" onClick={() => remove(bundle.resourceId, reload)}>
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
                </AttributeBundleList>
            }
        </AttributeBundleApi>
    );
}