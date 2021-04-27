import React from 'react';
import { SourcesActions } from '../../admin/container/SourcesActions';
import UserActions from '../../admin/container/UserActions';

import Translate from '../../i18n/components/translate';

export function ActionsTab({ sources, users, reloadSources, reloadUsers }) {

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
                        <SourcesActions sources={sources} reloadSources={reloadSources} />
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
                    <UserActions users={users} reloadUsers={reloadUsers} />
                </div>
            </section>
        </>

    );
}

export default ActionsTab;