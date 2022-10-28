import React from "react";
import { utils } from "@rjsf/core";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import { useAccordionButton } from "react-bootstrap/AccordionButton";
import AccordionContext from "react-bootstrap/AccordionContext";

import AddButton from "../AddButton";
import IconButton from "../IconButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretRight } from "@fortawesome/free-solid-svg-icons";
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

const CustomToggle = ({children, eventKey, type, callback}) => {
    const { activeEventKey } = React.useContext(AccordionContext);

    const decoratedOnClick = useAccordionButton(eventKey, () => callback && callback(eventKey));
    const isCurrentEventKey = activeEventKey === eventKey;

    return (
        <Button variant="icon" className="px-0" onClick={decoratedOnClick}>
            <FontAwesomeIcon icon={ isCurrentEventKey ? faCaretDown : faCaretRight } />&nbsp;
            {children}
        </Button>
    );
}


const ObjectArrayItem = ({type, ...props}) => {
    const btnStyle = {  
        flex: 1,
        paddingLeft: 6,
        paddingRight: 6,
        fontWeight: "bold",
    };

    return (
        <div key={props.key} className={`mt-2 mb-3 bg-light border rounded p-2 list-group`}>
            <Accordion>
            <div className={`list-group-item`}>
                <div className="mb-4 pb-2 d-flex justify-content-between align-items-center border-bottom">
                    <CustomToggle type={type}>
                        <Translate value={'label.new-of-type'} params={{type}} />
                    </CustomToggle>
                    {props.hasToolbar && (
                        <div className="d-flex flex-row align-items-start">
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
                                    ><span className="sr-only">Move Up</span></IconButton>
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
                                    ><span className="sr-only">Move Down</span></IconButton>
                                </div>
                            )}

                            {props.hasRemove && (
                                <div className="m-0 pb-1">
                                    <IconButton
                                        id={`array-field-deletebtn-${props.uniqueIdForTest}-${props.index}`}
                                        className="text-danger"
                                        variant='text'
                                        icon="remove"
                                        tabIndex={-1}
                                        style={btnStyle}
                                        disabled={props.disabled || props.readonly}
                                        onClick={props.onDropIndexClick(props.index)}
                                    ><span className="sr-only">Delete</span></IconButton>
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <Accordion.Collapse>
                    <div className="me-2 flex-grow-1">{props.children}</div>
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

    const uiSchemaOptions = props.uiSchema ? props.uiSchema['ui:options'] || {} : {};

    return (
        <div key={props.key} className={`mt-2 mb-3`}>
            <div className="mb-2  d-flex align-items-start">
                <div className={`me-2 flex-grow-1 ${uiSchemaOptions.classNames}`}>{props.children}</div>
                {props.hasToolbar && (
                    <div className="d-flex flex-row align-items-start">
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
                                ><span className="sr-only">Move Up</span></IconButton>
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
                                ><span className="sr-only">Move Down</span></IconButton>
                            </div>
                        )}

                        {props.hasRemove && (
                            <div className="m-0 px-1 pt-3">
                                <IconButton
                                    id={`array-field-deletebtn-${props.uniqueIdForTest}-${props.index}`}
                                    className="text-danger"
                                    variant='text'
                                    icon="remove"
                                    tabIndex={-1}
                                    style={btnStyle}
                                    disabled={props.disabled || props.readonly}
                                    onClick={props.onDropIndexClick(props.index)}
                                ><span className="sr-only">Delete</span></IconButton>
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
                        id={`array-field-addbtn-${props.idSchema.$id}`}
                        className="array-item-add"
                        onClick={props.onAddClick}
                        disabled={props.disabled || props.readonly}
                    ><span className="sr-only">Add</span></AddButton>
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

    const showTitle = props.uiSchema.hasOwnProperty("ui:title") ? props.uiSchema["ui:title"] === false && !props.canAdd ? false : true : true;

    return (
        <Row className="p-0 m-0 mb-3">
            <Col className="p-0 m-0">
                <div className="d-flex align-items-center">
                    {showTitle && <ArrayFieldTitle
                        key={`array-field-title-${props.idSchema.$id}`}
                        TitleField={props.TitleField}
                        idSchema={props.idSchema}
                        title={props.uiSchema["ui:title"] || props.title}
                        required={props.required}
                    />}
                    {props.canAdd && (
                        <AddButton
                            id={`array-field-addbtn-${props.idSchema.$id}`}
                            className="array-item-add mx-2"
                            onClick={props.onAddClick}
                            disabled={props.disabled || props.readonly}
                        ><span className="sr-only">Add</span></AddButton>
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
                            ObjectArrayItem({ type: props.uiSchema.type, ...p, uniqueIdForTest: props.idSchema.$id })
                            :
                            DefaultArrayItem({ ...p, uiSchema: props.uiSchema.items, uniqueIdForTest: props.idSchema.$id })
                    )}
                </Container>
            </Col>
        </Row>
    );
};

export default ArrayFieldTemplate;