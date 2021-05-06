import React from "react";
import { utils } from "@rjsf/core";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';

import AddButton from "../AddButton";
import IconButton from "../IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";
import Translate from "../../../i18n/components/translate";

const { isMultiSelect, getDefaultRegistry } = utils;

const ArrayFieldTemplate = (props) => {
    const { schema, registry = getDefaultRegistry() } = props;

    // TODO: update types so we don't have to cast registry as any
    if (isMultiSelect(schema, (registry).rootSchema)) {
        
        return <DefaultFixedArrayFieldTemplate {...props} />;
    } else {
        return <DefaultNormalArrayFieldTemplate {...props} />;
    }
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

// Used in the two templates

const ObjectArrayItem = ({type, ...props}) => {
    const btnStyle = {
        flex: 1,
        paddingLeft: 6,
        paddingRight: 6,
        fontWeight: "bold",
    };
    return (
        <div key={props.key} className={`mt-2 bg-light border rounded p-2 list-group`}>
            <Accordion defaultActiveKey="0">
            <div className={`list-group-item`}>
                <div className="mb-4 pb-2 d-flex justify-content-between align-items-center border-bottom">
                    <Accordion.Toggle as={Button} variant="link" eventKey="0" className="px-0">
                        <FontAwesomeIcon icon={faCaretDown} />&nbsp;
                        <Translate value={'label.new-of-type'} params={{type}} />
                    </Accordion.Toggle>
                    {props.hasToolbar && (
                        <div className="d-flex flex-row align-items-center">
                            {(props.hasMoveUp || props.hasMoveDown) && (
                                <div className="m-0 p-0">
                                    <IconButton
                                        icon="arrow-up"
                                        className="array-item-move-up"
                                        tabIndex={-1}
                                        style={btnStyle}
                                        disabled={
                                            props.disabled || props.readonly || !props.hasMoveUp
                                        }
                                        onClick={props.onReorderClick(props.index, props.index - 1)}
                                    />
                                </div>
                            )}

                            {(props.hasMoveUp || props.hasMoveDown) && (
                                <div className="m-0 p-0">
                                    <IconButton
                                        icon="arrow-down"
                                        tabIndex={-1}
                                        style={btnStyle}
                                        disabled={
                                            props.disabled || props.readonly || !props.hasMoveDown
                                        }
                                        onClick={props.onReorderClick(props.index, props.index + 1)}
                                    />
                                </div>
                            )}

                            {props.hasRemove && (
                                <div className="m-0 pb-1">
                                    <IconButton
                                        className="text-danger"
                                        variant='text'
                                        icon="remove"
                                        tabIndex={-1}
                                        style={btnStyle}
                                        disabled={props.disabled || props.readonly}
                                        onClick={props.onDropIndexClick(props.index)}
                                    />
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <Accordion.Collapse eventKey="0">
                    <div className="mr-2 flex-grow-1">{props.children}</div>
                </Accordion.Collapse>
            </div>
            </Accordion>
        </div>
    );
}

const DefaultArrayItem = (props) => {
    const btnStyle = {
        flex: 1,
        paddingLeft: 6,
        paddingRight: 6,
        fontWeight: "bold",
    };
    return (
        <div key={props.key} className={`mt-2`}>
            <div className="mb-2  d-flex align-items-center">
                <div className="mr-2 flex-grow-1">{props.children}</div>
                {props.hasToolbar && (
                    <div className="d-flex flex-row align-items-center">
                        {(props.hasMoveUp || props.hasMoveDown) && (
                            <div className="m-0 p-0">
                                <IconButton
                                    icon="arrow-up"
                                    className="array-item-move-up"
                                    tabIndex={-1}
                                    style={btnStyle}
                                    disabled={
                                        props.disabled || props.readonly || !props.hasMoveUp
                                    }
                                    onClick={props.onReorderClick(props.index, props.index - 1)}
                                />
                            </div>
                        )}

                        {(props.hasMoveUp || props.hasMoveDown) && (
                            <div className="m-0 p-0">
                                <IconButton
                                    icon="arrow-down"
                                    tabIndex={-1}
                                    style={btnStyle}
                                    disabled={
                                        props.disabled || props.readonly || !props.hasMoveDown
                                    }
                                    onClick={props.onReorderClick(props.index, props.index + 1)}
                                />
                            </div>
                        )}

                        {props.hasRemove && (
                            <div className="m-0 pb-1">
                                <IconButton
                                    className="text-danger"
                                    variant='text'
                                    icon="remove"
                                    tabIndex={-1}
                                    style={btnStyle}
                                    disabled={props.disabled || props.readonly}
                                    onClick={props.onDropIndexClick(props.index)}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

const DefaultFixedArrayFieldTemplate = (props) => {
    return (
        <fieldset className={props.className}>
            <div className="d-flex align-items-center">
                <ArrayFieldTitle
                    key={`array-field-title-${props.idSchema.$id}`}
                    TitleField={props.TitleField}
                    idSchema={props.idSchema}
                    title={props.uiSchema["ui:title"] || props.title}
                    required={props.required}
                />
                {props.canAdd && (
                    <AddButton
                        className="array-item-add"
                        onClick={props.onAddClick}
                        disabled={props.disabled || props.readonly}
                    />
                )}
            </div>
            

            {props.uiSchema["ui:description"] !== false && (props.uiSchema["ui:description"] || props.schema.description) && (
                <div
                    className="field-description"
                    key={`field-description-${props.idSchema.$id}`}>
                    {props.uiSchema["ui:description"] || props.schema.description}
                </div>
            )}

            <div
                className="row array-item-list"
                key={`array-item-list-${props.idSchema.$id}`}>
                {props.items && props.items.map(DefaultArrayItem)}
            </div>

            
        </fieldset>
    );
};

const DefaultNormalArrayFieldTemplate = (props) => {
    return (
        <div>
            <Row className="p-0 m-0">
                <Col className="p-0 m-0">
                    <div className="d-flex align-items-center">
                        <ArrayFieldTitle
                            key={`array-field-title-${props.idSchema.$id}`}
                            TitleField={props.TitleField}
                            idSchema={props.idSchema}
                            title={props.uiSchema["ui:title"] || props.title}
                            required={props.required}
                        />
                        {props.canAdd && (
                            <AddButton
                                className="array-item-add mx-2"
                                onClick={props.onAddClick}
                                disabled={props.disabled || props.readonly}
                            />
                        )}
                        {(props.uiSchema["ui:description"] || props.schema.description) && (
                            <ArrayFieldDescription
                                key={`array-field-description-${props.idSchema.$id}`}
                                DescriptionField={props.DescriptionField}
                                idSchema={props.idSchema}
                                description={
                                    props.uiSchema["ui:description"] || props.schema.description
                                }
                            />
                        )}
                    </div>
                    <Container fluid key={`array-item-list-${props.idSchema.$id}`} className="p-0 m-0">
                        {props.items && props.items.map(p => 
                            props.schema.items.type === 'object' || props.schema.items.$ref ?
                                ObjectArrayItem({type: props.uiSchema.type, ...p})
                                :
                                DefaultArrayItem({...p })
                        )}
                    </Container>
                </Col>
            </Row>
        </div>
    );
};

export default ArrayFieldTemplate;