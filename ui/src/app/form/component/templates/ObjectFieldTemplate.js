import React from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const ObjectFieldTemplate = ({
    DescriptionField,
    description,
    TitleField,
    title,
    properties,
    required,
    uiSchema,
    idSchema,
    schema,
    hidden
}) => {
    return (
        <>
            {!hidden &&
            <>
                {(uiSchema["ui:title"] || (title && schema.title)) && (
                    <TitleField
                        id={`${idSchema.$id}-title`}
                        title={title}
                        required={required}
                    />
                )}
                {description && (
                    <DescriptionField
                        id={`${idSchema.$id}-description`}
                        description={description}
                    />
                )}
                <Container fluid className="p-0">
                    {properties.map((element, index) => (
                        <Row key={index}>
                            <Col xs={12}> {element.content}</Col>
                        </Row>
                    ))}
                </Container>
            </>
            }
        </>
    );
};

export default ObjectFieldTemplate;