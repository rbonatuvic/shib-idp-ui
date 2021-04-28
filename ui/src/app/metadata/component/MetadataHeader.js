import React from 'react';
import FormattedDate from '../../core/components/FormattedDate';

import Translate from '../../i18n/components/translate';

export function MetadataHeader ({ model, current = true, enabled = true, children, ...props }) {
    return (
        <div className="card enabled-status" {...props}>
            <div className="card-body">
                <div className="d-flex justify-content-between">
                    <h5 className="card-title version-title">
                        <Translate value="label.saved">Saved</Translate>:&nbsp;
                        <span className="save-date">
                            <FormattedDate date={model.modifiedDate} time={true} />
                        </span>
                        <br />
                        <Translate value="label.by">By</Translate>:&nbsp;
                        <span className="author">{model.createdBy }</span>
                    </h5>
                    {children}
                </div>
                
                <p className="card-text">
                    <span className={`badge badge-${enabled ? 'primary' : 'danger' }`}>
                        <Translate value={`value.${enabled ? 'enabled' : 'disabled'}`}>Enabled</Translate>
                    </span>
                    &nbsp;
                    <span className={`badge badge-${current ? 'primary' : 'warning'}`}>
                        <Translate value={`value.${current ? 'current' : 'not-current'}`}>Current</Translate>
                    </span>
                </p>
            </div>
        </div>
    );
}