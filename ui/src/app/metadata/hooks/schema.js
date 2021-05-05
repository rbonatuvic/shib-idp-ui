import React from 'react';

import assignInWith from 'lodash/assignInWith';
import { I18nContext } from '../../i18n/context/I18n.provider';

const fillInRootProperties = (keys, ui) => {
    return keys.reduce((sch, key, idx) => {
        if (!sch.hasOwnProperty(key)) {
            sch[key] = {};
        }
        return sch;
    }, ui);
}

export function useUiSchema(definition, schema, current) {

    const ui = React.useMemo(() => definition ? { ...definition.uiSchema } : {}, [definition]);
    const schemaKeys = React.useMemo(() => schema ? Object.keys(schema.properties) : [], [schema]);
    const step = React.useMemo(() => definition ? definition.steps.find(step => step.id === current) : {fields: []}, [definition, current]);

    const filled = React.useMemo(() => fillInRootProperties(schemaKeys, ui), [schemaKeys, ui]);

    const mapped = React.useMemo(() => {
        return Object.keys(filled).reduce((sch, key) => {
            const obj = { ...filled[key] };
            if (step.fields.indexOf(key) === -1) {
                obj["ui:widget"] = 'hidden';
            }
            sch[key] = obj;
            return sch;
        }, {})
    }, [filled, step]);

    return mapped;
}


export function useMetadataSchema(schema) {
    return schema;
}

export * from './utility';