import { TranslatePipe } from './i18n.pipe';
import { I18nService } from '../service/i18n.service';
import { CommonModule } from '@angular/common';
import { StoreModule, combineReducers, Store } from '@ngrx/store';

import * as fromI18n from '../reducer';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MessagesLoadSuccessAction } from '../action/message.action';
import { MockI18nService, MockI18nModule } from '../../../testing/i18n.stub';

@Component({
    template: `
        <span>{{ foo | translate:{ foo: 'bar' } }}</span>
    `
})
class TestHostComponent {
    private _foo: string;

    public get foo(): string {
        return this._foo;
    }

    public set foo(val: string) {
        this._foo = val;
    }
}

describe('Pipe: I18n translation', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let store: Store<fromI18n.State>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: I18nService, useClass: MockI18nService }
            ],
            imports: [
                CommonModule,
                StoreModule.forRoot({
                    'message': combineReducers(fromI18n.reducers),
                })
            ],
            declarations: [
                TranslatePipe,
                TestHostComponent
            ],
        });
        store = TestBed.get(Store);

        spyOn(store, 'dispatch').and.callThrough();

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
    });

    it('should set the correct text', () => {
        store.dispatch(new MessagesLoadSuccessAction({ foo: 'hi there' }));

        store.select(fromI18n.getMessages).subscribe(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.textContent).toContain('hi there');
        });
    });
});
