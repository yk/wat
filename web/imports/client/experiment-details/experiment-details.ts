import 'reflect-metadata';
import './experiment-details.css';
import {Component} from '@angular/core';
import {MeteorComponent} from 'angular2-meteor';
import {Constants} from '../../constants';

import {Experiments} from '../../collections/experiments';
import {Analyses} from '../../collections/analyses';

import {ROUTER_DIRECTIVES, Router, ActivatedRoute} from '@angular/router';

import {AnalysisPlot} from '../analysis-plot/analysis-plot';
import {AnalysisScatter} from '../analysis-scatter/analysis-scatter';

@Component({
    selector: 'experiment-details',
    templateUrl: Constants.BASE + '/imports/client/experiment-details/experiment-details.html',
    styleUrls: [Constants.BASE + '/imports/client/experiment-details/experiment-details.css'],
    directives: [ROUTER_DIRECTIVES, AnalysisPlot, AnalysisScatter]
})
export class ExperimentDetails extends MeteorComponent{
    experiment: Experiment;
    analyses: Mongo.Cursor<Analysis>;
    _router: Router;

    constructor(route: ActivatedRoute, router: Router) {
        super();
        let experimentId = route.snapshot.params.experimentId;
        this.analyses = Analyses.find({experiment: experimentId}, {sort:{date: -1}});
        this.autorun(() => {
            this.experiment = Experiments.findOne(experimentId);
        }, true);
        this._router = router;
    }

    deleteExperiment(){
        if(confirm("Really delete")){
            Experiments.remove(this.experiment._id);
            this._router.navigate('/');
        }
    }

}
