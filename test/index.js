
// -----------------------
//  Test
// --------------------

var Storage = require('../../node-document-storage');

module.exports = Storage.Spec('MongoDB', {
  module: require('..'),
  engine: require('mongodb'),
  db: 'default-test',
  default_url: 'mongodb://localhost:27017/default-test',
  authorized_url: 'mongodb://heroku:f51b96d19b73a934b3d2a0d43e4b7aa7@alex.mongohq.com:10020/app9156953',
  unauthorized_url: 'mongodb://heroku:123@alex.mongohq.com:10020/app9156953',
  client: {
    get: function(db, type, id, callback) {
      db = db.replace('.', '_');

      var client = new require('mongodb').Db(db, new require('mongodb').Server('localhost', 27017), {safe: false});

      client.open(function(err, db) {
        db.collection(type, function(err, collection) {
          collection.findOne({_id: id}, function(err, doc) {
            db.close();
            if (doc) {
              delete doc._id;
            }
            callback(err, doc);
          });
        });
      });
    },

    set: function(db, type, id, data, callback) {
      db = db.replace('.', '_');

      var client = new require('mongodb').Db(db, new require('mongodb').Server('localhost', 27017), {safe: false});

      client.open(function(err, db) {
        db.collection(type, function(err, collection) {
          data._id = id;
          collection.update({_id:id}, data, {upsert: true, safe: true}, function(err, count) {
            db.close();
            callback(err, count);
          });
        });
      });
    },

    del: function(db, type, id, callback) {
      db = db.replace('.', '_');

      var client = new require('mongodb').Db(db, new require('mongodb').Server('localhost', 27017), {safe: false});

      client.open(function(err, db) {
        db.collection(type, function(err, collection) {
          collection.remove({_id:id}, {safe: true}, function(err, doc) {
            db.close();
            callback(err, doc);
          });
        });
      });
    }
  }
});
