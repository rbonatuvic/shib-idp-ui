import React from "react";
import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";

import Translate from "../../../i18n/components/translate";
import { InfoIcon } from "../InfoIcon";

const TextWidget = ({
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
    ...props
}) => {
    const _onChange = ({target: { value }}) => onChange(value === "" ? options.emptyValue : value);
    const _onBlur = ({ target: { value } }) => onBlur(id, value);
    const _onFocus = ({target: { value }} ) => onFocus(id, value);
    const inputType = (type || schema.type) === 'string' ? 'text' : `${type || schema.type}`;

    const [touched, setTouched] = React.useState(false);

    const onCustomBlur = (evt) => {
        setTouched(true);
        _onBlur(evt);
    };

    // const classNames = [rawErrors?.length > 0 ? "is-invalid" : "", type === 'file' ? 'custom-file-label': ""]
    return (
        <Form.Group>
            <Form.Label className={`${rawErrors?.length > 0 && touched ? "text-danger" : ""}`} htmlFor={id}>
                <span>
                    <Translate value={label || schema.title} />
                    {(label || schema.title) && required ?
                        <FontAwesomeIcon icon={faAsterisk} className="ms-2 text-danger" size="sm" /> : null}
                </span>
                {schema.description && <InfoIcon value={schema.description || ''} className="ms-2" />}
            </Form.Label>
            <Form.Control
                id={id}
                name=""
                placeholder={placeholder}
                autoFocus={autofocus}
                required={required}
                disabled={disabled}
                readOnly={readonly}
                className={rawErrors?.length > 0 && touched ? "is-invalid" : ""}
                list={schema.examples ? `examples_${id}` : undefined}
                type={inputType}
                value={value || value === 0 ? value : ""}
                onChange={_onChange}
                onBlur={onCustomBlur}
                onFocus={_onFocus}
            />
            {schema.examples ? (
                <datalist id={`examples_${id}`}>
                    {(schema.examples)
                        .concat(schema.default ? ([schema.default]) : [])
                        .map((example) => {
                            return <option key={example} value={example} />;
                        })}
                </datalist>
            ) : null}
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

export default TextWidget;