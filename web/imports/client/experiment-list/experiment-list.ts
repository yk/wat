import 'reflect-metadata';
import './experiment-list.css';
import {Component} from 'angular2/core';
import {Constants} from '../../constants';

import {Experiments} from '../../collections/experiments';

import {RouterLink} from 'angular2/router';

@Component({
    selector: 'experiment-list',
    templateUrl: Constants.BASE + 'imports/client/experiment-list/experiment-list.html',
    styleUrls: [Constants.BASE + 'imports/client/experiment-list/experiment-list.css'],
    directives: [RouterLink]
})
export class ExperimentList {
    experiments: Mongo.Cursor<Experiment>;

    constructor() {
        this.experiments = Experiments.find({}, {sort:{start_time: -1}});
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
