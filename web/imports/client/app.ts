import 'reflect-metadata';
import 'zone.js/dist/zone';
import { Component, NgZone, provide, PlatformRef } from '@angular/core';

import { bootstrap } from '@angular/platform-browser-dynamic';

import { APP_BASE_HREF } from '@angular/common';
import { ROUTER_DIRECTIVES, provideRouter, Router } from '@angular/router';

import {ExperimentList} from './experiment-list/experiment-list';

import {ExperimentDetails} from './experiment-details/experiment-details';
import {Constants} from '../constants';

@Component({
    selector: 'app',
    template: '<router-outlet></router-outlet>',
    directives: [ROUTER_DIRECTIVES]
})
class WatApp {}

bootstrap(WatApp, [provide(APP_BASE_HREF, { useValue: Constants.BASE }),
    provideRouter([
        { path: '', component: ExperimentList },
        { path: 'experiment/:experimentId', component: ExperimentDetails },
    ]),
]);
