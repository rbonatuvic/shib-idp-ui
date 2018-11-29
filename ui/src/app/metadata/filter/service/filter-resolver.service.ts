this.provider$
    .pipe(
        takeUntil(this.ngUnsubscribe)
    )
    .subscribe(p => {
        this.store.dispatch(new LoadFilterRequest(p.resourceId));
    });