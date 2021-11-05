import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Translate from '../../../i18n/components/translate';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAsterisk, faCaretDown, faCaretUp, faEye, faEyeSlash, faPlus, faSpinner, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useTranslator } from '../../../i18n/hooks';
import { InfoIcon } from '../InfoIcon';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import useFetch from 'use-http';
import queryString from 'query-string';
import API_BASE_PATH from '../../../App.constant';
import isNil from 'lodash/isNil';
import Editor from 'react-simple-code-editor';
// import { highlight, languages } from 'prismjs/components/prism-core';
// import 'prismjs/components/prism-clike';
// import 'prismjs/components/prism-javascript';

import { FilterTargetPreview } from '../../../metadata/hoc/FilterTargetPreview';

const ToggleButton = ({ isOpen, onClick, disabled }) => (
    <Button
        type="button"
        variant="outline-secondary"
        className="toggle-button"
        onClick={onClick}
        disabled={disabled}
        onMouseDown={e => {
            // Prevent input from losing focus.
            e.preventDefault();
        }}>
        <FontAwesomeIcon icon={isOpen ? faCaretUp : faCaretDown} />
    </Button>
);

const FilterTargetField = ({
    schema,
    label,
    id,
    name,
    disabled,
    value,
    readonly,
    rawErrors,
    onChange,
    errorSchema,
    formData,
    formContext,
    ...props
}) => {

    const { group } = formContext;
    const regex = new RegExp(group?.validationRegex || '/*');

    const typeFieldName = `${name}Type`;

    const type = schema.properties[typeFieldName];
    const typeOptions = type['enum'].map((v, e) => ({
        label: type['enumNames'][e],
        value: type['enum'][e]
    }));

    const [selectedType, setSelectedType] = React.useState(formData && formData.hasOwnProperty(typeFieldName) ? typeOptions.find(t => formData[typeFieldName] === t.value) : typeOptions[0]);
    const [selectedTarget, setSelectedTarget] = React.useState([...(formData.value && !isNil(formData.value) && !isNil(formData.value[0]) ? formData.value : [])]);

    const [term, setSearchTerm] = React.useState('');
    const [match, setMatch] = React.useState(true);
    const [touched, setTouched] = React.useState(false);
    const [ids, setSearchIds] = React.useState([]);

    const { get, response } = useFetch(`${API_BASE_PATH}/EntityIds/search`, {
        cachePolicy: 'no-cache'
    });

    async function searchIds (query) {
        const { entityIds } = get(`?${queryString.stringify({
            term: query,
            limit: 10
        })}`)
        if (response.ok) {
            setSearchIds(entityIds);
        }
    }

    /*eslint-disable react-hooks/exhaustive-deps*/
    React.useEffect(() => {
        if (term?.length >= 4) {
            searchIds(term);
        }
    }, [term]);

    React.useEffect(() => {
        onChange({
            [typeFieldName]: selectedType.value,
            value: selectedTarget
        })
    }, [selectedType, selectedTarget]);

    const displayType = selectedType?.label || '';
    const targetType = selectedType?.value || null;

    var handleTextChange = function (value) {
        setSelectedTarget([value]);
    };

    const translate = useTranslator();

    const onSelectValue = (value) => {
        setSelectedTarget([
            value,
            ...selectedTarget
        ]);
        setSearchTerm('');
    };
    const removeId = (id) => {
        setSelectedTarget([
            ...selectedTarget.filter(t => t !== id)
        ]);
    };

    const onEntityIdsChange = (value) => {
        setSearchTerm(value);
        setMatch(regex ? regex.test(value) : true);
    };

    const selectType = (option) => {
        setSelectedTarget([]);
        setSelectedType(option);
    };

    return (
        <fieldset>
            <legend><Translate value={label || schema.title} /></legend>
            <div className="row">
                <div className="col-lg-6">
                    <div>
                        <label htmlFor={id} className="d-flex justify-content-start align-items-center control-label">
                            <Translate value="action.search-by">Search By</Translate>
                            <FontAwesomeIcon icon={faAsterisk} className="text-danger ml-1 mr-2" />
                            <InfoIcon value={translate('action.search-by')}></InfoIcon>
                        </label>
                        <Dropdown>
                            <Dropdown.Toggle variant="outline-secondary" id={`dropdown-${type.title}`}>
                                <Translate value={selectedType.label || type.title}>{selectedType.label || type.title}</Translate>&nbsp;
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {typeOptions.map((option) => (
                                    <Dropdown.Item as="button" onClick={() => selectType(option)} key={option.value} type="button">
                                        <Translate value={option.label}>{option.label}</Translate>
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                    <br />
                    <div>
                        <label htmlFor="targetInput" className="d-flex justify-content-start control-label">
                            <span>
                                <Translate value="label.search-criteria-by" params={{ displayType: translate(displayType) }}>
                                    Search Criteria by
                                </Translate>&nbsp;&nbsp;
                                <i className="fa fa-asterisk text-danger" aria-hidden="true"></i>
                            </span>
                            <span>
                                <InfoIcon value={translate('label.search-criteria-by')} params={{ displayType: translate(displayType) }}></InfoIcon>
                            </span>
                        </label>
                        <div className="d-flex justify-content-between">
                            <div className="flex-grow-1">
                                {targetType === 'ENTITY' &&
                                    <>
                                        <AsyncTypeahead
                                            isLoading={false}
                                            options={ids}
                                            id={`option-selector-${id}`}
                                            allowNew={true}
                                            multiple={false}
                                            className={`toggle-typeahead`}
                                            disabled={disabled || readonly}
                                            onInputChange={onEntityIdsChange}
                                            selected={ [term] }
                                            onChange={ () => {} }
                                            onBlur={() => setTouched(true)}
                                            onSearch={ (query) => setSearchTerm(query) }
                                            renderMenuItemChildren={(option, { options, text }, index) =>
                                                <span className={options.indexOf(text) === index ? 'font-weight-bold' : ''}>{option}</span>
                                            }>
                                            {({ isMenuShown, toggleMenu }) => (
                                                <ToggleButton isOpen={isMenuShown} onClick={e => toggleMenu()} disabled={disabled || readonly} />
                                            )}
                                        </AsyncTypeahead>
                                        {(!touched || match) ?
                                            <small>
                                                <Translate value="message.entity-id-min-unique">
                                                You must add at least one entity id target and they must each be unique.
                                                </Translate>
                                            </small>
                                            :
                                            <small className="text-danger">
                                                <Translate value="message.group-pattern-fail" params={{regex: group?.validationRegex}}>
                                                    Invalid URL
                                                </Translate>
                                            </small>
                                        }
                                    </>
                                }
                                { targetType === 'CONDITION_SCRIPT' &&
                                    <div className="editor">
                                    <Editor
                                        value={selectedTarget[0]}
                                        highlight={(code) => code}
                                        onValueChange={(code) => handleTextChange(code)}
                                        padding={10}
                                        className={`codearea border rounded ${!selectedTarget[0] && 'is-invalid border-danger'}`}
                                        style={{
                                            fontFamily: 'monospace',
                                            fontSize: 15,
                                        }}>
                                    </Editor>
                                    {!selectedTarget[0] && <small id="script-help" className="text-danger">
                                        <Translate value="message.required-for-scripts">Required for Scripts</Translate>
                                    </small>}
                                </div> }
                                {targetType === 'REGEX' &&
                                    <>
                                        <input id="targetInput"
                                            className="form-control"
                                            type="text"
                                            name="script"
                                            value={selectedTarget[0]}
                                            onChange={ ({target: { value }}) => handleTextChange(value) } />
                                        {errorSchema?.value?.__errors ?
                                            <small className="form-text text-danger">
                                                {errorSchema?.value?.__errors?.map((error, eIdx) =>
                                                    <React.Fragment key={eIdx}>
                                                        <Translate value={error}>{error}</Translate>
                                                    </React.Fragment>
                                                )}
                                            </small> :
                                            <small id="regex-help" className="form-text text-secondary">
                                                <Translate value="message.required-for-regex">Required for Regex</Translate>
                                                &nbsp;
                                            </small>
                                        }
                                    </>
                                }
                                
                            </div>
                            {targetType === 'ENTITY' &&
                                <div className="ml-2">
                                    <Button variant="success"
                                        type="button"
                                        disabled={!term || !match}
                                        onClick={() => onSelectValue(term)}>
                                        <Translate value="action.add-entity-id">Add Entity ID</Translate>&nbsp;&nbsp;
                                        <FontAwesomeIcon icon={faPlus} />
                                    </Button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
                {targetType === 'ENTITY' &&
                    <div className="col-lg-6">
                        <label className="control-label"><Translate value="label.entity-ids-added">Entity Ids Added</Translate></label>
                        <hr />
                        <ul className="list-group list-group-sm list-group-scroll">
                        {selectedTarget.map(id => 
                            <li key={id} className="list-group-item d-flex justify-content-between align-items-center">
                                <FilterTargetPreview entityId={id}>
                                    {(preview, loading, xml) => (
                                        <React.Fragment>
                                            <span tabIndex="0">{id}</span>
                                            <span>
                                                {preview &&
                                                    <Button disabled={loading || !xml} type="button" 
                                                    variant="link"
                                                    className="text-right" onClick={() => preview(id)}>
                                                        <FontAwesomeIcon icon={loading ? faSpinner : xml ? faEye : faEyeSlash} pulse={loading} size="lg" className="text-success sr-hidden" />
                                                        <span className="sr-only"><Translate value="action.preview">Preview</Translate></span>
                                                    </Button>
                                                }
                                                <Button type="button" 
                                                variant="link"
                                                className="text-right" onClick={() => removeId(id)}>
                                                    <FontAwesomeIcon icon={faTrash} size="lg" className="text-danger sr-hidden" />
                                                    <span className="sr-only"><Translate value="action.remove">Remove</Translate></span>
                                                </Button>
                                            </span>
                                        </React.Fragment>
                                    )}
                                </FilterTargetPreview>
                            </li>
                        )}
                        </ul>
                    </div>
                }
            </div>
        </fieldset>
    );
};

/*
*/

export default FilterTargetField;