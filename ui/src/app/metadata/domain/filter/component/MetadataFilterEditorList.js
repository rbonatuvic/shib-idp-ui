import React from 'react';
import { Link } from 'react-router-dom';
import Check from 'react-bootstrap/FormCheck';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleDown, faArrowCircleUp, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

import { Ordered } from '../../../../dashboard/component/Ordered';
import { Translate } from '../../../../i18n/components/translate';

export function MetadataFilterEditorList ({provider, filters, onDelete, onUpdate, loading}) {

    return (
        <Ordered path={`/MetadataResolvers/${provider.resourceId}/FiltersPositionOrder` } entities={filters}>
            {(ordered, first, last, onOrderUp, onOrderDown) =>
                <table className="filter-list table table-striped table-hover">
                    <thead className="">
                        <tr>
                            <th></th>
                            <th></th>
                            <th><Translate value="label.filter-name">Filter Name</Translate></th>
                            <th><Translate value="label.filter-type">Filter Type</Translate></th>
                            <th><Translate value="label.filter-enabled">Enabled?</Translate></th>
                            <th><Translate value="action.edit">Edit</Translate></th>
                            <th><Translate value="action.delete">Delete</Translate></th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordered.map((filter, i) =>
                            <tr key={i}>
                                <td className="td-sm">
                                    <div className="d-flex justify-content-center">
                                        <button className="btn btn-link" onClick={() => onOrderUp(filter.resourceId)} disabled={first === filter.resourceId}>
                                            <FontAwesomeIcon icon={faArrowCircleUp} size='lg' />
                                            <span className="sr-only"><Translate value="action.move-up">Move Up</Translate></span>
                                        </button>
                                        <button className="btn btn-link" onClick={() => onOrderDown(filter.resourceId)} disabled={last === filter.resourceId}>
                                            <FontAwesomeIcon icon={faArrowCircleDown} size='lg' />
                                            <span className="sr-only"><Translate value="action.move-up">Move Down</Translate></span>
                                        </button>
                                    </div>
                                </td>
                                <td className="td-xs">{i + 1}</td>
                                <td className="td-lg">{filter.name}</td>
                                <td className="td-lg">{filter['@type']}</td>
                                <td className="td-sm">
                                    <div className="d-flex justify-content-center">
                                        <Check type="switch"
                                            id={`customSwitch${i}`}
                                            label={<span className="sr-only">Toggle this switch element</span>}
                                            checked={filter.filterEnabled}
                                            disabled={loading}
                                            onChange={() => onUpdate({ ...filter, filterEnabled: !filter.filterEnabled })} />
                                        {filter.disabled && <i className="fa fa-spinner fa-pulse fa-lg fa-fw"></i>}
                                    </div>
                                </td>
                                <td className="td-sm">
                                    <Link className={`btn btn-link ${loading ? 'disabled' : ''}`} to={`${filter.resourceId}/edit/common`}>
                                        <FontAwesomeIcon icon={faEdit} size="lg" className="text-info" />
                                        <span className="sr-only"><Translate value="action.edit">Edit</Translate></span>
                                    </Link>
                                </td>
                                <td className="td-sm">
                                    <button className="btn btn-link" disabled={loading} onClick={() => onDelete(filter.resourceId)}>
                                        <FontAwesomeIcon icon={faTrash} size="lg" className="text-danger" />
                                        <span className="sr-only"><Translate value="action.edit">Delete</Translate></span>
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            }
        </Ordered>
    );
}