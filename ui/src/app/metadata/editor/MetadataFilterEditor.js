import React from 'react';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useParams } from 'react-router';
import Alert from 'react-bootstrap/Alert';

import Translate from '../../i18n/components/translate';
import { MetadataFormContext, setFormDataAction, setFormErrorAction } from '../hoc/MetadataFormContext';
import { MetadataDefinitionContext, MetadataSchemaContext } from '../hoc/MetadataSchema';

import { MetadataEditorForm } from './MetadataEditorForm';
import { MetadataEditorNav } from './MetadataEditorNav';
import { useMetadataFilters } from '../hooks/api';
import { MetadataFilterContext } from '../hoc/MetadataFilterSelector';
import { checkChanges } from '../hooks/utility';

export function MetadataFilterEditor({children, onNavigate, block}) {

    const { id, section } = useParams();

    const { data } = useMetadataFilters(id, {}, []);
    const definition = React.useContext(MetadataDefinitionContext);
    const schema = React.useContext(MetadataSchemaContext);
    const current = React.useContext(MetadataFilterContext);

    const { state, dispatch } = React.useContext(MetadataFormContext);
    const { metadata, errors } = state;

    const onChange = (changes) => {
        dispatch(setFormDataAction(changes.formData));
        dispatch(setFormErrorAction(changes.errors));
        block(checkChanges(metadata, changes.formData));
    };

    const validator = definition.validator(data, current);

    const warnings = definition.warnings && definition.warnings(metadata);

    return (
        <div className="">
            <div className="row">
                <div className="col-6 d-lg-none order-1">
                    <MetadataEditorNav
                        onNavigate={onNavigate}
                        definition={definition}
                        current={section}
                        base={`/metadata/provider/${id}/edit`}
                        format='dropdown'
                        errors={errors}>
                    </MetadataEditorNav>
                </div>
                <div className="col-6 col-lg-3 order-2 text-right">
                    {children(metadata, errors.length > 0)}
                </div>
                <div className={`col-xs-12 col-lg-9 order-lg-1 order-3 align-items-start ${errors.length > 0 ? 'justify-content-between' : 'justify-content-end'}`}>
                    {errors.length > 0 &&
                        <Alert variant="danger" className="align-self-start alert-compact mt-3 mt-lg-0 mb-2">
                            <p className="m-0"><FontAwesomeIcon icon={faExclamationTriangle} size="lg" className="mr-2" /> <Translate value="message.editor-invalid" /></p>
                        </Alert>
                    }
                    {errors.length === 0 && warnings && warnings.hasOwnProperty(section) &&
                        <Alert variant="danger" className="align-self-start alert-compact mt-3 mt-lg-0">
                            {warnings[section].map((w, widx) =>
                                <p className="m-0" key={widx}>
                                    <FontAwesomeIcon icon={faExclamationTriangle} size="lg" className="mr-2" />
                                    <Translate value={w} />
                                </p>
                            )}
                        </Alert>
                    }
                </div>
            </div>
            <hr />
            <div className="row">
                <div className="col-lg-3 d-none d-lg-block">
                    <MetadataEditorNav
                        onNavigate={onNavigate}
                        definition={definition}
                        current={section}
                        base={`/metadata/provider/${id}/edit`}
                        format='tabs'
                        errors={errors}>
                    </MetadataEditorNav>
                </div>
                <div className="col-lg-9">
                    {definition && schema && metadata &&
                        <MetadataEditorForm
                            metadata={metadata}
                            definition={definition}
                            schema={schema}
                            current={section}
                            onChange={onChange}
                            validator={validator} />
                    }
                </div>
            </div>
        </div>
    );
}