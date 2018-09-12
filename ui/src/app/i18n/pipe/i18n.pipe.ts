import { PipeTransform, Pipe, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromI18n from '../reducer';
import { Subscription } from 'rxjs';
import { I18nService } from '../service/i18n.service';

@Pipe({
    name: 'i18n',
    pure: false
})
export class I18nPipe implements PipeTransform, OnDestroy {

    sub: Subscription;

    messages: { [propName: string]: string } = {};

    value: string;

    constructor(
        private store: Store<fromI18n.State>,
        private i18nService: I18nService,
        private _ref: ChangeDetectorRef
    ) {
        this.sub = this.store.select(fromI18n.getMessages).subscribe(messages => {
            this.messages = messages ? messages : {};
            this._ref.markForCheck();
        });
    }

    transform(value: string, interpolated: { [prop: string]: string } = {}): any {
        interpolated = interpolated || {};
        let val = this.messages.hasOwnProperty(value) ? this.messages[value] : value;
        this.value = this.i18nService.interpolate(val, interpolated);
        return this.value;
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}
