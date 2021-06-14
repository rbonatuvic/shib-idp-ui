import React from "react";
import Translate from "../../../i18n/components/translate";

const TitleField = ({ title }) => (
    <span className="control-label"><Translate value={title} /></span>
);

export default TitleField;