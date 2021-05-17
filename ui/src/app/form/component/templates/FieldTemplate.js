import React from "react";

import Form from "react-bootstrap/Form";

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