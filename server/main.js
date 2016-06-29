import { Meteor } from 'meteor/meteor';
import '../imports/api/db.js';

var data_to_insert = [];

Meteor.startup(() => {
  console.log();
  console.log("----------------------------------");
  console.log("----------- Startup --------------");
  console.log("----------------------------------");
  console.log();
  // code to run on server at startup
  var Particle = Npm.require('particle-api-js');
  var particle = new Particle();

  var particleLogin = particle.login({
    username: 'cd@continuuminnovation.com',
    password: 'connecteddevices'
  });

  particleLogin.then(function (data) {
        console.log(data);
        return data.body.access_token;
    }).then(function (token) {
        console.log(token);
        return particle.getEventStream({
            deviceId: '1d003d000847353138383138',
            auth: token
        });
    }).then( function (stream) {
        stream.on('event', 
          function (data) {
            console.log(" ---- Particle Event in server ---- ");
            var eventString = data.name + ": " + data.data;
            console.log(data);
            console.log(eventString);
            data_to_insert.push(data);
          });
    });

  // var obj = { data: '{ "1": "1234.12", "2": "43345.98" }',
  //             ttl: '60',
  //             published_at: "2016-06-31T17:09:13.051Z",
  //             coreid: '1d003d000847353138383138',
  //             name: 'data' 
  //           };

  // Meteor.call('data_db.insert', obj);

});



Meteor.setInterval( function(){
  if(data_to_insert.length > 0){
    for( d in data_to_insert ){
      Meteor.call( 'data_db.insert', data_to_insert[d] );
    }
    data_to_insert = [];
  }
  else {
    //console.log("no data to insert");
  }
}, 3000);