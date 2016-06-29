import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const DATA_DB = new Mongo.Collection('data_db');

// if ( Meteor.isServer ){
//   Meteor.publish('data_db', function dbPublication() {
//     return DATA_DB.find({
//       // $or: [
//       //   { private: { $ne: true } },
//       //   { owner: this.userId },
//       // ],
//     });
//   });
// }

Meteor.methods({
  'data_db.insert': function(obj){
    // this.unblock();
    check(obj, Object);
    console.log( "+++++++ inserting ++++++++" );
    console.log( obj );

    if ( obj.data ){
      obj.data = JSON.parse(obj.data);
      for( d in obj.data ){
        // we should probably check to make sure we need to parse here
        obj.data[d] = parseFloat(obj.data[d]);
      }
    }

    if (obj.published_at){
      console.log(obj.published_at);

      obj.published_at = new Date(obj.published_at);
      console.log(obj.published_at);
    }
    // if( ! Meteor.userId() ){
    //   throw new Meteor.Error('not-authorized');
    // }
    DATA_DB.insert( obj, function( err, res ){
      if ( err ) throw err;
      if ( res ){
        console.log("==  SUCCESS!  ==");
        console.log(res);
      }
    });
  },
  'data_db.remove': function(dbId){
    check(dbId, String);

    //const doc = DB.findOne(dbId);
    // if( doc.private && doc.owner !== Meteor.userId() ){
    //   throw new Meteor.Error('not-authorized');
    // }

    DATA_DB.remove(dbId);
  },
  'data_db.test': function(){
    return "tested!";
  }
});