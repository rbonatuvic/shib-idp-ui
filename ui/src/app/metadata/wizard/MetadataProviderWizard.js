import React from 'react';
import { WizardNav } from './WizardNav';
import { MetadataWizardForm } from './MetadataWizardForm';
import { setWizardIndexAction, useCurrentIndex, useIsLastPage, useWizardDispatcher } from './Wizard';
import { useMetadataDefinitionContext, useMetadataSchemaContext } from '../hoc/MetadataSchema';
import { useMetadataSchema } from '../hooks/schema';
import { useMetadataFormDispatcher, setFormDataAction, setFormErrorAction, useMetadataFormData, useMetadataFormErrors } from '../hoc/MetadataFormContext';
import { MetadataConfiguration } from '../component/MetadataConfiguration';
import { Configuration } from '../hoc/Configuration';
import { useMetadataEntity, useMetadataProviders } from '../hooks/api';
import { useHistory } from 'react-router';
import { removeNull } from '../../core/utility/remove_null';

export function MetadataProviderWizard({onRestart}) {

    const { data } = useMetadataProviders({}, []);

    const { post, loading, response } = useMetadataEntity('provider');
    const history = useHistory();

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
        // console.log('change', changes);
    };

    const onEditFromSummary = (idx) => {
        wizardDispatch(setWizardIndexAction(idx));
    };

    const onBlur = (form) => {
        // console.log(form);
    }

    const validator = definition.validator(data);

    async function save() {
        const body = removeNull(definition.parser(metadata), true);
        await post('', body);
        if (response.ok) {
            history.push('/dashboard/metadata/manager/providers');
        } else {
            console.log(response.body);
        }
    }

    return (
        <>
            <div className="row mb-4">
                <div className="col-12">
                    <WizardNav onSave={save}
                        onRestart={onRestart}
                        disabled={errors.length > 0 || loading} saving={loading} />
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
                        onBlur={onBlur}
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