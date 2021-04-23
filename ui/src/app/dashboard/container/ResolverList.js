import React from 'react';
import useFetch from 'use-http';
import Translate from '../../i18n/components/translate';
import API_BASE_PATH from '../../App.constant';

import SourceList from '../../metadata/source/component/SourceList';

export function ResolverList () {

    const { data = [] } = useFetch(`${API_BASE_PATH}/EntityDescriptors`, {}, []);

    return (
        <section className="section">
            <div className="section-body border border-top-0 border-primary">
                <div className="section-header bg-primary p-2 text-light">
                    <span className="lead">
                        <Translate value="label.current-metadata-sources">Current Metadata Sources</Translate>
                    </span>
                </div>
                <div className="p-3">
                    { /* search goes here */ }
                    <SourceList entities={ data }></SourceList>
            
                </div>
            </div>
        </section>
    );
}