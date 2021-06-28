import React from 'react';

import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from 'react-bootstrap/Form';

import Button from 'react-bootstrap/Button';

import AddButton from "../AddButton";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const ArrayFieldDescription = ({
    DescriptionField,
    idSchema,
    description,
}) => {
    if (!description) {
        return null;
    }

    const id = `${idSchema.$id}__description`;
    return <DescriptionField id={id} description={description} />;
};


const ArrayFieldTitle = ({
    TitleField,
    idSchema,
    title,
    required,
}) => {
    if (!title) {
        return null;
    }

    const id = `${idSchema.$id}__title`;
    return <TitleField id={id} title={title} required={required} />;
};

const defItem = {
    value: '',
    default: false
}

const StringListWithDefaultField = ({
    schema,
    label,
    id,
    name,
    disabled,
    value,
    readonly,
    rawErrors,
    onChange,
    errorSchema,
    formData,
    registry,
    ...props
}) => {

    const { fields } = registry;
    const [items, setItems] = React.useState([
        ...(formData ? formData : [])
    ]);

    React.useEffect(() => {
        onChange(items);
    }, [items, onChange]);

    const onAdd = () => {
        setItems([...items, { ...defItem }]);
    };

    const setValue = (item, value) => {
        item.value = value;
        setItems([...items]);
    };

    const setDefault = (item) => {
        const current = items.find(i => i.default);
        if (current) {
            current.default = false;
        }
        item.default = true;
        setItems([...items]);
    };

    const removeItem = (item) => {
        setItems([...items.filter(i => i !== item)]);
    };

    return (
        <div>
            <Row className="">
                <Col className="">
                    <div className="d-flex align-items-center justify-content-between mb-3">
                        <div className="d-flex align-items-center mb-3">
                            {<ArrayFieldTitle
                                key={`array-field-title-${props.idSchema.$id}`}
                                TitleField={fields.TitleField}
                                idSchema={props.idSchema}
                                title={props.uiSchema["ui:title"] || props.title}
                                required={props.required}
                            />}
                            <AddButton
                                className="array-item-add mx-2"
                                onClick={onAdd}
                                disabled={props.disabled || props.readonly}
                            />
                            {(props.uiSchema["ui:description"] || schema.description) && (
                                <ArrayFieldDescription
                                    key={`array-field-description-${props.idSchema.$id}`}
                                    DescriptionField={fields.DescriptionField}
                                    idSchema={props.idSchema}
                                    description={
                                        props.uiSchema["ui:description"] || schema.description
                                    }
                                />
                            )}
                        </div>
                        <div className="mr-3">
                            Default
                        </div>
                    </div>
                    <div>
                        {items && items.map((p, idx) =>
                            <div key={idx} className="my-2 d-flex justify-content-between align-items-center form-inline">
                                <Form.Control
                                    type="text"
                                    className="flex-grow-1"
                                    value={p.value}
                                    onChange={({ target: { value } }) => setValue(p, value)}></Form.Control>
                                <Form.Control className="mx-4" custom name="default" type="radio"
                                    checked={ p.default }
                                    onChange={ () => setDefault(p) }
                                ></Form.Control>
                                <Button variant="text" className="text-danger" onClick={() => removeItem(p)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            </div>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    );
};


export default StringListWithDefaultField;