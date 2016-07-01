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



Template.lineChart.rendered = function(){
  //Width and height
  var margin = {top: 20, right: 50, bottom: 30, left: 50},
    width = 1080 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

  var x = d3.time.scale()
    .range([0, width]);

  var yTemp = d3.scale.linear()
    .range([height, 0]);

  var yLight = d3.scale.linear()
    .range([height, 0]);

  var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

  var yAxisTemp = d3.svg.axis()
    .scale(yTemp)
    .orient("left");

  var yAxisLight = d3.svg.axis()
    .scale(yLight)
    .orient("right");

  var TempLine = d3.svg.line()
    .x(function(d) { return x(d.published_at); })
    .y(function(d) { 
      var T;
      if ( d.data["1"] ) T = d.data["1"];
      else if ( d.data["TMP"] ) T = d.data["TMP"];
      else T = 0;
      return yTemp(T); 
    });

  var LightLine = d3.svg.line()
    .x(function(d) {
      return x(d.published_at);
    })
    .y(function(d) {
      var T;
      if ( d.data["2"] ) T = d.data["2"];
      else if ( d.data["ALS"] ) T = d.data["ALS"];
      else T = 0;
      return yLight(T); 
    });

  var svg = d3.select("#lineChart")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")");

  svg.append("g")
    .attr("class", "y axisTemp")
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Temperature C");

  svg.append("g")
    .attr("class", "y axisLight")
    .append("text")
    //.attr("transform", "rotate(-90)")
    .attr("transform", "translate(" + width + "," + 0 + ")")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .text("Ambient Light");

  Deps.autorun(function(){
    var dataset = DATA_DB.find({},{sort:{published_at:-1}}).fetch();

    var Tpaths = svg.selectAll("path.TempLine")
      .data([dataset]); //todo - odd syntax here - should use a key function, but can't seem to get that working

    var Lpaths = svg.selectAll("path.LightLine")
      .data([dataset]);

    x.domain(d3.extent(dataset, function(d) { return d.published_at; }));
    
    yTemp.domain(d3.extent(dataset, function(d) { return d.data["1"]; }));

    yLight.domain(d3.extent(dataset, function(d) { return d.data["2"]; }));

    //Update X axis
    svg.select(".x.axis")
      .transition()
      .duration(1000)
      .call(xAxis);
      
    //Update Y axis
    svg.select(".y.axisTemp")
      .transition()
      .duration(1000)
      .call(yAxisTemp);

    svg.select(".y.axisLight")
      .transition()
      .attr("transform", "translate(" + width + " ,0)")
      .duration(1000)
      .call(yAxisLight);
    
    Tpaths
      .enter()
      .append("path")
      .attr("class", "TempLine")
      .attr('d', TempLine);

    Tpaths
      .attr('d', TempLine); //todo - should be a transisition, but removed it due to absence of key
      
    Tpaths
      .exit()
      .remove();


    Lpaths
      .enter()
      .append("path")
      .attr("class", "LightLine")
      .attr('d', LightLine);

    Lpaths
      .attr('d', LightLine); //todo - should be a transisition, but removed it due to absence of key
      
    Lpaths
      .exit()
      .remove();
  });
};