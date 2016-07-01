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
        var cursor = DATA_DB.find({}, {
            sort: { published_at: -1 },
            limit: 10
        })
        var x = getRange(cursor.fetch())
        return cursor;
    },
});

Template.data_props.helpers({
    props() {
        result = [];
        for (kv in this.data) {
            result.push({ "key": kv, "value": this.data[kv] });
        }
        return result;
    },
});

Template.data.onRendered(function() {
    var xMin = DATA_DB.findOne({}, { 
          sort: { published_at: -1 }, 
          fields: {published_at:1}
        })
    var xMax = DATA_DB.findOne({}, { 
          sort: { published_at: -1 }, 
          fields: {published_at:1}
        })
    var xDomain = [xMin, xMax]
    console.log(xDomain)
    var yDomain = getRange(DATA_DB.find({}, { sort: { published_at: -1 }, limit: 10 }).fetch())
    console.log(yDomain)
        //define constants
    const width = 500
    const height = 75

    //define scales and axes
    var xScale = d3.time.scale()


    var yScale = d3.scale.linear()
        .domain([yDomain[0], yDomain[1]])
        .range([0, height])

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .orient("bottom")

})


Template.data.events({
    'click button' (event, instance) {
        // increment the counter when button is clicked
        instance.counter.set(instance.counter.get() + 1);
    },
});



function getRange(array) {
    var vals = array.map(function(d) {
        return d.data[1];
    })
    min = Math.min.apply(null, vals)
    max = Math.max.apply(null, vals)
    return [min, max]
};
