
/* Database Something changed?*/

var db = require('./database');
db.connectDB();
var AccountDB = require('./accountDatabase');
var accountDB = new AccountDB();
accountDB.setDatabase(db);
var UpdateData = require('./updateData');

/* Server */

var app = require('express')();
var bodyParser = require('body-parser');
var http = require('http').createServer(app);
var cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/* Files */

var location = "C:/Users/백동열/Desktop/2019_08_19"


app.get('/menubar', function (req, res) {
  res.sendFile(location + "/HTML/menubar.html");
});

app.get('/input', function (req, res) {
  res.sendFile(location + "/CSS/input.css");
});

app.get('/navigationbar', function (req, res) {
  res.sendFile(location + "/CSS/navigationbar.css");
});

app.get('/navigationbar2', function (req, res) {
  res.sendFile(location + "/CSS/navigationbar2.css");
});


app.get('/client.js', function (req, res) {
  res.sendFile(location + "/Javascript/client.js");
});

app.get('/accountInquiry/account', function (req, res) {
  if (req.cookies.user != null) {
    res.sendFile(location + "/HTML/account_information.html");
  } else {
    res.sendFile(location + '/HTML/login.html');
  }
});

app.get('/accountInquiry', function (req, res) {
  if (req.cookies.user != null) {
    res.sendFile(location + "/HTML/accountInquiry.html");
  } else {
    res.sendFile(location + '/HTML/login.html');
  }
});

app.get('/inquiry', function (req, res) {
  if (req.cookies.user != null) {
    res.sendFile(location + "/HTML/inquiry.html");
  } else {
    res.sendFile(location + '/HTML/login.html');
  }
});
app.get('/accountInquiry/orderReceive', function (req, res) {
  if (req.cookies.user != null) {
    res.sendFile(location + "/HTML/orderReceive.html");
  } else {
    res.sendFile(location + '/HTML/login.html');
  }
});
app.get('/accountInquiry/orderPrint', function (req, res) {
  if (req.cookies.user != null) {
    res.sendFile(location + "/HTML/orderPrint.html");
  } else {
    res.sendFile(location + '/HTML/login.html');
  }
});

app.get('/', function (req, res, next) {
  if (req.cookies.user == null) {
    res.sendFile(location + '/HTML/login.html');
  } else {
    res.sendFile(location + '/HTML/main.html');
  }
});

app.get('/inform', function (req, res) {
  res.sendFile(location + '/HTML/information.html');
});

/* Information Get */

app.post("/RegisterSubmit", function (req, res) {
  var cursor = db.database().collection('employee').find({ WorkerNumber: req.body.WorkerNumber });
  cursor.toArray(function (err, result) {
    if (result.length != 0) {
      db.database().collection('changeLog').insertOne(UpdateData.updateData(result[0], req.body, result[0]._id, "employee", req.cookies.user));
      db.database().collection('employee').updateMany(result[0], { $set: req.body }, { upsert: true });
    } else {
      db.database().collection('employee').insertOne(req.body);
    }
    res.send();
  });
});

/* Login */

app.post('/login', function (req, res) {
  var cursor = db.database().collection('employee').find({ WorkerNumber: req.body.EmployeeNumber, Password: req.body.Password });
  cursor.toArray(function (err, result) {
    if (result.length != 0) {
      res.cookie("user", result[0].WorkerNumber, {
        expires: new Date(Date.now() + 900000000000000000)
      });
      res.send({ Login: true });
    }
    else {
      console.log("ID or Password is not correct");
      res.send({ Login: false });
    }
  });
});

/* Account Manager Select */

app.get('/accountManagerSelect', function (req, res) {
  var cursor = db.database().collection('employee').find({});
  var list = [];
  cursor.toArray(function (err, result) {
    if (result.length != 0) {
      for (var i = 0; i < result.length; i++) {
        var data = {
          WorkerNumber: result[i].WorkerNumber,
          Name: result[i].Name
        }
        list[i] = data;
      }
      res.send(list);
    } else {
      console.log("There are no matching data in Collection");
    }
  });
});

/* Logout Button */

app.put('/logout', function (req, res) {
  if (req.cookies.user != null) {
    res.clearCookie("user").send();
  }
});

/* Information Send */

app.get('/employeeTable', async function (req, res) {
  var cursor = await db.database().collection('employee').find({});
  cursor.toArray(function (err, result) {
    var list = [];
    if (result.length != 0) {
      for (var i = 0; i < result.length; i++) {
        var data = {
          WorkerNumber: result[i].WorkerNumber,
          Name: result[i].Name,
          DepartmentCode: result[i].DepartmentCode,
          PositionCode: result[i].PositionCode
        };
        list[i] = data;
      }
      res.send(list);
    }
    else {
      console.log("There are no matching data in Collection");
    }
  });
});

/* Account Stuff Inforamtion */

app.get('/stuffTable', async function (req, res) {
  var cursor = await db.database().collection('stuffList').find({ AccountName: req.query.AccountName });
  cursor.toArray(function (err, result) {
    var list = [];
    if (result.length != 0) {
      for (var i = 0; i < result.length; i++) {
        var data = {
          StuffName: result[i].StuffName,
          StuffPrice: result[i].StuffPrice
        }
        list[i] = data;
      }
      res.send(list);
    } else {
      console.log("There are no matching data in Collection");
    }
  });
});

/* Account Information Send */

app.get('/accountTable', async function (req, res) {
  var result = await accountDB.getAccountTable();
  res.send(result);
});

/* Revise function */

app.get('/revise', function (req, res) {
  var cursor = db.database().collection('employee').find({ WorkerNumber: req.query.employeeNumber });
  cursor.toArray(function (err, result) {
    res.send(result);
  });
});

/* Account Registration and Modification */

app.post('/accountInform', function (req, res) {
  var cursor = db.database().collection('account').find({ AccountName: req.body.AccountName });
  cursor.toArray(function (err, result) {
    if (result.length != 0) {
      db.database().collection('changeLog').insertOne(UpdateData.updateData(result[0], req.body, result[0]._id, "account", req.cookies.user));
      db.database().collection('account').updateMany(
        result[0],
        {
          $set: req.body,
          $currentDate: { FormModifiedDate: true }
        },
        { upsert: true }
      );
    } else {
      db.database().collection('account').insertOne(req.body);
    }
  });
  res.send();
});

/* Cookie Value */

app.get('/cookieValue', function (req, res) {
  res.send({ employeeNumber: req.cookies.user });
});

/* FormWriterName */

app.get('/formWriterName', function (req, res) {
  var cursor = db.database().collection('employee').find({ WorkerNumber: req.query.EmployeeNumber });
  cursor.toArray(function (err, result) {
    res.send({ FormWriterName: result[0].Name });
  });
});

/* Account Information Send */

app.get('/accountRevise', function (req, res) {
  var cursor = db.database().collection('account').find({ AccountName: req.query.AccountName });
  cursor.toArray(function (err, result) {
    var data = {
      AccountName: result[0].AccountName,
      AccountTel: result[0].AccountTel,
      EmployeeNumber: result[0].EmployeeNumber,
      AccountEmployeeName: result[0].AccountEmployeeName,
      AccountEmployeeTel: result[0].AccountEmployeeTel
    }
    res.send(data);
  });
});

/* Order Receive */

app.post('/receiveStuff', function (req, res) {
  var elements = req.body[req.body.length - 1];
  for (var i = 0; i < req.body.length - 1; i++) {
    elements[req.body[i].StuffName] = req.body[i];
  }
  db.database().collection('receiveList').insertOne(elements);
  res.send();
});

/* OrderPrint */

app.post('/orderStuff', function (req, res) {
  console.log(req.body[req.body.length - 1]);
  var elements = req.body[req.body.length - 1];
  for (var i = 0; i < req.body.length - 1; i++) {
    elements[req.body[i].StuffName] = req.body[i];
  }
  db.database().collection('orderList').insertOne(elements);
  res.send();
});

app.get('/searchdata', async function (req, res) {
  //db.collection이름.createIndex({ "$**": "text" },{ name: "TextIndex" });
  var result = await db.database().collection('account').aggregate([
    {
      '$match': {
        'EmployeeNumber': req.cookies.user,
        '$text': { '$search': req.query.Searchdata }
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

  res.send(result);
});
app.get('/searchdataE', function (req, res) {
  //db.collection이름.createIndex({ "$**": "text" },{ name: "TextIndex" });
  var searchcursor = db.database().collection('employee').find({ $text: { $search: req.query.Searchdata } });
  var list = [];
  searchcursor.toArray(function (err, result) {
    if (result.length != 0) {
      for (var i = 0; i < result.length; i++) {
        var data = {
          WorkerNumber: result[i].WorkerNumber,
          Name: result[i].Name,
          DepartmentCode: result[i].DepartmentCode,
          PositionCode: result[i].PositionCode
        }
        list[i] = data;
      }
      res.send(list);
    } else {
      console.log("There are no matching data in Collection");
    }
  });
});

/* Server Port */

http.listen(3000, function () {
  console.log("listening on *: 3000");
});