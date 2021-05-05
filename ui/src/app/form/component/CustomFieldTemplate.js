import React from "react";

import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";

import {Translate} from '../../i18n/components/translate';

export function CustomFieldTemplate ({
    id,
    children,
    displayLabel,
    rawErrors = [],
    rawHelp,
    rawDescription,
    ...props
}) {

    console.log(props);
    return (
        <>{!props.hidden ? <Form.Group>
            {children}
            {displayLabel && rawDescription ? (
                <Form.Text className={rawErrors.length > 0 ? "text-danger" : "text-muted"}>
                    <Translate value={rawDescription} />
                </Form.Text>
            ) : null}
            {rawErrors.length > 0 && (
                <ListGroup as="ul">
                    {rawErrors.map((error) => {
                        return (
                            <ListGroup.Item as="li" key={error} className="border-0 m-0 p-0">
                                <small className="m-0 text-danger">
                                    {error}
                                </small>
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
            )}
            {rawHelp && (
                <Form.Text
                    className={rawErrors.length > 0 ? "text-danger" : "text-muted"}
                    id={id}>
                    <Translate value={rawHelp} />
                </Form.Text>
            )}
        </Form.Group>
        : <></>}</>
    );
};

export default CustomFieldTemplate;