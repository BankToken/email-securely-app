import {map, takeUntil} from "rxjs/operators";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {Component, Input, OnDestroy, OnInit} from "@angular/core";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Store} from "@ngrx/store";

import {KeePassClientConf} from "_shared/model/keepasshttp";
import {OptionsActions} from "_web_app/store/actions";
import {progressSelector, State} from "_web_app/store/reducers/options";

@Component({
    selector: `protonmail-desktop-app-keepass-associate`,
    templateUrl: "./keepass-associate.component.html",
    styleUrls: ["./keepass-associate.component.scss"],
})
export class KeepassAssociateComponent implements OnInit, OnDestroy {
    url = new FormControl("http://localhost:19455", Validators.required);
    key = new FormControl(null);
    id = new FormControl(null);
    form = new FormGroup({
        url: this.url,
        key: this.key,
        id: this.id,
    });
    @Input()
    keePassClientConf$: Observable<KeePassClientConf>;
    processing$ = this.store.select(progressSelector)
        .pipe(map(({keePassReferencing}) => keePassReferencing));
    unSubscribe$ = new Subject();

    constructor(private store: Store<State>) {
    }

    ngOnInit() {
        this.keePassClientConf$
            .pipe(takeUntil(this.unSubscribe$))
            .subscribe(this.configureForm.bind(this));
    }

    submit() {
        this.store.dispatch(new OptionsActions.AssociateSettingsWithKeePassRequest({url: this.url.value}));
    }

    ngOnDestroy() {
        this.unSubscribe$.next();
        this.unSubscribe$.complete();
    }

    configureForm(keePassClientConf?: KeePassClientConf) {
        if (keePassClientConf) {
            this.url.patchValue(keePassClientConf.url);

            if (keePassClientConf.keyId) {
                this.key.patchValue(keePassClientConf.keyId.key);
                this.id.patchValue(keePassClientConf.keyId.id);
            }
        }
    }
}