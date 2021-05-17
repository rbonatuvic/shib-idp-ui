import React from "react";

import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";

import { utils } from "@rjsf/core";

import Translate from "../../../i18n/components/translate";
import { InfoIcon } from "../InfoIcon";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { useTranslator } from "../../../i18n/hooks";

const { asNumber, guessType } = utils;

const nums = new Set(["number", "integer"]);

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
const processValue = (schema, value) => {
    // "enum" is a reserved word, so only "type" and "items" can be destructured
    const { type, items } = schema;
    if (value === "") {
        return undefined;
    } else if (type === "array" && items && nums.has(items.type)) {
        return value.map(asNumber);
    } else if (type === "boolean") {
        return value === "true";
    } else if (type === "number") {
        return asNumber(value);
    }

    // If type is undefined, but an enum is present, try and infer the type from
    // the enum values
    if (schema.enum) {
        if (schema.enum.every((x) => guessType(x) === "number")) {
            return asNumber(value);
        } else if (schema.enum.every((x) => guessType(x) === "boolean")) {
            return value === "true";
        }
    }

    return value;
};

const SelectWidget = ({
    schema,
    id,
    options,
    label,
    required,
    disabled,
    readonly,
    value,
    multiple,
    autofocus,
    onChange,
    onBlur,
    onFocus,
    placeholder,
    rawErrors = [],
}) => {
    const { enumOptions, enumDisabled } = options;

    const emptyValue = multiple ? [] : "";

    const translator = useTranslator();

    function getValue(
        event,
        multiple
    ) {
        if (multiple) {
            return [].slice
                .call(event.target.options)
                .filter((o) => o.selected)
                .map((o) => o.value);
        } else {
            return event.target.value;
        }
    }

    const [touched, setTouched] = React.useState(false);

    return (
        <Form.Group>
            <Form.Label className={`${rawErrors.length > 0 ? "text-danger" : ""}`}>
                <span>
                    <Translate value={label || schema.title} />
                    {(label || schema.title) && required ? <FontAwesomeIcon icon={faAsterisk} className="ml-2 text-danger" size="sm" /> : null}
                </span>
                {schema.description && <InfoIcon value={schema.description} className="ml-2" />}
            </Form.Label>
            <Form.Control
                as="select"
                custom
                id={id}
                value={typeof value === "undefined" ? emptyValue : value}
                required={required}
                multiple={multiple}
                disabled={disabled}
                readOnly={readonly}
                autoFocus={autofocus}
                className={rawErrors.length > 0 ? "is-invalid" : ""}
                onBlur={
                    onBlur &&
                    ((event) => {
                        const newValue = getValue(event, multiple);
                        onBlur(id, processValue(schema, newValue));
                        setTouched(true);
                    })
                }
                onFocus={
                    onFocus &&
                    ((event) => {
                        const newValue = getValue(event, multiple);
                        onFocus(id, processValue(schema, newValue));
                    })
                }
                onChange={(event) => {
                    const newValue = getValue(event, multiple);
                    onChange(processValue(schema, newValue));
                }}>
                {!multiple && schema.default === undefined && (
                    <option value="">{translator(placeholder)}</option>
                )}
                {(enumOptions).map(({ value, label }, i) =>
                <option key={i} id={label} value={value} disabled={Array.isArray(enumDisabled) && (enumDisabled).indexOf(value) !== -1}>
                    {translator(label)}
                </option>
                )}
            </Form.Control>
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

export default SelectWidget;