var database;

exports.connectDB = function () {
  var MongoClient = require('mongodb').MongoClient;
  var client = new MongoClient('mongodb://localhost:27017/', { useNewUrlParser: true });

  client.connect(function (err) {
    console.log("Connected successfully");
    database = client.db('Project');
  });
}
exports.database = function () {
  return database;
}