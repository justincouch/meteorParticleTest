import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import '../imports/api/db.js';

import { DATA_DB } from '../imports/api/db.js';

import './main.html';

// Template.hello.onCreated(function helloOnCreated() {
//   // counter starts at 0
//   this.counter = new ReactiveVar(0);
// });

Template.data.helpers({
  datas() {
    //console.log(DATA_DB);
    //console.log(DATA_DB.find({}).fetch());
    return DATA_DB.find({}, { sort: { published_at: -1 } });
  },
});

Template.data_props.helpers({
  props() {
    result = [];
    for (kv in this.data){
      result.push({"key":kv, "value":this.data[kv]});
    }
    return result;
  },
});

Template.data.events({
  'click button'(event, instance) {
    // increment the counter when button is clicked
    instance.counter.set(instance.counter.get() + 1);
  },
});
