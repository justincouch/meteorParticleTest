import { Meteor } from 'meteor/meteor';
import '../imports/api/db.js';
import { CRED } from '../imports/api/credentials.config.js';
import { DEVICE_DB } from '../imports/api/db.js';

var data_to_insert = [];
var particle;

Meteor.startup(() => {
  console.log();
  console.log("----------------------------------");
  console.log("----------- Startup --------------");
  console.log("----------------------------------");
  console.log();
  // code to run on server at startup
  var Particle = Npm.require('particle-api-js');
  particle = new Particle();
  var token;

  particle.login({
    username: CRED.USERNAME,
    password: CRED.PASSWORD
  }).then(function (data) {
    console.log(data);
    token = data.body.access_token;
    listDevices(token);
    setUpStreams(token);
  });

  var devices = DEVICE_DB.find({}).fetch();
  console.log(devices);

  //for( d in devices ){
    //console.log(d);
  console.log(token);

  // var token = particleLogin.then(function (data) {
  //   console.log(data);
  //   return data.body.access_token;
  // });

  // var devicesPr = particle.listDevices({ auth: token });

  // devicesPr.then(
  //   function(devicesD){
  //     console.log('Devices: ', devicesD);
  //   },
  //   function(err) {
  //     console.log('List devices call failed: ', err);
  //   }
  // );

    
    // particleLogin.then(function (data) {
    //       console.log(data);
    //       return data.body.access_token;
    //   }).then(function (token) {
    //         console.log(token);
    //         return particle.getEventStream({
    //             //deviceId: devices[d].coreid,
    //             auth: token
    //         })
    //         .then( function (stream) {
    //           stream.on('event', 
    //             function (data) {
    //               console.log(" ---- Particle Event in server ---- ");
    //               var eventString = data.name + ": " + data.data;
    //               console.log(data);
    //               console.log(eventString);
    //               data_to_insert.push(data);
    //             });
    //         });
        
    //   });
  //}


  // var obj = { data: '{ "1": "1234.12", "2": "43345.98" }',
  //             ttl: '60',
  //             published_at: "2016-06-31T17:09:13.051Z",
  //             coreid: '1d003d000847353138383138',
  //             name: 'data' 
  //           };

  // Meteor.call('data_db.insert', obj);

});

function listDevices(token){
  console.log(token);
  console.log("in list devices");

  var devicesPr = particle.listDevices({ auth: token });

  devicesPr.then(
    function(devicesD){
      console.log('Devices: ', devicesD);
    },
    function(err) {
      console.log('List devices call failed: ', err);
    }
  );
}

function setUpStreams(token){
  console.log("in set up streams");
  for ( d in devices ){
    particle.getEventStream({
        deviceId: devices[d].coreid,
        auth: token
    })
    .then( function (stream) {
      console.log("stream gotten");
      console.log(stream);
      stream.on('event', 
        function (data) {
          console.log(" ---- Particle Event in server ---- ");
          var eventString = data.coreid + ": " + data.data;
          console.log(data);
          console.log(eventString);
          data_to_insert.push(data);
        });
    });
  }
}



Meteor.setInterval( function(){
  if(data_to_insert.length > 0){
    for( d in data_to_insert ){
      if (data_to_insert[d].data != 'online' && data_to_insert[d].data != 'offline'){
        Meteor.call( 'data_db.insert', data_to_insert[d] );
      }
    }
    data_to_insert = [];
  }
  else {
    //console.log("no data to insert");
  }
}, 3000);