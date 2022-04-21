import React from "react";

import { faAsterisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";

import Translate from "../../../i18n/components/translate";
import { useTranslator } from "../../../i18n/hooks";
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
    schema,
    uiSchema,
    rawErrors = []
}) => {
    const _onChange = ({
        target: { value },
    }) => onChange(value);
    const _onBlur = ({ target: { value } }) =>
        onBlur(id, value);
    const _onFocus = ({
        target: { value },
    }) => onFocus(id, value);

    const translator = useTranslator();

    const [touched, setTouched] = React.useState(false);

    const onCustomBlur = (evt) => {
        setTouched(true);
        _onBlur(evt);
    };

    return (
        <Form.Group className="mb-0">
            <Form.Label>
                <span>
                    <Translate value={label || schema.title} />
                    {(label || schema.title) && required ? <FontAwesomeIcon icon={faAsterisk} className="ms-2 text-danger" size="sm" /> : null}
                </span>
                {schema.description && <InfoIcon value={schema.description} className="ms-2" />}
            </Form.Label>
            <Form.Control
                id={id}
                autoFocus={autofocus}
                required={required}
                type="number"
                disabled={disabled}
                readOnly={readonly}
                placeholder={uiSchema['ui:placeholder'] ? translator(uiSchema['ui:placeholder']) : ''}
                value={value || value === 0 ? value : ""}
                step={schema.multipleOf}
                onChange={_onChange}
                onBlur={onCustomBlur}
                onFocus={_onFocus}
            />
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

export default UpDownWidget;