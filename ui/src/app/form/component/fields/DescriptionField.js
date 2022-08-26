import React from "react";
import { InfoIcon } from "../InfoIcon";

const DescriptionField = ({ description }) => {
    if (description) {
        return <InfoIcon value={description} placement="auto" />;
    }

    return null;
};

export default DescriptionField;