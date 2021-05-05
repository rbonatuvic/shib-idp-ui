import React from "react";

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
    }) =>
        onChange(value === "" ? options.emptyValue : value);
    const _onBlur = ({
        target: { value },
    }) => onBlur(id, value);
    const _onFocus = ({
        target: { value },
    }) => onFocus(id, value);

    return (
        <>
            <Form.Label className={`${rawErrors.length > 0 ? "text-danger" : ""}`}>
                <span>
                    <Translate value={label || schema.title} />
                    {(label || schema.title) && required ? <span className="text-danger">*</span> : null}
                </span>
                {schema.description && <InfoIcon value={schema.description} />}
            </Form.Label>
            <InputGroup>
                <FormControl
                    id={id}
                    as="textarea"
                    placeholder={placeholder}
                    disabled={disabled}
                    readOnly={readonly}
                    value={value}
                    required={required}
                    autoFocus={autofocus}
                    rows={options.rows || 5}
                    onChange={_onChange}
                    onBlur={_onBlur}
                    onFocus={_onFocus}
                />
            </InputGroup>
        </>
    );
};

export default TextareaWidget;