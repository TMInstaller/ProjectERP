//var db = require('./database');
//db.connectDB();
const assert = require('assert');

function accountDatabase(){
    //this.cursor;
    this.setToArray = [];
    //this.setResult = new Set();
    this.list= [];
    //this.employeeCursor;
    this.findObject;
    //this.setArray = [];
    this.db;
}

accountDatabase.prototype.setDatabase = function(db) {
    this.db = db;
}

accountDatabase.prototype.getAccountTable = async function(){
  var result = await this.db.database().collection('account').aggregate([
    { '$match':  {
      'EmployeeNumber' : cookie
      }
    }, {
      '$lookup': {
        'from': 'employee', 
        'localField': 'EmployeeNumber', 
        'foreignField': 'WorkerNumber', 
        'as': 'employee'
      }
    }, {
      '$unwind': {
        'path': '$employee'
      }
    }, {
      '$project': {
        'AccountName': 1,
        'AccountTel': 1,
        'AccountManagerName': '$employee.Name',
        'AccountManagerTel': '$employee.PhoneNumber'
      }
    }
  ]).toArray();

  if (result.length == 0) {
      console.log("there are no matching data in Collection");
  }

  return result;
}

accountDatabase.prototype.setAccountTable = function(){
    console.log(this.list);
    return this.list;
}

accountDatabase.prototype.accountInform = function(){
    
}
exports.setAccountRevise = function(Data){
    var cursor = db.database().collection('account').find(Data);
    cursor.toArray(function(err,result){
        reviseData = {
            AccountName : result[0].AccountName,
            AccountTel : result[0].AccountTel,
            EmployeeNumber : result[0].EmployeeNumber,
            AccountEmployeeName : result[0].AccountEmployeeName,
            AccountEmployeeTel : result[0].AccountEmployeeTel
        }
    });
}
exports.getAccountRevise = function(){
    return reviseData;
}
module.exports = accountDatabase;