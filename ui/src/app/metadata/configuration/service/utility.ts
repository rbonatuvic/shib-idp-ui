import { Property } from '../../domain/model/property';

export function getDefinition(path: string, definitions: any): any {
    let def = path.split('/').pop();
    return definitions[def];
}
export function getPropertyItemSchema(items: any, definitions: any): any {
    if (!items) { return null; }
    return items.$ref ? getDefinition(items.$ref, definitions) : items;
}

export function getStepProperty(property, model, definitions): Property {
    if (!property) { return null; }
    property = property.$ref ? { ...property, ...getDefinition(property.$ref, definitions) } : property;
    return {
        name: property.title,
        value: model,
        type: property.type,
        items: getPropertyItemSchema(property.items, definitions),
        properties: getStepProperties(
            property,
            model,
            definitions
        ),
        widget: property.widget instanceof String ? { id: property.widget } : { ...property.widget }
    };
}

export function getStepProperties(schema: any, model: any, definitions: any = {}): Property[] {
    if (!schema || !schema.properties) { return []; }
    return Object
        .keys(schema.properties)
        .map(property => {
            return getStepProperty(
                schema.properties[property],
                model && model.hasOwnProperty(property) ? model[property] : null,
                definitions
            );
        });
}
