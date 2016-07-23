import {Experiments} from '../imports/collections/experiments';

Meteor.startup(() => {
    Experiments.find().count();
    Experiments._ensureIndex({start_time: -1});
});
