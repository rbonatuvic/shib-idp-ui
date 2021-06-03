import React from 'react';
import { WizardNav } from './WizardNav';
import { MetadataWizardForm } from './MetadataWizardForm';
import { setWizardIndexAction, useCurrentIndex, useIsFirstPage, useIsLastPage, useWizardDispatcher } from './Wizard';
import { useMetadataDefinitionContext, useMetadataSchemaContext } from '../hoc/MetadataSchema';
import { useMetadataFormDispatcher, setFormDataAction, setFormErrorAction, useMetadataFormData, useMetadataFormErrors } from '../hoc/MetadataFormContext';
import { MetadataConfiguration } from '../component/MetadataConfiguration';
import { Configuration } from '../hoc/Configuration';
import { useMetadataEntity, useMetadataSources } from '../hooks/api';
import { useHistory } from 'react-router';
import { removeNull } from '../../core/utility/remove_null';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Translate from '../../i18n/components/translate';
import Alert from 'react-bootstrap/esm/Alert';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

export function MetadataSourceWizard ({ onShowNav }) {

    const { post, loading, response } = useMetadataEntity('source');
    const history = useHistory();

    const { data } = useMetadataSources({
        cachePolicy: 'no-cache'
    }, []);

    const definition = useMetadataDefinitionContext();
    const schema = useMetadataSchemaContext();

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
        formDispatch(setFormErrorAction(changes.errors));
        // console.log('change', changes);
    };

    const onEditFromSummary = (idx) => {
        wizardDispatch(setWizardIndexAction(idx));
    };

    const onBlur = (form) => {
        // console.log(form);
    }

    async function save () {
        const body = removeNull(metadata, true);
        await post('', body);
        if (response.ok) {
            history.push('/');
        } else {
            console.log(response.body);
        }
    }

    const validator = definition.validator(data);
    const warnings = definition.warnings && definition.warnings(metadata);

    return (
        <>
            <div className="row mb-4">
                <div className="col-12">
                    <WizardNav onSave={save} disabled={ errors.length > 0 || loading } saving={loading} />
                </div>
            </div>
            <hr />
            {warnings && warnings.hasOwnProperty(current) &&
                <Row className="mb-4">
                    <Col xs="12" lg="6" className="align-items-start">
                        <Alert variant="danger" className="align-self-start alert-compact mt-3 mt-lg-0">
                            {warnings[current].map((w, widx) =>
                                <p className="m-0" key={widx}><FontAwesomeIcon icon={faExclamationTriangle} size="lg" className="mr-2" /> <Translate value={w} /></p>
                            )}
                        </Alert>
                    </Col>
                    <br />
                </Row>
            }
            <div className="row">
                <div className="col-12">
                    <MetadataWizardForm
                        metadata={metadata}
                        definition={definition}
                        schema={schema || {}}
                        current={current}
                        onChange={onChange}
                        onBlur={onBlur}
                        validator={validator} />
                </div>
            </div>
            {isLast &&
            <div className="row">
                <div className="col-12">
                    <Configuration entities={[metadata]} schema={schema || {}} definition={definition}>
                        {(config) => <MetadataConfiguration configuration={config} onEdit={onEditFromSummary} />}
                    </Configuration>
                </div>
            </div>
            }
        </>
    );
}