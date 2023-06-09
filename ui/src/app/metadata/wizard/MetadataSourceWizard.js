import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import Alert from 'react-bootstrap/Alert';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { WizardNav } from './WizardNav';
import { MetadataWizardForm } from './MetadataWizardForm';
import { setWizardIndexAction, useCurrentIndex, useIsFirstPage, useIsLastPage, useWizardDispatcher } from './Wizard';
import { useMetadataDefinitionContext, useMetadataSchemaContext, useMetadataDefinitionValidator, useMetadataSchemaLoading } from '../hoc/MetadataSchema';
import { useMetadataFormDispatcher, setFormDataAction, setFormErrorAction, useMetadataFormData, useMetadataFormErrors } from '../hoc/MetadataFormContext';
import { MetadataConfiguration } from '../component/MetadataConfiguration';
import { Configuration } from '../hoc/Configuration';
import { useMetadataSources } from '../hooks/api';

import Translate from '../../i18n/components/translate';
import { checkChanges } from '../hooks/utility';
import { useCurrentUserLoader, useUserGroup } from '../../core/user/UserContext';
import Spinner from '../../core/components/Spinner';


export function MetadataSourceWizard ({ onShowNav, onSave, block, loading }) {

    const group = useUserGroup();

    const userLoader = useCurrentUserLoader();
    const schemaLoading = useMetadataSchemaLoading();

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => {
        userLoader();
    }, []);

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
        block(checkChanges(metadata, changes.formData));
    };

    const onEditFromSummary = (idx) => {
        wizardDispatch(setWizardIndexAction(idx));
    };

    const save = () => onSave(definition.parser(metadata));

    const validator = useMetadataDefinitionValidator(data, null, group);
    const warnings = definition.warnings && definition.warnings(metadata);

    return (
        <>
            <div className="row mb-4">
                <div className="col-12">
                    <WizardNav onSave={save} disabled={ errors.length > 0 || loading } saving={loading} />
                </div>
            </div>
            <hr />
            {schemaLoading && <div className="d-flex justify-content-center text-primary col-6"><Spinner size="4x" /></div> }
            {warnings && warnings.hasOwnProperty(current) &&
                <Row className="mb-4">
                    <Col xs="12" lg="6" className="align-items-start">
                        <Alert variant="danger" className="align-self-start alert-compact mt-3 mt-lg-0">
                            {warnings[current].map((w, widx) =>
                                <p className="m-0" key={widx}><FontAwesomeIcon icon={faExclamationTriangle} size="lg" className="me-2" /> <Translate value={w} /></p>
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
