import { I18nService } from '../service/i18n.service';
import { CommonModule } from '@angular/common';
import { StoreModule, combineReducers, Store } from '@ngrx/store';

import * as fromI18n from '../reducer';
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MessagesLoadSuccessAction } from '../action/message.action';
import { TranslateDirective } from './translate.directive';
import { MockI18nService, MockI18nModule } from '../../../testing/i18n.stub';

@Component({
    template: `
        <div [translate]="foo">Word</div>
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

describe('Directive: I18n translation', () => {
    let fixture: ComponentFixture<TestHostComponent>;
    let instance: TestHostComponent;
    let store: Store<fromI18n.State>;
    let service: I18nService;

    const msg = {
        foo: 'foo',
        bar: 'bar',
        baz: 'baz'
    };

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: I18nService, useClass: MockI18nService }
            ],
            imports: [
                CommonModule,
                StoreModule.forRoot({
                    'i18n': combineReducers(fromI18n.reducers),
                })
            ],
            declarations: [
                TranslateDirective,
                TestHostComponent
            ],
        });
        store = TestBed.get(Store);
        service = TestBed.get(I18nService);

        spyOn(store, 'dispatch').and.callThrough();

        fixture = TestBed.createComponent(TestHostComponent);
        instance = fixture.componentInstance;
    });

    it('should set the correct text', () => {
        spyOn(service, 'translate').and.returnValue('foo');
        store.dispatch(new MessagesLoadSuccessAction(msg));

        store.select(fromI18n.getMessages).subscribe(() => {
            fixture.detectChanges();
            expect(fixture.nativeElement.textContent).toContain(msg.foo);
        });
    });
});
