import React from "react";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Translate from "../../../i18n/components/translate";

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
    hidden,
    formContext
}) => {

    const displayTitle = (uiSchema["ui:title"] || (title && schema.title));

    return (
        <>
            {!hidden &&
            <>
                {displayTitle && (
                    <>
                    <TitleField
                        id={`${idSchema.$id}-title`}
                        title={title}
                        required={required}
                    />
                    <hr />
                    </>
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
                            <React.Fragment key={rIdx}>
                            {properties.some(p => group.fields.indexOf(p.name) > -1) &&
                                <Col lg={group.size} key={rIdx}  className={`d-empty-none ${group.classNames}`}>
                                    {group.title && <legend><Translate value={group.title} /></legend>}
                                    {properties.filter(p => group.fields.indexOf(p.name) > -1).map((element, eIdx) => (
                                        <React.Fragment key={eIdx}>{element.content}</React.Fragment>
                                    ))}
                                </Col>
                            }
                            </React.Fragment>
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