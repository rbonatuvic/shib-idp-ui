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

export const getWizardState = createFeatureSelector<WizardState>('wizard');
export const getWizardStateFn = (state: WizardState) => state.wizard;
export const getState = createSelector(getWizardState, getWizardStateFn);

export const getWizardIndex = createSelector(getState, fromWizard.getIndex);
export const getWizardIsDisabled = createSelector(getState, fromWizard.getDisabled);
export const getWizardDefinition = createSelector(getState, fromWizard.getDefinition);
export const getSchemaCollection = createSelector(getState, fromWizard.getCollection);

export const getSchema = (index: string, wizard: Wizard<any>) => {
    if (!wizard) { return null; }
    const step = wizard.steps.find(s => s.id === index);
    return step ? step.schema : null;
};

export const getCurrentWizardSchema = createSelector(getWizardIndex, getWizardDefinition, getSchema);

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
