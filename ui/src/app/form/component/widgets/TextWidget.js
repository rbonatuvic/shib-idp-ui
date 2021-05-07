import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

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
    console.log(props)

    // const classNames = [rawErrors.length > 0 ? "is-invalid" : "", type === 'file' ? 'custom-file-label': ""]
    return (
        <Form.Group className="mb-0">
            <Form.Label className={`${rawErrors.length > 0 ? "text-danger" : ""}`}>
                <span>
                    <Translate value={label || schema.title} />
                    {(label || schema.title) && required ?
                        <FontAwesomeIcon icon={faAsterisk} className="ml-2 text-danger" size="sm" /> : null}
                </span>
                {schema.description && <InfoIcon value={schema.description} className="ml-2" />}
            </Form.Label>
            <Form.Control
                id={id}
                placeholder={placeholder}
                autoFocus={autofocus}
                required={required}
                disabled={disabled}
                readOnly={readonly}
                className={rawErrors.length > 0 ? "is-invalid" : ""}
                list={schema.examples ? `examples_${id}` : undefined}
                type={inputType}
                value={value || value === 0 ? value : ""}
                onChange={_onChange}
                onBlur={_onBlur}
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
        </Form.Group>
    );
};

export default TextWidget;