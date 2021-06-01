import React from "react";

import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";

import Translate from "../../../i18n/components/translate";
import { InfoIcon } from "../InfoIcon";

import { Typeahead } from 'react-bootstrap-typeahead';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAsterisk, faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { useTranslator } from "../../../i18n/hooks";

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

const OptionWidget = ({
    id,
    placeholder,
    required,
    readonly,
    disabled,
    type,
    label,
    value,
    onChange,
    onBlur,
    onFocus,
    autofocus,
    options,
    schema,
    rawErrors = [],
    uiSchema,
    ...props
}) => {

    const _onChange = (selected) => onChange(selected[0] === '' ? options.emptyValue : selected[0]);
    const _onBlur = ({ target: { value } }) => onBlur(id, value);
    const _onFocus = ({ target: { value } }) => onFocus(id, value);
    // const inputType = (type || schema.type) === 'string' ? 'text' : `${type || schema.type}`;
    
    const opts = Array.isArray(options) || options.enumOptions ? options : schema.examples ? schema.examples : uiSchema.options ? uiSchema.options : [];

    const translator = useTranslator();

    const [touched, setTouched] = React.useState(false);

    const onCustomBlur = (evt) => {
        setTouched(true);
        _onBlur(evt);
    };

    return (
        <Form.Group className="mb-0">
            <Form.Label className={`${(touched && rawErrors.length > 0) ? "text-danger" : ""}`}>
                <span>
                    <Translate value={label || schema.title} />
                    {(label || schema.title) && required ? <FontAwesomeIcon icon={faAsterisk} className="text-danger ml-2" size="sm" /> : null}
                </span>
                {schema.description && <InfoIcon value={schema.description} />}
            </Form.Label>
            <Typeahead
                id={`option-selector-${id}`}
                defaultInputValue={value || value === 0 ? value : ""}
                allowNew={true}
                multiple={false}
                className={`toggle-typeahead ${rawErrors.length > 0 ? "is-invalid" : ""}`}
                options={opts}
                placeholder={uiSchema['ui:placeholder'] ? translator(uiSchema['ui:placeholder'] ): ''}
                disabled={disabled || readonly}
                onChange={_onChange}
                onBlur={onCustomBlur}
                onFocus={_onFocus}
                filterBy={(option, props) => true}
                renderMenuItemChildren={(option, {options, text}, index) => {
                    return <span className={options.indexOf(text) === index ? 'font-weight-bold' : ''}>{option}</span>;
                }}>
                {({ isMenuShown, toggleMenu }) => (
                    <ToggleButton isOpen={isMenuShown} onClick={e => toggleMenu()} disabled={disabled || readonly} />
                )}
            </Typeahead>
            {rawErrors.length > 0 && touched && (
                <ListGroup as="ul">
                    {rawErrors.map((error, i) => {
                        return (
                            <ListGroup.Item as="li" key={i} className={`border-0 m-0 p-0 bg-transparent ${i > 0 ? 'sr-only' : ''}`}>
                                <small className="m-0 text-danger">
                                    <Translate value={error}>{error}</Translate>
                                </small>
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
            )}
        </Form.Group>
    );
};

export default OptionWidget;