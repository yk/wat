import 'reflect-metadata';
import './experiment-list.css';
import {Component} from '@angular/core';
import {Constants} from '../../constants';

import {Experiments} from '../../collections/experiments';

import {ROUTER_DIRECTIVES} from '@angular/router';
import {MdButton} from '@angular2-material/button';

@Component({
    selector: 'experiment-list',
    templateUrl: Constants.BASE + 'imports/client/experiment-list/experiment-list.html',
    styleUrls: [Constants.BASE + 'imports/client/experiment-list/experiment-list.css'],
    directives: [ROUTER_DIRECTIVES, MdButton]
})
export class ExperimentList {
    experiments: Mongo.Cursor<Experiment>;

    constructor() {
        this.experiments = Experiments.find({}, {
            fields: {description: true, start_time: true},
            sort: {start_time: -1},
        });
    }

    setDescription(experiment, description){
        Experiments.update(experiment._id, {
            "$set": {description: description},
        });
    }

    deleteExperiment(experiment){
        if(confirm("Really delete")){
            Experiments.remove(experiment._id);
        }
    }

}
