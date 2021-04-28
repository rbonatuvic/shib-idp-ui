import React from 'react';
import { Link } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleDown, faArrowCircleUp } from '@fortawesome/free-solid-svg-icons';

import { Ordered } from '../../../../dashboard/component/Ordered';
import { Translate } from '../../../../i18n/components/translate';
import { MetadataFiltersContext } from './MetadataFilters';

export function MetadataFilterEditorList ({provider}) {
    const filters = React.useContext(MetadataFiltersContext);

    const onToggleEnabled = () => {}
    const removeFilter = () => {}

    const disabled = false;

    return (
        <Ordered path={`/MetadataSources/${provider.resourceId}/FiltersPositionOrder` } entities={filters}>
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
                            <tr>
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
                                        <div className="custom-control custom-switch">
                                            <input type="checkbox"
                                                className="custom-control-input"
                                                disabled="disabled"
                                                id="'customSwitch' + i"
                                                value="filter.filterEnabled"
                                                checked="filter.filterEnabled"
                                                onChange={() => onToggleEnabled(filter)} />
                                            <label className="custom-control-label" htmlFor={`customSwitch-${i}`}>
                                                <span className="sr-only">Toggle this switch element</span>
                                            </label>
                                        </div>
                                        {filter.disabled && <i className="fa fa-spinner fa-pulse fa-lg fa-fw"></i>}
                                    </div>
                                </td>
                                <td className="td-sm">
                                    <Link className={`btn btn-link ${disabled ? 'disabled' : ''}`} to={`filter/${filter.resourceId}/edit`}>
                                        <i className="fa fa-edit fa-lg sr-hidden text-info"></i>
                                        <span className="sr-only"><Translate value="action.edit">Edit</Translate></span>
                                    </Link>
                                </td>
                                <td className="td-sm">
                                    <button className="btn btn-link" onClick={() => removeFilter(filter.resourceId)}>
                                        <i className="fa fa-trash fa-lg sr-hidden text-danger"></i>
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