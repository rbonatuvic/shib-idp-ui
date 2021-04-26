import React from 'react';

import Translate from '../../i18n/components/translate';

import { MetadataObjectContext, MetadataTypeContext } from '../hoc/MetadataSelector';

export function MetadataEditor () {

    const metadata = React.useContext(MetadataObjectContext);
    const type = React.useContext(MetadataTypeContext);

    return (
        <section className="section" aria-label={`Edit metadata ${type} - ${metadata.serviceProviderName || metadata.name }`} tabIndex="0">
            <div className="section-header bg-info p-2 text-white">
                <div className="row justify-content-between">
                    <div className="col-md-12">
                        <span className="display-6">
                            <i className="fa fa-fw fa-gears"></i>
                            Edit metadata { type } - {metadata.serviceProviderName || metadata.name}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    );
}