import React from 'react';
import { Link } from 'react-router-dom';
import Badge from 'react-bootstrap/Badge';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronCircleDown, faChevronCircleUp } from '@fortawesome/free-solid-svg-icons';

import FormattedDate from '../../../../core/components/FormattedDate';
import Translate from '../../../../i18n/components/translate';
import { Scroller } from '../../../../dashboard/component/Scroller';

export function ProviderList({ entities, reorder = true, first, last, onOrderUp, onOrderDown }) {
    return (
        <Scroller entities={entities}>
        {(limited) => <div className="table-responsive mt-3 provider-list!">
            <table className="table table-striped w-100 table-hover">
                <thead>
                    <tr>
                        <th><Translate value="label.order">Order</Translate></th>
                        <th className="w-25"><Translate value="label.title">Title</Translate></th>
                        <th className="w-15"><Translate value="label.provider-type">Provider Type</Translate></th>
                        <th className="w-15"><Translate value="label.author">Author</Translate></th>
                        <th className="w-15"><Translate value="label.creation-date">Created Date</Translate></th>
                        <th className="text-right w-15"><Translate value="label.enabled">Enabled</Translate></th>
                    </tr>
                </thead>
                <tbody>
                    {limited.map((provider, idx) =>
                        <tr key={idx}>
                            <td className="align-middle">
                                <div className="d-flex align-items-center">
                                    {reorder ?
                                        <div className="provider-index text-center text-primary font-weight-bold">{idx + 1}</div>
                                        :
                                        <div className="provider-index text-center text-primary font-weight-bold">&mdash;</div>
                                    }
                                    &nbsp;
                                    <Button 
                                        onClick={ () => onOrderDown(provider.resourceId) }
                                        variant="link"
                                        className=" px-1"
                                        disabled={provider.resourceId === last || !reorder}
                                        aria-label="Decrease reorder by 1">
                                            <FontAwesomeIcon className="text-info" icon={faChevronCircleDown} size="lg" />
                                        <i className="fa text-info fa-lg fa-chevron-circle-down" aria-hidden="true"></i>
                                    </Button>
                                    <Button
                                        onClick={ () => onOrderUp(provider.resourceId) }
                                        variant="link"
                                        className="px-1"
                                        aria-label="Increase reorder by 1"
                                        disabled={provider.resourceId === first || !reorder}>
                                        <FontAwesomeIcon className="text-info" icon={faChevronCircleUp} size="lg" />
                                        <i className="fa text-info fa-lg fa-chevron-circle-up" aria-hidden="true"></i>
                                    </Button>
                                </div>
                            </td>
                            <td className="align-middle">
                                <Link to={`/metadata/provider/${provider.resourceId}/configuration/options`}>{provider.name}</Link>
                            </td>
                            <td className="align-middle">{ provider['@type'] }</td>
                            <td className="align-middle">{ provider.createdBy }</td>
                            <td className="align-middle"><FormattedDate date={provider.createdDate} /></td>
                            <td className="text-right align-middle">
                                <Badge variant={provider.enabled ? 'success' : 'danger'}>
                                    <Translate value={provider.enabled ? 'value.enabled' : 'value.disabled'}></Translate>
                                </Badge>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        }
        </Scroller>
    );
}

export default ProviderList;