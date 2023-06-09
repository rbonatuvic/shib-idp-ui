import { detailedDiff } from "deep-object-diff";
import { removeNull } from "../../core/utility/remove_null";

export const checkChanges = (original, updates) => {
    const diff = detailedDiff(removeNull(original, true), removeNull(updates, true));
    const hasChanges = Object.keys(diff).some(d => Object.keys(diff[d]).length > 0);
    return hasChanges;
}

export function getDefinition(path, definitions) {
    let def = path.split('/').pop();
    return definitions[def];
}

export function getPropertyItemSchema(items, definitions) {
    if (!items) { return null; }
    return items.$ref ? getDefinition(items.$ref, definitions) : items;
}

export function getStepProperty(property, model, definitions) {
    if (!property) { return null; }
    property = property.$ref ? { ...property, ...getDefinition(property.$ref, definitions) } : property;
    return {
        ...property,
        name: property.title,
        value: model,
        type: property.type,
        items: getPropertyItemSchema(property.items, definitions),
        properties: getStepProperties(
            property,
            model,
            definitions
        )
    };
}


export function getStepProperties(schema, model, definitions = {}) {
    if (!schema || !schema.properties) { return []; }
    return Object
        .keys(schema.properties)
        .map(property => {
            return {
                ...getStepProperty(
                    schema.properties[property],
                    model && model.hasOwnProperty(property) ? model[property] : null,
                    definitions
                ),
                id: property
            };
        });
}


function omit(key, obj) {
    if (!obj) {
        return obj;
    }
    const { [key]: omitted, ...rest } = obj;
    return rest;
}

export const rollupDifferences = (prop) => {
    let updates = {
        ...prop
    };

    if (prop.properties) {
        updates = {
            ...updates,
            properties: [
                ...prop.properties.map(p => rollupDifferences(p))
            ]
        };
    }

    prop.differences = prop.properties.some(p => p.differences);

    return updates;
};

export const getConfigurationSections = (models, definition, schema) => {
    return !definition || !schema || !models ? null :
        ({
            dates: models.map(m => m ? m.modifiedDate : null),
            sections: definition.steps
                .filter(step => step.id !== 'summary')
                .map(
                    (step, num) => {
                        return ({
                            id: step.id,
                            pageNumber: num + 1,
                            index: step.index,
                            label: step.label,
                            properties: getStepProperties(
                                getSplitSchema(schema, step),
                                definition.display({}),
                                schema.definitions || {}
                            )
                        });
                    }
                )
                .map((section) => {
                    return {
                        ...section,
                        properties: assignValueToProperties(models, section.properties, definition, schema)
                    };
                })
                .map((section) => ({
                    ...section,
                    differences: section.properties.some(prop => prop.differences)
                }))
        });
};

const getDifferences = (models, prop) => {
    return models.some((model, index, array) => {
        if (!array) {
            return false;
        }
        const prop1 = omit('modifiedDate', model[prop.id]);
        const prop2 = omit('modifiedDate', array[0][prop.id]);
        return JSON.stringify(prop1) !== JSON.stringify(prop2);
    });
};

export const assignValueToProperties = (models, properties, definition, schema) => {
    return properties.map(prop => {
        const differences = getDifferences(models, prop);

        const items = prop.type === 'array' && prop.items?.enum ? ({
            ...prop.items,
            enum: prop.items.enum.map((item, index) => ({
                key: item,
                label: `${prop?.items?.enumNames ? prop?.items?.enumNames[index] : item}`,
                differences: models
                    .map((model) => {
                        const value = model[prop.id];
                        return value ? value.indexOf(item) > -1 : false;
                    })
                    .reduce((current, val) => current !== val ? true : false, false)
            }))
        }) : null;

        switch (prop.type) {
            case 'object':
                return {
                    ...prop,
                    properties: assignValueToProperties(
                        models.map(model => definition.display(model, schema)[prop.id] || {}),
                        prop.properties,
                        definition,
                        schema
                    ),
                    differences: getDifferences(models, prop)
                };
            default:
                return {
                    ...prop,
                    differences,
                    value: models.map(model => {
                        return model[prop.id];
                    }),
                    items: {
                        ...prop.items,
                        ...items
                    }
                };
        }
    });
};

export const getLimitedProperties = (properties) => {
    return ([
        ...properties
            .filter(p => p.differences)
            .map(p => {
                const parsed = { ...p };
                if (p.properties) {
                    parsed.properties = getLimitedProperties(p.properties);
                }
                return parsed;
            })
    ]);
};

export const getSplitSchema = (schema, step) => {
    if (!schema || !step || !step.fields || !step.fields.length || !schema.properties) {
        return schema;
    }
    const keys = Object.keys(schema.properties).filter(key => step.fields.indexOf(key) > -1);
    const required = (schema.required || []).filter(val => keys.indexOf(val) > -1);
    let s = {
        type: schema.type,
        properties: {
            ...keys.reduce((properties, key) => ({ ...properties, [key]: schema.properties[key] }), {})
        }
    };

    if (step.override) {
        Object.keys(step.override).forEach(key => {
            let override = step.override[key];
            if (s.properties.hasOwnProperty(key)) {
                s.properties[key] = { ...s.properties[key], ...override };
            }
        });
    }

    if (step.order) {
        s.order = step.order;
    }

    if (schema.definitions) {
        s.definitions = schema.definitions;
    }
    if (required && required.length) {
        s.required = required;
    }

    return s;
};
