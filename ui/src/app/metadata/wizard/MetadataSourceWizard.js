import React from 'react';
import { WizardNav } from './WizardNav';
import { MetadataWizardForm } from './MetadataWizardForm';
import { setWizardIndexAction, useCurrentIndex, useIsFirstPage, useIsLastPage, useWizardDispatcher } from './Wizard';
import { useMetadataDefinitionContext, useMetadataSchemaContext } from '../hoc/MetadataSchema';
import { useMetadataSchema } from '../hooks/schema';
import { useMetadataFormDispatcher, setFormDataAction, setFormErrorAction, useMetadataFormData, useMetadataFormErrors } from '../hoc/MetadataFormContext';
import { MetadataConfiguration } from '../component/MetadataConfiguration';
import { Configuration } from '../hoc/Configuration';
import { useMetadataEntity } from '../hooks/api';
import { useHistory } from 'react-router';
import { removeNull } from '../../core/utility/remove_null';

export function MetadataSourceWizard ({ onShowNav }) {

    const { post, loading, response } = useMetadataEntity('source');
    const history = useHistory();

    const definition = useMetadataDefinitionContext();
    const schema = useMetadataSchemaContext();
    const processed = useMetadataSchema(definition, schema);

    const formDispatch = useMetadataFormDispatcher();
    const metadata = useMetadataFormData();
    const errors = useMetadataFormErrors();

    const isFirst = useIsFirstPage();
    const isLast = useIsLastPage();

    const wizardDispatch = useWizardDispatcher();

    React.useEffect(() => {
        onShowNav(isFirst);
    }, [isFirst, onShowNav]);

    const current = useCurrentIndex();

    const onChange = (changes) => {
        formDispatch(setFormDataAction(changes.formData));
        formDispatch(setFormErrorAction(current, changes.errors));
        // console.log('change', changes);
    };

    const onEditFromSummary = (idx) => {
        wizardDispatch(setWizardIndexAction(idx));
    };

    const onBlur = (form) => {
        console.log(form);
    }

    async function save () {
        const body = removeNull(metadata, true);
        console.log(body);
        await post('', body);
        if (response.ok) {
            history.push('/');
        } else {
            console.log(response.body);
        }
    }

    // console.log(errors);

    return (
        <>
            <div className="row mb-4">
                <div className="col-12">
                    <WizardNav onSave={save} disabled={ errors.length > 0 || loading } saving={loading} />
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-12">
                    <MetadataWizardForm
                        metadata={metadata}
                        definition={definition}
                        schema={processed}
                        current={current}
                        onChange={onChange}
                        onBlur={onBlur} />
                </div>
            </div>
            {isLast &&
            <div className="row">
                <div className="col-12">
                    <Configuration entities={[metadata]} schema={processed} definition={definition}>
                        {(config) => <MetadataConfiguration configuration={config} onEdit={onEditFromSummary} />}
                    </Configuration>
                </div>
            </div>
            }
        </>
    );
}