import React from 'react';
import { faDownload, faEdit, faPlusCircle, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import Popover from 'react-bootstrap/Popover';
import { Link } from 'react-router-dom';

import { Translate } from '../../i18n/components/translate';

import { DeleteConfirmation } from '../../core/components/DeleteConfirmation';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { useTranslator } from '../../i18n/hooks';
import useFetch from 'use-http';
import API_BASE_PATH from '../../App.constant';
import { downloadAsZip } from '../../core/utility/download_as';

export function ConfigurationList({ configurations, onDelete, loading }) {

    const remove = (id) => {
        onDelete(id);
    }

    const translate = useTranslator();

    const downloader = useFetch(`${API_BASE_PATH}/shib/property/set`, {
        cachePolicy: 'no-cache',
        headers: {
            'Content-Type': 'application/zip',
            'Accept': 'application/zip'
        }
    });

    const download = async (id, type) => {
        await downloader.get(`/${id}${ type === 'single' ? '/onefile' : '' }`);
        const file = await downloader.response.blob();
        if (downloader.response.ok) {
            downloadAsZip('configuration', file);
        }
    };

    return (
        <DeleteConfirmation title={`message.delete-property-title`} body={`message.delete-property-body`}>
            {(block) =>
                <div className="container-fluid p-3">
                    {loading ? 
                        <div className="d-flex justify-content-end flex-fill">
                            <FontAwesomeIcon icon={faSpinner} spin={true} pulse={true} size="lg" />
                        </div>
                    :
                    <section className="section">
                        <div className="section-body border border-top-0 border-primary">
                            <div className="section-header bg-primary p-2 text-light">
                                <span className="lead">
                                    <Translate value="label.configuration-management">Configuration Management</Translate>
                                </span>
                            </div>
                            <div className="p-3">
                                <div className="d-flex justify-content-end w-100">
                                    <Link to="./new" className="btn btn-sm btn-success">
                                        <FontAwesomeIcon icon={faPlusCircle} /> &nbsp;
                                        <Translate value="action.create-new-configuration">Create new configuration</Translate>
                                    </Link>
                                </div>
                                <div className="table-responsive mt-3">
                                    <table className="table table-striped w-100 table-hover">
                                        <thead>
                                            <tr>
                                                <th>
                                                    <Translate value="label.configuration-name">Configuration Name (label)</Translate>
                                                </th>
                                                <th className="text-center">
                                                    <Translate value="label.download-config">Download</Translate>
                                                </th>
                                                <th className="text-end">
                                                    <Translate value="label.actions">Actions</Translate>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {(configurations?.length > 0) ? configurations.map((c, i) =>
                                                <tr key={i}>
                                                    <td className="align-middle">
                                                        <Link to={`../configurations/${c.resourceId}/edit`}>
                                                            {c.name}
                                                        </Link>
                                                    </td>
                                                    <td className="text-center">
                                                        <div className="d-flex justify-content-center">

                                                            <OverlayTrigger trigger={['hover', 'focus']} overlay={(
                                                                <Popover variant="info" id="tooltip.download-single-config">
                                                                    <Popover.Body><Translate value={'tooltip.download-single-config'} /></Popover.Body>
                                                                </Popover>
                                                            )}
                                                            aria-label={translate('')}>
                                                                <Button onClick={() => download(c.resourceId, 'single')} variant="link" disabled={downloader.loading} id="info-tooltip.download-single-config">
                                                                    <FontAwesomeIcon icon={faDownload} />
                                                                    &nbsp; <Translate value="action.download-single-config">Single file</Translate>
                                                                </Button>
                                                            </OverlayTrigger>
                                                            <div className="vr"></div>
                                                            <OverlayTrigger trigger={['hover', 'focus']} overlay={(
                                                                <Popover variant="info" id="tooltip.download-multi-config">
                                                                    <Popover.Body><Translate value={'tooltip.download-multi-config'} /></Popover.Body>
                                                                </Popover>
                                                            )}
                                                            aria-label={translate('')}>
                                                                <Button onClick={() => download(c.resourceId, 'multi')} variant="link" disabled={downloader.loading} id={`info-tooltip.download-multi-config`}>
                                                                    <FontAwesomeIcon icon={faDownload} />
                                                                    &nbsp; <Translate value="action.download-multi-config">Multi file</Translate>
                                                                </Button>
                                                            </OverlayTrigger>
                                                            {downloader.loading && <FontAwesomeIcon icon={faSpinner} pulse={true} />}
                                                        </div>
                                                    </td>
                                                    <td className="text-end">
                                                        <ButtonGroup aria-label="Actions" className="ms-4" >
                                                            <Link className="btn btn-primary" to={`../configurations/${c.resourceId}/edit`}>
                                                                <FontAwesomeIcon icon={faEdit} size="lg" />
                                                                &nbsp; Edit
                                                            </Link>
                                                            <Button variant="danger" onClick={() => block(() => remove(c.resourceId))}>
                                                                <FontAwesomeIcon icon={faTrash} size="lg" />
                                                                &nbsp; <Translate value="action.delete">Delete</Translate>
                                                            </Button>
                                                        </ButtonGroup>
                                                    </td>
                                                </tr>
                                            ) : <tr>
                                                <td colSpan="3">
                                                    <Translate value="message.configurations-none">No configurations.</Translate>
                                                </td>
                                            </tr>}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </section>
                    }
                </div>
            }
        </DeleteConfirmation>
    );
}