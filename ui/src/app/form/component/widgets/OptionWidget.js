import React, { useRef } from "react";

import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";


import Translate from "../../../i18n/components/translate";
import { InfoIcon } from "../InfoIcon";

import { Typeahead } from 'react-bootstrap-typeahead';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { useTranslator } from "../../../i18n/hooks";
import { ToggleButton } from '../ToggleButton';


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

    const typeahead = useRef();

    const _onChange = (selected) => {
        const sel = selected[0];
        
        const val = typeof sel === 'object' && sel.label ? sel.label : sel;
        setInputValue(val);
        onChange(val);
    };
    const _onBlur = ({ target: { value } }) => onBlur(id, value);
    const _onFocus = ({ target: { value } }) => onFocus(id, value);
    // const inputType = (type || schema.type) === 'string' ? 'text' : `${type || schema.type}`;
    
    const opts = Array.isArray(options) || options.enumOptions ? options : schema.examples ? schema.examples : uiSchema.options ? uiSchema.options : [];

    const translator = useTranslator();

    const [touched, setTouched] = React.useState(false);

    const onCustomBlur = (evt) => {
        setTouched(true);
        _onBlur(evt);
        _onChange([inputValue]);
    };

    const onKeydown = (evt) => {
        if (evt.keyCode === 13) {
            if (typeahead.current.state.showMenu && !typeahead.current.state.activeItem) {
                typeahead.current.toggleMenu();
            }
            _onChange([inputValue]);
        }
    };

    const defaultInputValue = typeof value === 'object' && value && value.label ? value.label : value ? value : '';

    const [ inputValue, setInputValue ] = React.useState( defaultInputValue );

    const onInputChange = (val) => {
        setInputValue(val);
    };

    return (
        <Form.Group className="mb-3">
            <Form.Label className={`${(touched && rawErrors?.length > 0) ? "text-danger" : ""}`} htmlFor={`option-selector-${id}`}>
                <span>
                    <Translate value={label || schema.title} />
                    {(label || schema.title) && required ? <FontAwesomeIcon icon={faAsterisk} className="text-danger ms-2" size="sm" /> : <span className="sr-only">Item {id + 1}</span>}
                </span>
                {schema.description && <InfoIcon value={schema.description} />}
            </Form.Label>
            <Typeahead
                id={`option-selector-items-${id}`}
                inputProps={{ id: `option-selector-${id}` }}
                ref={typeahead}
                defaultInputValue={ inputValue }
                onChange={ _onChange }
                allowNew={true}
                multiple={false}
                className={`toggle-typeahead ${rawErrors?.length > 0 ? "is-invalid" : ""}`}
                options={opts}
                placeholder={uiSchema['ui:placeholder'] ? translator(uiSchema['ui:placeholder'] ): ''}
                disabled={disabled || readonly}
                onBlur={onCustomBlur}
                onFocus={_onFocus}
                onInputChange={ onInputChange }
                onKeyDown={ onKeydown }
                filterBy={(option, props) => true}
                renderMenuItemChildren={(option, {options, text}, index) => {
                    return <span className={options.indexOf(text) === index ? 'font-weight-bold' : ''}>{option}</span>;
                }}
                newSelectionPrefix={''}
                >
                {({ isMenuShown, toggleMenu }) => (
                    <ToggleButton isOpen={isMenuShown} onClick={e => toggleMenu()} disabled={disabled || readonly}>
                        <span className="sr-only">Options</span>
                    </ToggleButton>
                )}
            </Typeahead>
            {rawErrors?.length > 0 && touched && (
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