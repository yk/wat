import {Experiments} from '../imports/collections/experiments';
import {Analyses} from '../imports/collections/analyses';

Meteor.startup(() => {
    Experiments.find().count();
    Analyses.find().count();
    Experiments._ensureIndex({start_time: -1});
    Analyses._ensureIndex({date: -1, experiment: 1});
});
