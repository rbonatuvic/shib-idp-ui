import { MetadataConfiguration } from '../model/metadata-configuration';
import { WizardStep } from '../../../wizard/model';
import * as utils from '../../domain/utility/configuration';
import { getSplitSchema } from '../../../wizard/reducer';
import { SectionProperty } from '../model/section';

export const getConfigurationSectionsFn = (models, definition, schema): MetadataConfiguration => {
    return !definition || !schema || !models ? null :
        ({
            dates: models.map(m => m ? m.modifiedDate : null),
            sections: definition.steps
                .filter(step => step.id !== 'summary')
                .map(
                    (step: WizardStep, num: number) => {
                        return ({
                            id: step.id,
                            pageNumber: num + 1,
                            index: step.index,
                            label: step.label,
                            properties: utils.getStepProperties(
                                getSplitSchema(schema, step),
                                definition.formatter({}),
                                schema.definitions || {}
                            )
                        });
                    }
                )
                .map((section: any) => {
                    return {
                        ...section,
                        properties: assignValueToProperties(models, section.properties, definition)
                    };
                })
                .map((section: any) => ({
                    ...section,
                    differences: section.properties.some(prop => prop.differences)
                }))
        });
};

export const assignValueToProperties = (models, properties, definition: any): any[] => {
    return properties.map(prop => {
        const differences = models.some((model, index, array) => {
            if (!array) {
                return false;
            }
            return JSON.stringify(model[prop.id]) !== JSON.stringify(array[0][prop.id]);
        });

        const widget = prop.type === 'array' && prop.widget && prop.widget.data ? ({
            ...prop.widget,
            data: prop.widget.data.map(item => ({
                ...item,
                differences: models
                    .map((model) => {
                        const value = model[prop.id];
                        return value ? value.indexOf(item.key) > -1 : false;
                    })
                    .reduce((current, val) => current !== val ? true : false, false)
            }))
        }) : null;

        switch (prop.type) {
            case 'object':
                return {
                    ...prop,
                    differences,
                    properties: assignValueToProperties(
                        models.map(model => definition.formatter(model)[prop.id] || {}),
                        prop.properties,
                        definition
                    )
                };
            default:
                return {
                    ...prop,
                    differences,
                    value: models.map(model => {
                        return model[prop.id];
                    }),
                    widget
                };
        }
    });
};

export const getLimitedPropertiesFn = (properties: SectionProperty[]) => {
    return ([
        ...properties
            .filter(p => p.differences)
            .map(p => {
                const parsed = { ...p };
                if (p.widget && p.widget.data) {
                    parsed.widget = {
                        ...p.widget,
                        data: p.widget.data.filter(item => item.differences)
                    };
                }
                if (p.properties) {
                    parsed.properties = getLimitedPropertiesFn(p.properties);
                }
                return parsed;
            })
    ]);
};