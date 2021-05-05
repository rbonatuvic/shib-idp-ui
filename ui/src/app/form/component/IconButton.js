import React from "react";
import Button from "react-bootstrap/Button";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp, faTrash, faPlus } from "@fortawesome/free-solid-svg-icons";

const mappings = {
    remove: <FontAwesomeIcon icon={faTrash} />,
    plus: <FontAwesomeIcon icon={faPlus} />,
    "arrow-up": <FontAwesomeIcon icon={faArrowUp} />,
    "arrow-down": <FontAwesomeIcon icon={faArrowDown} />,
};

const IconButton = (props) => {
    const { icon, className, ...otherProps } = props;
    return (
        <Button {...otherProps} variant="light" size="sm">
            {mappings[icon]}
        </Button>
    );
};

export default IconButton;