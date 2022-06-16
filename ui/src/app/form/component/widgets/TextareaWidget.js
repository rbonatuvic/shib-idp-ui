import React from "react";
import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";
import FormControl from "react-bootstrap/FormControl";
import InputGroup from "react-bootstrap/InputGroup";

import Translate from "../../../i18n/components/translate";
import { InfoIcon } from "../InfoIcon";

const TextareaWidget = ({
    id,
    placeholder,
    value,
    required,
    disabled,
    autofocus,
    label,
    readonly,
    onBlur,
    onFocus,
    onChange,
    options,
    schema,
    rawErrors = [],
}) => {
    const _onChange = ({
        target: { value },
    }) => setFieldValue(value === "" ? options.emptyValue : value);

    const _onBlur = ({
        target: { value },
    }) => onBlur(id, value);
    const _onFocus = ({
        target: { value },
    }) => onFocus(id, value);

    const [touched, setTouched] = React.useState(false);
    const [fieldValue, setFieldValue] = React.useState(value || value === 0 ? value : "");

    React.useEffect(() => {
        onChange(fieldValue);
    }, [fieldValue, onChange]);

    const onCustomBlur = (evt) => {
        setTouched(true);
        _onBlur(evt);
    };

    return (
        <React.Fragment>
            <Form.Label className={`${touched && rawErrors?.length > 0 ? "text-danger" : ""}`}>
                <span>
                    <Translate value={label || schema.title} />
                    {(label || schema.title) && required ? <FontAwesomeIcon icon={faAsterisk} className="ms-2 text-danger" size="sm" /> : null}
                </span>
                {schema.description && <InfoIcon value={schema.description} className="ms-2"/>}
            </Form.Label>
            <InputGroup>
                <FormControl
                    id={id}
                    as="textarea"
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readonly}
                    value={fieldValue}
                    required={required}
                    autoFocus={autofocus}
                    rows={options.rows || 5}
                    onChange={_onChange}
                    onBlur={onCustomBlur}
                    onFocus={_onFocus}
                />
            </InputGroup>
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
        </React.Fragment>
    );
};

export default TextareaWidget;