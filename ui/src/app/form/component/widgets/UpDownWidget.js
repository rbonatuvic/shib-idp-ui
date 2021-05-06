import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

import Form from "react-bootstrap/Form";

import Translate from "../../../i18n/components/translate";
import { InfoIcon } from "../InfoIcon";

const UpDownWidget = ({
    id,
    required,
    readonly,
    disabled,
    label,
    value,
    onChange,
    onBlur,
    onFocus,
    autofocus,
    schema
}) => {
    const _onChange = ({
        target: { value },
    }) => onChange(value);
    const _onBlur = ({ target: { value } }) =>
        onBlur(id, value);
    const _onFocus = ({
        target: { value },
    }) => onFocus(id, value);

    return (
        <Form.Group className="mb-0">
            <Form.Label>
                <span>
                    <Translate value={label || schema.title} />
                    {(label || schema.title) && required ? <FontAwesomeIcon icon={faAsterisk} className="ml-2 text-danger" size="sm" /> : null}
                </span>
                {schema.description && <InfoIcon value={schema.description} className="ml-2" />}
            </Form.Label>
            <Form.Control
                id={id}
                autoFocus={autofocus}
                required={required}
                type="number"
                disabled={disabled}
                readOnly={readonly}
                value={value || value === 0 ? value : ""}
                onChange={_onChange}
                onBlur={_onBlur}
                onFocus={_onFocus}
            />
        </Form.Group>
    );
};

export default UpDownWidget;