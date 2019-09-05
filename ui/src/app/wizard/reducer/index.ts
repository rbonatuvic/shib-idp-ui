import * as fromRoot from '../../app.reducer';
import * as fromWizard from './wizard.reducer';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { Wizard, WizardStep } from '../model';

export interface WizardState {
    wizard: fromWizard.State;
}

export const reducers = {
    wizard: fromWizard.reducer,
};

export interface State extends fromRoot.State {
    'wizard': WizardState;
}

export function getSchemaParseFn(schema, locked): any {
    if (!schema || !schema.properties) {
        return schema;
    }
    return {
        ...schema,
        properties: Object.keys(schema.properties).reduce((prev, current) => {
            return {
                ...prev,
                [current]: {
                    ...schema.properties[current],
                    readOnly: locked,
                    ...(schema.properties[current].hasOwnProperty('properties') ?
                        getSchemaParseFn(schema.properties[current], locked) :
                        {}
                    )
                }
            };
        }, {})
    };
}

export const getWizardState = createFeatureSelector<WizardState>('wizard');
export const getWizardStateFn = (state: WizardState) => state.wizard;
export const getState = createSelector(getWizardState, getWizardStateFn);

export const getWizardIndex = createSelector(getState, fromWizard.getIndex);
export const getWizardIsDisabled = createSelector(getState, fromWizard.getDisabled);
export const getWizardDefinition = createSelector(getState, fromWizard.getDefinition);

export const getSchemaPath = (wizard: Wizard<any>) => wizard ? wizard.schema : null;

export const getSplitSchema = (schema: any, step: WizardStep) => {
    if (!schema || !step.fields || !step.fields.length || !schema.properties) {
        return schema;
    }
    const keys = Object.keys(schema.properties).filter(key => step.fields.indexOf(key) > -1);
    const required = (schema.required || []).filter(val => keys.indexOf(val) > -1);
    let s: any = {
        type: schema.type,
        properties: {
            ...keys.reduce( (properties, key) => ({ ...properties, [key]: schema.properties[key] }) , {})
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
    if (step.fieldsets) {
        s.fieldsets = step.fieldsets;
    }

    return s;
};

export const getCurrentWizardSchema = createSelector(getWizardDefinition, getSchemaPath);

export const getPreviousFn = (index: string, wizard: Wizard<any>) => {
    if (!wizard) { return null; }
    const step = wizard.steps.findIndex(s => s.id === index);
    return wizard.steps[step - 1];
};

export const getNextFn = (index: string, wizard: Wizard<any>) => {
    if (!wizard) { return null; }
    const step = wizard.steps.findIndex(s => s.id === index);
    return wizard.steps[step + 1];
};

export const getCurrentFn = (index: string, wizard: Wizard<any>) => {
    if (!wizard) { return null; }
    return wizard.steps.find(s => s.id === index);
};

export const getLastFn = (index: string, wizard: Wizard<any>) => {
    if (!wizard) { return null; }
    const step = wizard.steps.length > 1 && wizard.steps[wizard.steps.length - 1];
    return index === step.id ? step : null;
};

export const getModelFn = (currentStep: WizardStep) => {
    const model = (currentStep && currentStep.initialValues) ? currentStep.initialValues : [];
    return model.reduce((m, property) => ({...m, [property.key]: property.value }), {});
};

export const getPrevious = createSelector(getWizardIndex, getWizardDefinition, getPreviousFn);
export const getCurrent = createSelector(getWizardIndex, getWizardDefinition, getCurrentFn);
export const getNext = createSelector(getWizardIndex, getWizardDefinition, getNextFn);
export const getLast = createSelector(getWizardIndex, getWizardDefinition, getLastFn);
export const getModel = createSelector(getCurrent, getModelFn);

export const getRoutes = createSelector(getWizardDefinition, d => d ? d.steps.map(step => ({ path: step.id, label: step.label })) : [] );

export const getLockedStatus = createSelector(getState, fromWizard.getLocked);
export const getSchemaLockedFn = (step, locked) => step ? step.locked ? locked : false : false;
export const getLocked = createSelector(getCurrent, getLockedStatus, getSchemaLockedFn);

export const getSchemaObject = createSelector(getState, fromWizard.getSchema);
export const getParsedSchema = createSelector(getSchemaObject, getLocked, getSchemaParseFn);

export const getSchema = createSelector(getParsedSchema, getCurrent, getSplitSchema);

export const getWizardDefinitionValidationParams = createSelector(getWizardDefinition, def => def.validatorParams);

export const getValidators = (params: any) => createSelector(getWizardDefinition, (definition) => {
    return definition.getValidators(...params);
});
