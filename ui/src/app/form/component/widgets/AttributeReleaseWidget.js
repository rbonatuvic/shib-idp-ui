import React from "react";
import Form from "react-bootstrap/Form";
import intersection from 'lodash/intersection';
import Translate from "../../../i18n/components/translate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import Button from 'react-bootstrap/Button';

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

    const onUncheckBundle = (option) => {
        const all = (enumOptions).map(({ value }) => value);
        let update = [
            ...value
        ];
        (option.value).forEach(v => update = deselectValue(v, update, all));

        onChange(update);
    }

    const onClearAll = () => {
        onChange([]);
    }

    const attrs = React.useMemo(() => enumOptions.filter(e => !(typeof e.value === 'string' ? false : true)), [enumOptions]);
    const bundles = React.useMemo(() => enumOptions.filter(e => (typeof e.value === 'string' ? false : true)), [enumOptions]);

    const bundlelist = React.useMemo(() => bundles.map((b) => (
        {
            ...b,
            selected: intersection(b.value, value).length === b.value.length
        }
    )), [bundles, value]);
    
    return (
        <fieldset>
            <legend><Translate value={label || schema.title} /></legend>
            {bundles && bundles.length > 0 &&
            <ul class="list-group list-group-flush">
                {(bundlelist).map((option) => (
                <li class="list-group-item d-flex justify-content-between px-1">
                    <strong><Translate value="label.bundle-disp" params={{name: option.label}}></Translate></strong>
                    <Button variant={option.selected ? 'outline-primary' : 'primary'} size="sm"
                        onClick={() => option.selected ? onUncheckBundle(option) : onCheckBundle(option) }
                    >
                        <span className="sr-only"><Translate value="action.select">Select</Translate></span>
                        <FontAwesomeIcon icon={faCheck} className="" />
                    </Button>
                </li>
                ))}
            </ul>
            }

            <table className="table table-striped table-sm">
                <thead>
                    <tr className="table-secondary">
                        <th><Translate value="label.attribute-name">Attribute Name</Translate></th>
                        <th className="text-right pr-2"><Translate value="label.yes">Yes</Translate></th>
                    </tr>
                </thead>
                <tbody>
                    {(attrs).map((option, index) => {
                        const checked = value.indexOf(option.value) !== -1;
                        const itemDisabled =
                            enumDisabled && (enumDisabled).indexOf(option.value) !== -1;
                        return (
                            <tr key={index}>
                                <td className="align-middle"><Translate value={`label.attribute-${option.label}`}>{option.label}</Translate></td>
                                <td className="">
                                    <fieldset className="d-flex justify-content-end">
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