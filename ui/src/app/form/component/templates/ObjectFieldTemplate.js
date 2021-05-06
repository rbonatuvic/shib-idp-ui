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

    const displayTitle = (uiSchema["ui:title"] || (title && schema.title));

    return (
        <>
            {!hidden &&
            <>
                {displayTitle && (
                    <TitleField
                        id={`${idSchema.$id}-title`}
                        title={title}
                        required={required}
                    />
                )}
                {displayTitle && description && (
                    <DescriptionField
                        id={`${idSchema.$id}-description`}
                        description={description}
                    />
                )}
                <Container fluid className="p-0">
                    <>
                    {uiSchema.layout ?
                        <Row>{uiSchema.layout.groups.map((group, rIdx) => (
                            
                            <Col xs={group.size} key={rIdx}>{properties.filter(p => group.fields.indexOf(p.name) > -1).map((element, eIdx) => (
                                <React.Fragment key={eIdx}>{element.content}</React.Fragment>
                            ))}</Col>
                            
                        ))}</Row>
                    :
                        properties.map((element, index) => (
                            <Row key={index}>
                                <Col xs={12}> {element.content}</Col>
                            </Row>
                        ))
                    }
                    </>
                </Container>
            </>
            }
        </>
    );
};

export default ObjectFieldTemplate;