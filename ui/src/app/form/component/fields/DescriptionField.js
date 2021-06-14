import React from "react";
import { InfoIcon } from "../InfoIcon";

const DescriptionField = ({ description }) => {
    if (description) {
        return <InfoIcon value={description} />;
    }

    return null;
};

export default DescriptionField;