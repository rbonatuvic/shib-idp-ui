import React from 'react';
import useFetch from 'use-http';
import UserManagement from '../../admin/container/UserManagement';
import API_BASE_PATH from '../../App.constant';

import Translate from '../../i18n/components/translate';

export function ActionsTab() {

    return (
        <>
            <section className="section">
                <div className="section-body border border-top-0 border-primary">
                    <div className="section-header bg-primary p-2 text-light">
                        <div className="row justify-content-between">
                            <div className="col-12">
                                <span className="lead"><Translate value="label.enable-metadata-sources">Enable Metadata Sources</Translate></span>
                            </div>
                        </div>
                    </div>
                    <div className="p-3">
                        {/*<enable-metadata></enable-metadata>*/}
                    </div>
                </div>
            </section>
            <section className="section">
                <div className="section-body border border-top-0 border-primary">
                    <div className="section-header bg-primary p-2 text-light">
                        <div className="row justify-content-between">
                            <div className="col-12">
                                <span className="lead"><Translate value="label.user-access-request">User Access Request</Translate></span>
                            </div>
                        </div>
                    </div>
                    {/*<access-request-component></access-request-component>*/}
                </div>
            </section>
        </>

    );
}

export default ActionsTab;