import React from 'react';

import truncate from 'lodash/truncate';

import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
import Button from 'react-bootstrap/Button';

export function TruncateText ({text}) {

    const truncated = React.useMemo(() => truncate(text, {
        length: 100
    }), [text]);

    return (
        <OverlayTrigger
            placement="top"
            overlay={
                <Popover id="attribute-bundle-descr-popover">
                    <Popover.Content>
                        {text}
                    </Popover.Content>
                </Popover>
            }
        >
            <Button variant="text">{truncated}</Button>
        </OverlayTrigger>
    );
}

export default TruncateText;