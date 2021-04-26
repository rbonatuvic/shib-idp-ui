import React from 'react';
import { Link } from 'react-router-dom';
import Translate from '../../i18n/components/translate';

import { MetadataObjectContext } from '../hoc/MetadataSelector';

export function MetadataDetail ({ children }) {

    const metadata = React.useContext(MetadataObjectContext);

    return (
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
                                    { metadata.serviceProviderName || metadata.name }
                                </span>
                            </li>
                        </ol>
                    </nav>
                    { children }
                </div>
            </section>
        </div>
        
    );
}