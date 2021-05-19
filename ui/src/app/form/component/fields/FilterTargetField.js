import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Translate from '../../../i18n/components/translate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAsterisk, faCaretDown, faCaretUp, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useTranslator } from '../../../i18n/hooks';
import { InfoIcon } from '../InfoIcon';
import ContentEditable from 'react-contenteditable';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import useFetch from 'use-http';
import queryString from 'query-string';
import API_BASE_PATH from '../../../App.constant';
import isNil from 'lodash/isNil';

const ToggleButton = ({ isOpen, onClick, disabled }) => (
    <button
        type="button"
        className="btn btn-outline-secondary toggle-button"
        onClick={onClick}
        disabled={disabled}
        onMouseDown={e => {
            // Prevent input from losing focus.
            e.preventDefault();
        }}>
        <FontAwesomeIcon icon={isOpen ? faCaretUp : faCaretDown} />
    </button>
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
    ...props
}) => {
    const typeFieldName = `${name}Type`;

    const type = schema.properties[typeFieldName];
    const typeOptions = type['enum'].map((v, e) => ({
        label: type['enumNames'][e],
        value: type['enum'][e]
    }));

    const [selectedType, setSelectedType] = React.useState(formData && formData.hasOwnProperty(typeFieldName) ? typeOptions.find(t => formData[typeFieldName] === t.value) : typeOptions[0]);
    const [selectedTarget, setSelectedTarget] = React.useState([...(formData.value && !isNil(formData.value) && !isNil(formData.value[0]) ? formData.value : [])]);

    const [term, setSearchTerm] = React.useState('');
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
        if (term && term.length >= 4) {
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

    const ref = React.useRef(selectedTarget[0]);

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
                                    <Dropdown.Item as="button" onClick={() => selectType(option)} key={option.value}>
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
                                <InfoIcon value={translate('label.search-criteria-by', translate(displayType))}></InfoIcon>
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
                                            onSearch={ (query) => setSearchTerm(query) }
                                            renderMenuItemChildren={(option, { options, text }, index) => {
                                                return <span className={options.indexOf(text) === index ? 'font-weight-bold' : ''}>{option}</span>;
                                            }}>
                                            {({ isMenuShown, toggleMenu }) => (
                                                <ToggleButton isOpen={isMenuShown} onClick={e => toggleMenu()} disabled={disabled || readonly} />
                                            )}
                                        </AsyncTypeahead>
                                        <small>
                                            <Translate value="message.entity-id-min-unique">
                                            You must add at least one entity id target and they must each be unique.
                                            </Translate>
                                        </small>
                                    </>
                                }
                                { targetType === 'CONDITION_SCRIPT' &&
                                    <>
                                    <ContentEditable
                                        role="textbox"
                                        className="codearea form-control"
                                        rows="8"
                                        onChange={({ target: { value } }) => handleTextChange(value)}
                                        html={ selectedTarget[0] }
                                        innerRef={ref}
                                        dangerouslySetInnerHTML={true}>
                                    </ContentEditable>
                                    <small id="script-help" className="text-danger">
                                        <Translate value="message.required-for-scripts">Required for Scripts</Translate>
                                    </small>
                                </> }
                                {targetType === 'REGEX' &&
                                    <>
                                        <input id="targetInput"
                                            className="form-control"
                                            type="text"
                                            name="script"
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
                                    <button className="btn btn-success"
                                        disabled={!term}
                                        onClick={() => onSelectValue(term)}>
                                        <Translate value="action.add-entity-id">Add Entity ID</Translate>&nbsp;&nbsp;
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
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
                                { id }
                                <span>
                                    {/*getButtonConfig(id).map(button => (

                                        <sf-form-element-action
                                        [button] = "button"
                                        [formProperty] = "formProperty" >
                                        </sf-form-element-action>
                                    ))*/}
                                    <button className="btn btn-link text-right" onClick={() => removeId(id)}>
                                        <FontAwesomeIcon icon={faTrash} size="lg" className="text-danger" />
                                    </button>
                                </span>
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