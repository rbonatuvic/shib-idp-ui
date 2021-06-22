import React from 'react';

import { Prompt, useHistory } from 'react-router';
import Translate from '../../i18n/components/translate';
import { useGroups } from '../hooks';
import { Schema } from '../../form/Schema';
import { FormManager } from '../../form/FormManager';
import { GroupForm } from '../component/GroupForm';

export function NewGroup() {
    const history = useHistory();

    const { post, response, loading } = useGroups({});

    const [blocking, setBlocking] = React.useState(false);

    async function save(group) {
        await post(``, group);
        if (response.ok) {
            gotoDetail({ refresh: true });
        }
    };

    const cancel = () => {
        gotoDetail();
    };

    const gotoDetail = (state = null) => {
        setBlocking(false);
        history.push(`/groups`, state);
    };

    return (
        <div className="container-fluid p-3">
            <Prompt
                when={blocking}
                message={location =>
                    `message.unsaved-editor`
                }
            />
            <section className="section" tabIndex="0">
                <div className="section-header bg-info p-2 text-white">
                    <div className="row justify-content-between">
                        <div className="col-md-12">
                            <span className="display-6"><Translate value="label.new-group">Add a new group</Translate></span>
                        </div>
                    </div>
                </div>
                <div className="section-body p-4 border border-top-0 border-info">
                    <Schema path={`/assets/schema/groups/group.json`}>
                        {(schema) => 
                        <FormManager initial={{}}>
                            {(data, errors) =>
                            <GroupForm
                                group={data}
                                errors={errors}
                                schema={schema}
                                loading={loading}
                                onSave={(data) => save(data)}
                                onCancel={() => cancel()} />}
                        </FormManager> }
                    </Schema>
                </div>
            </section>
        </div>
    );
}