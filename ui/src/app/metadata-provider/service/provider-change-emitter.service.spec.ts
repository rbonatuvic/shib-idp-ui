import { TestBed, async, inject } from '@angular/core/testing';
import { EntityValidators } from './entity-validators.service';
import { Observable } from 'rxjs/Observable';
import { AbstractControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import 'rxjs/add/observable/of';
import { ProviderStatusEmitter, ProviderValueEmitter } from './provider-change-emitter.service';

describe(`EntityDescriptorService`, () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule
            ],
            providers: [
                ProviderStatusEmitter,
                ProviderValueEmitter
            ]
        });
    });

    describe('ProviderStatusEmitter', () => {
        it('should emit values', async(inject([ProviderStatusEmitter], (emitter) => {
            let val = 'foo';
            emitter.changeEmitted$.subscribe(n => {
                expect(n).toEqual(val);
            });
            emitter.emit(val);
        })));
    });

    describe('ProviderValueEmitter', () => {
        it('should emit values', async(inject([ProviderValueEmitter], (emitter) => {
            let val = 'foo';
            emitter.changeEmitted$.subscribe(n => {
                expect(n).toEqual(val);
            });
            emitter.emit(val);
        })));
    });
});
