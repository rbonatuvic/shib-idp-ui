import React from "react";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Button from "react-bootstrap/Button";
import Translate from "../../i18n/components/translate";

const AddButton = ({className, ...props}) => (
    <>
    <Button {...props} variant="success" className={`array-add-button ${ className }`} size="sm">
        <Translate value="action.add" />&nbsp; 
        <FontAwesomeIcon icon={faPlus} />
    </Button>
    </>
);
export default AddButton;