import * as selectors from './';
import { FileBackedHttpMetadataProviderWizard } from '../../metadata/provider/model';

describe('wizard index selectors', () => {
    describe('getSchema method', () => {
        it('should return the schema by index name', () => {
            expect(
                selectors.getSchema('common', FileBackedHttpMetadataProviderWizard)
            ).toBe(FileBackedHttpMetadataProviderWizard.steps[0].schema);
        });
        it('should return nothing if no schema is found', () => {
            expect(
                selectors.getSchema('common', null)
            ).toBeFalsy();
        });
    });
    describe('getPreviousFn method', () => {
        it('should return the previous step', () => {
            expect(
                selectors.getPreviousFn('reloading', FileBackedHttpMetadataProviderWizard)
            ).toBe(FileBackedHttpMetadataProviderWizard.steps[0]);
        });
        it('should return null if the index is the first step', () => {
            expect(
                selectors.getPreviousFn('common', FileBackedHttpMetadataProviderWizard)
            ).toBeFalsy();
        });
        it('should return nothing if no schema is found', () => {
            expect(
                selectors.getPreviousFn('common', null)
            ).toBeFalsy();
        });
    });

    describe('getNextFn method', () => {
        it('should return the previous step', () => {
            expect(
                selectors.getNextFn('common', FileBackedHttpMetadataProviderWizard)
            ).toBe(FileBackedHttpMetadataProviderWizard.steps[1]);
        });
        it('should return null if the index is the last step', () => {
            expect(
                selectors.getNextFn('summary', FileBackedHttpMetadataProviderWizard)
            ).toBeFalsy();
        });
        it('should return nothing if no schema is found', () => {
            expect(
                selectors.getNextFn('common', null)
            ).toBeFalsy();
        });
    });

    describe('getCurrentFn method', () => {
        it('should return the current step', () => {
            expect(
                selectors.getCurrentFn('common', FileBackedHttpMetadataProviderWizard)
            ).toBe(FileBackedHttpMetadataProviderWizard.steps[0]);
        });
        it('should return nothing if no schema is found', () => {
            expect(
                selectors.getCurrentFn('common', null)
            ).toBeFalsy();
        });
    });

    describe('getLastFn method', () => {
        it('should return the last step', () => {
            expect(
                selectors.getLastFn('summary', FileBackedHttpMetadataProviderWizard)
            ).toBe(FileBackedHttpMetadataProviderWizard.steps.find(step => step.id === 'summary'));
        });
        it('should return nothing if no definition is provided', () => {
            expect(
                selectors.getLastFn('common', null)
            ).toBeFalsy();
        });
        it('should return nothing if no schema is found', () => {
            expect(
                selectors.getLastFn('common', FileBackedHttpMetadataProviderWizard)
            ).toBeFalsy();
        });
    });

    describe('getModelFn method', () => {
        it('should return the model', () => {
            const step = FileBackedHttpMetadataProviderWizard.steps.find(s => s.id === 'filters');
            expect(selectors.getModelFn(step)).toEqual({ metadataFilters: [] });
        });
    });
});
