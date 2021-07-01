import React from 'react';
import { Link } from 'react-router-dom';
import { MetadataVersionLoader } from '../hoc/MetadataVersionLoader';
import { Translate } from '../../i18n/components/translate';
import { useDateFormatter } from '../../core/components/FormattedDate';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export function MetadataConfirmRestore () {

    const formatter = useDateFormatter();

    return (
        <MetadataVersionLoader>
            {(metadata, loading) =>
                <div className="container-fluid p-3">
                    <section className="section" tabIndex="0">
                        <div className="section-body px-4 pb-4 border border-info">
                            <nav aria-label="breadcrumb">
                                <ol className="breadcrumb breadcrumb-bar">
                                    <li className="breadcrumb-item">
                                        <Link to="/dashboard"><Translate value="action.dashboard">Dashboard</Translate></Link>
                                    </li>
                                    <li className="breadcrumb-item active" aria-current="page">
                                        <span className="display-6">
                                            {metadata && (metadata.name || metadata.serviceProviderName)}
                                        </span>
                                    </li>
                                </ol>
                            </nav>
                            <>{loading ?
                                <div className="d-flex justify-content-center">
                                    <FontAwesomeIcon icon={faSpinner} pulse size="4x" />
                                    <span className="sr-only">Loading...</span>
                                </div>
                                :
                                <>{metadata &&
                                    <>
                                    <h2 className="mb-4">
                                        <Translate value="label.restore-version" params={{ date: formatter(metadata.modifiedDate, true) }}>
                                            Restore Version ( date )
                                        </Translate>
                                    </h2>
                                    <div className="d-flex justify-content-center align-items-center">
                                        <div className="card m-4 w-50">
                                            <div className="card-body">
                                                <h3 className="card-title">
                                                    <Translate value="message.create-new-version-from-version">Create New Version from Previous Settings</Translate>
                                                </h3>
                                                <p><Translate value="message.restoring-this-version-will-copy" params={{ date: formatter(metadata.modifiedDate, true) }}>
                                                    Restoring this version will copy the Version ( date ) configuration and create a new Version from the selected version settings. You can then edit the configuration before saving the new version.</Translate>
                                                </p>
                                                <Link className="btn btn-light mr-2" to={`../../configuration/history`}><Translate value="action.cancel">Cancel</Translate></Link>
                                                <Link className="btn btn-primary" to={`./common/edit`}><Translate value="action.restore">Restore</Translate></Link>
                                            </div>
                                        </div>
                                    </div>
                                    </>
                                }</>
                                }
                            </>
                                
                            
                        </div>
                    </section>
                </div>
            }
        </MetadataVersionLoader>
    )
}