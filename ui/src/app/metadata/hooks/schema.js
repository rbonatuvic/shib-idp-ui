import React from 'react';

export const fillInRootProperties = (keys, ui) => keys.reduce((sch, key, idx) => {
    if (!sch.hasOwnProperty(key)) {
        sch[key] = {};
    }
    return sch;
}, ui);

export function useUiSchema(definition, schema, current, locked = true) {

    const ui = React.useMemo(() => definition ? { ...definition.uiSchema } : {}, [definition]);
    const schemaKeys = React.useMemo(() => schema ? Object.keys(schema.properties) : [], [schema]);
    let step = React.useMemo(() => definition ? definition.steps.find(step => step.id === current) : {fields: []}, [definition, current]);

    if (!step) {
        step = definition.steps[0];
    }

    const filled = React.useMemo(() => fillInRootProperties(schemaKeys, ui), [schemaKeys, ui]);
    const mapped = React.useMemo(() => Object.keys(filled).reduce((sch, key) => {
        const obj = { ...filled[key] };
        if (step.fields.indexOf(key) === -1) {
            obj["ui:widget"] = 'hidden';
        }
        sch[key] = obj;
        return sch;
    }, {}), [filled, step]);

    const isLocked = React.useMemo(() => (
        {
            ...mapped,
            'ui:disabled': locked && step.locked ? true : false
        }
    ), [mapped, step.locked, locked]);

    return { uiSchema: isLocked, step};
}


export function useMetadataSchema(definition, schema) {
    return definition.schemaPreprocessor ? definition.schemaPreprocessor(schema) : schema;
}

export * from './utility';