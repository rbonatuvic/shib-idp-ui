import React from "react";
import Form from "react-bootstrap/Form";
import Translate from "../../../i18n/components/translate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import Button from 'react-bootstrap/Button';
import { useTranslator } from "../../../i18n/hooks";

const selectValue = (value, selected, all) => {
    const at = all.indexOf(value);
    const updated = selected.slice(0, at).concat(value, selected.slice(at));

    // As inserting values at predefined index positions doesn't work with empty
    // arrays, we need to reorder the updated selection to match the initial order
    return updated.sort((a, b) => all.indexOf(a) > all.indexOf(b));
};

const deselectValue = (value, selected) => {
    return selected.filter((v) => v !== value);
};

const AttributeReleaseWidget = ({
    schema,
    label,
    id,
    disabled,
    options,
    value,
    autofocus,
    readonly,
    required,
    onChange,
    onBlur,
    onFocus,
}) => {
    const { enumOptions, enumDisabled } = options;

    const _onChange = (option) => ({
        target: { checked },
    }) => {
        const all = (enumOptions).map(({ value }) => value);

        if (checked) {
            onChange(selectValue(option.value, value, all));
        } else {
            onChange(deselectValue(option.value, value));
        }
    };

    const _onBlur = ({ target: { value } }) =>
        onBlur(id, value);
    const _onFocus = ({
        target: { value },
    }) => onFocus(id, value);

    const onCheckAll = () => {
        const all = (enumOptions).map(({ value }) => value);
        let update = [];
        enumOptions.forEach(v => update = selectValue(v.value, update, all));

        onChange(update);
    }

    const onCheckBundle = (option) => {
        const all = (enumOptions).map(({ value }) => value);
        let update = [
            ...value
        ];
        (option.value).forEach(v => update = selectValue(v, update, all));

        onChange(update);
    }

    const onClearAll = () => {
        onChange([]);
    }

    return (
        <fieldset>
            <legend><Translate value={label || schema.title} /></legend>
            <table className="table table-striped table-sm">
                <thead>
                    <tr className="table-secondary">
                        <th><Translate value="label.attribute-name">Attribute Name</Translate></th>
                        <th className="text-right pr-2"><Translate value="label.yes">Yes</Translate></th>
                    </tr>
                </thead>
                <tbody>
                    {(enumOptions).map((option, index) => {
                        const checked = value.indexOf(option.value) !== -1;
                        const itemDisabled =
                            enumDisabled && (enumDisabled).indexOf(option.value) !== -1;
                        const bundled = typeof option.value === 'string' ? false : true;
                        return (
                            <tr key={index} className={bundled ? 'bg-secondary border-bottom py-4 text-white' : ''}>
                                <td className="align-middle">{bundled ?
                                    <strong>{option.label}</strong>
                                    :
                                    <Translate value={`label.attribute-${option.label}`}>{option.label}</Translate>
                                }</td>
                                <td className="">
                                    <fieldset className="d-flex justify-content-end">
                                    {bundled ? 
                                        <Button variant="outline-primary bg-light" size="sm"
                                            onClick={() => onCheckBundle(option)}
                                            >Select</Button>
                                    :
                                        <div className="custom-control custom-checkbox">
                                            <Form.Check
                                                custom
                                                required={required}
                                                checked={checked}
                                                className="bg-transparent border-0"
                                                type={"checkbox"}
                                                id={`${id}_${index}`}
                                                autoFocus={autofocus && index === 0}
                                                onChange={_onChange(option)}
                                                onBlur={_onBlur}
                                                onFocus={_onFocus}
                                                disabled={disabled || itemDisabled || readonly}
                                            />
                                        </div>
                                    }
                                    </fieldset>
                                </td>
                            </tr>
                        );
                    })}
                    <tr>
                        <td><Translate value="label.check-all-attributes">Check All Attributes</Translate></td>
                        <td className="text-right">
                            <Button type="button" variant="text" size="sm" className="text-success px-2" onClick={() => onCheckAll()} id="attributeRelease.checkAll">
                                <FontAwesomeIcon icon={faCheck} size="lg" />
                                <span className="sr-only"><Translate value="label.check-all-attributes">Check All Attributes</Translate></span>
                            </Button>
                        </td>
                    </tr>
                    <tr>
                        <td><Translate value="label.clear-all-attributes">Clear All Attributes</Translate></td>
                        <td className="text-right">
                            <Button type="button" variant="text" size="sm" className="text-danger px-2" onClick={() => onClearAll()} id="attributeRelease.clearAll">
                                <FontAwesomeIcon icon={faTimes} size="lg" />
                                <span className="sr-only"><Translate value="label.clear-all-attributes">Clear All Attributes</Translate></span>
                            </Button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </fieldset>
    );
};

/*
*/

export default AttributeReleaseWidget;