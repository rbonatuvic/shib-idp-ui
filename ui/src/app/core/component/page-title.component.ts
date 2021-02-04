import { Component, OnInit, OnDestroy } from '@angular/core';

import { Store } from '@ngrx/store';

import * as fromRoot from '../reducer';
import { Observable, Subscription } from 'rxjs';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { I18nService } from '../../i18n/service/i18n.service';
import { filter, map, mergeMap, startWith, combineLatest } from 'rxjs/operators';
import { getCurrent } from '../../wizard/reducer';
import { getMessages } from '../../i18n/reducer';
import { SetTitle } from '../action/location.action';

@Component({
    selector: 'page-title',
    template: `<h2 tabindex="0" id="main-page-title" class="m-0">{{ pageTitle$ | async }}</h2>`,
    styleUrls: []
})
export class PageTitleComponent implements OnInit, OnDestroy {

    pageTitle$: Observable<string> = this.store.select(fromRoot.getLocationTitle);

    initial = true;
    sub: Subscription;

    constructor(
        private store: Store<fromRoot.State>,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private translateService: I18nService
    ) {
        this.pageTitle$.subscribe(title => {
            const heading = document.getElementById('main-page-title');
            if (heading && title) {
                if (!this.initial) {
                    heading.focus();
                }
                this.initial = false;
            }
            if (title) {
                document.title = `Shibboleth IDP UI | ${title}`;
            }
        });
    }

    ngOnInit(): void {
        this.sub = this.router.events.pipe(
            filter(e => e instanceof NavigationEnd),
            map(() => this.activatedRoute),
            map((route) => {
                while (route.firstChild) {
                    route = route.firstChild;
                }
                return route;
            }),
            filter((route) => route.outlet === 'primary'),
            mergeMap((route) => route.data),
            combineLatest(
                this.store.select(getCurrent).pipe(
                    filter(c => !!c),
                    startWith({ label: '' })
                ),
                this.store.select(getMessages).pipe(
                    startWith({})
                )
            ),
            map(([data, currentWizardPage, messages]) => {
                const title = data.subtitle && currentWizardPage ?
                    `${data.title} - ${this.translateService.translate(currentWizardPage.label, null, messages)}`
                    :
                    data.title;
                return new SetTitle(title);
            })
        ).subscribe(this.store);
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }
}
