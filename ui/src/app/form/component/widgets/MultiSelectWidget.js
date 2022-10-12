import React from "react";

import ListGroup from "react-bootstrap/ListGroup";
import Form from "react-bootstrap/Form";


import Translate from "../../../i18n/components/translate";
import { InfoIcon } from "../InfoIcon";

import { Typeahead } from 'react-bootstrap-typeahead';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAsterisk } from "@fortawesome/free-solid-svg-icons";

const MultiSelectWidget = ({
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
    formContext,
    ...props
}) => {
    // const inputType = (type || schema.type) === 'string' ? 'text' : `${type || schema.type}`;
    
    const opts = [];

    React.useEffect(() => console.log(formContext), [formContext]);
    React.useEffect(() => console.log(props), [props]);

    const [touched, setTouched] = React.useState(false);

    const [multiSelections, setMultiSelections] = React.useState([]);

    return (
       <Form.Group style={{ marginTop: '20px' }}>
        <Form.Label className={`${(touched && rawErrors?.length > 0) ? "text-danger" : ""}`} htmlFor={`option-selector-${id}`}>
            <span>
                <Translate value={label || schema.title} />
                {(label || schema.title) && required ? <FontAwesomeIcon icon={faAsterisk} className="text-danger ms-2" size="sm" /> : <span className="sr-only">Item {id + 1}</span>}
            </span>
            {schema.description && <InfoIcon value={schema.description} />}
        </Form.Label>
        <Typeahead
          id={`option-selector-items-${id}`}
          labelKey="name"
          multiple
          onChange={setMultiSelections}
          options={opts}
          placeholder="Choose approval groups..."
          selected={multiSelections}
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

export default MultiSelectWidget;