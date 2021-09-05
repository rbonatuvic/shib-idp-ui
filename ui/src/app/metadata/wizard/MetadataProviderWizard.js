import React from 'react';
import { WizardNav } from './WizardNav';
import { MetadataWizardForm } from './MetadataWizardForm';
import { setWizardIndexAction, useCurrentIndex, useIsLastPage, useWizardDispatcher } from './Wizard';
import { useMetadataDefinitionContext, useMetadataDefinitionValidator, useMetadataSchemaContext } from '../hoc/MetadataSchema';
import { checkChanges, useMetadataSchema } from '../hooks/schema';
import { useMetadataFormDispatcher, setFormDataAction, setFormErrorAction, useMetadataFormData, useMetadataFormErrors } from '../hoc/MetadataFormContext';
import { MetadataConfiguration } from '../component/MetadataConfiguration';
import { Configuration } from '../hoc/Configuration';
import { useMetadataProviders } from '../hooks/api';

import { removeNull } from '../../core/utility/remove_null';

import { useNotificationDispatcher, createNotificationAction, NotificationTypes } from '../../notifications/hoc/Notifications';
import { useUserGroup } from '../../core/user/UserContext';

export function MetadataProviderWizard({onSave, loading, block}) {

    const { data } = useMetadataProviders({cachePolicy: 'no-cache'}, []);
    const group = useUserGroup();

    const definition = useMetadataDefinitionContext();
    const schema = useMetadataSchemaContext();

    const processed = useMetadataSchema(definition, schema);

    const formDispatch = useMetadataFormDispatcher();
    const metadata = useMetadataFormData();
    const errors = useMetadataFormErrors();

    const isLast = useIsLastPage();

    const wizardDispatch = useWizardDispatcher();

    const current = useCurrentIndex();

    const onChange = (changes) => {
        formDispatch(setFormDataAction(changes.formData));
        formDispatch(setFormErrorAction(changes.errors));
        block(checkChanges(metadata, changes.formData));
    };

    const onEditFromSummary = (idx) => {
        wizardDispatch(setWizardIndexAction(idx));
    };

    const onBlur = (form) => {
        // console.log(form);
    }

    const validator = useMetadataDefinitionValidator(data, null, group);

    const save = () => onSave(removeNull(definition.parser(metadata), true))

    return (
        <>

            <div className="row mb-4">
                <div className="col-12">
                    <WizardNav onSave={save}
                        disabled={errors.length > 0 || loading}
                        saving={loading} />
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-12">
                    <MetadataWizardForm
                        metadata={metadata}
                        definition={definition}
                        schema={schema || {}}
                        current={current}
                        onChange={onChange}
                        validator={ validator } />
                </div>
            </div>
            {isLast &&
                <div className="row">
                    <div className="col-12">
                        <Configuration entities={[removeNull(metadata)]} schema={processed} definition={definition}>
                            {(config) => <MetadataConfiguration configuration={config} onEdit={onEditFromSummary} />}
                        </Configuration>
                    </div>
                </div>
            }
        </>
    );
}
