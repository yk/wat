import 'reflect-metadata';
import 'zone.js/dist/zone';
import { Component, NgZone, provide, PlatformRef } from '@angular/core';

import { bootstrap } from '@angular/platform-browser-dynamic';

import { APP_BASE_HREF } from '@angular/common';
import { ROUTER_DIRECTIVES, provideRouter, Router } from '@angular/router';
import {HTTP_PROVIDERS} from '@angular/http';

import {ExperimentList} from './experiment-list/experiment-list';

import {ExperimentDetails} from './experiment-details/experiment-details';
import {Constants} from '../constants';

import {HAMMER_GESTURE_CONFIG} from '@angular/platform-browser';
import {OVERLAY_CONTAINER_TOKEN} from '@angular2-material/core/overlay/overlay';
import {MdLiveAnnouncer} from '@angular2-material/core/a11y/live-announcer';
import {createOverlayContainer} from '@angular2-material/core/overlay/overlay-container';
import {MdGestureConfig} from '@angular2-material/core/gestures/MdGestureConfig';
import {MdIconRegistry} from '@angular2-material/icon/icon-registry';
import {MD_SIDENAV_DIRECTIVES} from '@angular2-material/sidenav';
import {MdToolbar} from '@angular2-material/toolbar';
import {MdButton} from '@angular2-material/button';
import {MdIcon} from '@angular2-material/icon';

@Component({
    selector: 'app',
    templateUrl: Constants.BASE + 'imports/client/app.html',
    directives: [ROUTER_DIRECTIVES, MD_SIDENAV_DIRECTIVES, MdToolbar, MdButton, MdIcon],
})
class WatApp {
    public views: Object[] = [
        {
            name: 'Experiments',
            path: '/'
        },
    ];
}

bootstrap(WatApp, [provide(APP_BASE_HREF, { useValue: Constants.BASE }),
    provideRouter([
        { path: '', component: ExperimentList },
        { path: 'experiment-details/:experimentId', component: ExperimentDetails },
    ]),
    MdLiveAnnouncer,
    {provide: OVERLAY_CONTAINER_TOKEN, useValue: createOverlayContainer()},
    MdIconRegistry,
    {provide: HAMMER_GESTURE_CONFIG, useClass: MdGestureConfig},
    HTTP_PROVIDERS,
]);
