import React from "react";

import Form from "react-bootstrap/Form";
import Translate from "../../../i18n/components/translate";
import { InfoIcon } from "../InfoIcon";

const CheckboxWidget = (props) => {
    const {
        id,
        value,
        required,
        disabled,
        readonly,
        label,
        schema,
        autofocus,
        onChange,
        onBlur,
        onFocus,
    } = props;

    const _onChange = ({
        target: { checked },
    }) => onChange(checked);
    const _onBlur = ({
        target: { checked },
    }) => onBlur(id, checked);
    const _onFocus = ({
        target: { checked },
    }) => onFocus(id, checked);

    // const desc = label || schema.description;
    return (
        <Form.Group className={`checkbox ${disabled || readonly ? "disabled" : ""}`}>
            <Form.Check
                id={id}
                label={<span className="d-flex justify-content-start">
                    <span>
                        <Translate value={label || schema.title} />
                        {(label || schema.title) && required ? <span className="text-danger">*</span> : null}
                    </span>
                    {schema.description && <InfoIcon value={schema.description} className="ml-2" />}
                </span>}
                checked={typeof value === "undefined" ? false : value}
                required={required}
                disabled={disabled || readonly}
                autoFocus={autofocus}
                onChange={_onChange}
                type="checkbox"
                onBlur={_onBlur}
                onFocus={_onFocus}
            />
        </Form.Group>
    );
};

export default CheckboxWidget;