import React from "react";

import Form from "react-bootstrap/Form";
import ListGroup from "react-bootstrap/ListGroup";

import {Translate} from '../../../i18n/components/translate';

export function FieldTemplate ({
    id,
    label,
    children,
    displayLabel,
    rawErrors = [],
    errors = [],
    rawHelp,
    help,
    rawDescription,
    ...props
}) {

    return (
        <>{!props.hidden ?
            <Form.Group>
                <div>
                    {children}
                </div>
                <div>
                    {rawErrors.length > 0 && (
                        <ListGroup as="ul">
                            {rawErrors.map((error, i) => {
                                return (
                                    <ListGroup.Item as="li" key={i} className={`border-0 m-0 p-0 bg-transparent ${i > 0 ? 'sr-only' : ''}`}>
                                        <small className="m-0 text-danger">
                                            {error}
                                        </small>
                                    </ListGroup.Item>
                                );
                            })}
                        </ListGroup>
                    )}
                    {rawHelp && rawErrors.length < 1 && (
                        <Form.Text className={rawErrors.length > 0 ? "text-danger" : "text-muted"} id={id}>
                            <Translate value={rawHelp} />
                        </Form.Text>
                    )}
                </div>
            </Form.Group>
            : <></>
        }</>
    );
};

export default FieldTemplate;