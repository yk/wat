import 'reflect-metadata';
import 'zone.js/dist/zone';
import {Component, NgZone, provide} from 'angular2/core';

import {bootstrap} from 'angular2-meteor-auto-bootstrap';

import {ROUTER_PROVIDERS, ROUTER_DIRECTIVES, RouteConfig, APP_BASE_HREF} from 'angular2/router';

import {ExperimentList} from './experiment-list/experiment-list';

import {ExperimentDetails} from './experiment-details/experiment-details';
import {Constants} from '../constants';

@Component({
    selector: 'app',
    template: '<router-outlet></router-outlet>',
    directives: [ROUTER_DIRECTIVES]
})
@RouteConfig([
    { path: '/', as: 'ExperimentList', component: ExperimentList },
    { path: '/experiment/:experimentId', as: 'ExperimentDetails', component: ExperimentDetails },
])
class Socially {}

bootstrap(Socially, [ROUTER_PROVIDERS, provide(APP_BASE_HREF, { useValue: Constants.BASE })]);
