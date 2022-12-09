import React from 'react';
import Alert from 'react-bootstrap/Alert';

export function NotificationItem ({ type, body, timeout, id, onRemove }) {

    React.useEffect(() => {
        if (timeout) {
            setTimeout(() => {
                onRemove(id)
            }, timeout);
        }
    }, [timeout, id, onRemove]);

    return (
        <Alert variant={type} onClose={() => onRemove(id)} className="notification-item">
            {body}
        </Alert>
    )
}