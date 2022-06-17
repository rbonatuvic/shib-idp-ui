import React from "react";

import Form from "react-bootstrap/Form";
import Translate from "../../../i18n/components/translate";
import { InfoIcon } from "../InfoIcon";


const RadioWidget = ({
    id,
    schema,
    options,
    value,
    required,
    disabled,
    readonly,
    label,
    onChange,
    onBlur,
    onFocus,
    ...props
}) => {
    const { enumOptions, enumDisabled } = options;

    const _onChange = ({
        target: { value },
    }) =>
        onChange(schema.type === "boolean" ? value !== "false" : value);
    const _onBlur = ({ target: { value } }) =>
        onBlur(id, value);
    const _onFocus = ({
        target: { value },
    }) => onFocus(id, value);

    const inline = Boolean(options && options.inline);

    return (
        <Form.Group className="mb-3">
            <Form.Label className="d-block">
                <span>
                    <Translate value={label || schema.title} />
                    {(label || schema.title) && required ? <span className="text-danger">*</span> : null}
                </span>
                {schema.description && <InfoIcon value={schema.description} className="ms-2" />}
            </Form.Label>
            {(enumOptions).map((option, i) => {
                const itemDisabled =
                    Array.isArray(enumDisabled) &&
                    enumDisabled.indexOf(option.value) !== -1;
                const checked = option?.value?.toString() === value?.toString();

                const radio = (
                    <Form.Check
                        inline={inline}
                        label={<Translate value={option.label} />}
                        id={`${id}-${option.label}`}
                        key={i}
                        name={id}
                        type="radio"
                        disabled={disabled || itemDisabled || readonly}
                        checked={checked}
                        required={required}
                        value={option.value}
                        onChange={_onChange}
                        onBlur={_onBlur}
                        onFocus={_onFocus}
                    />
                );
                return radio;
            })}
        </Form.Group>
    );
};

export default RadioWidget;