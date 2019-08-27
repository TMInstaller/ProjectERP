
/* Module */

var app = angular.module('ProjectApp', []);


app.config(function ($locationProvider) {
  $locationProvider.html5Mode({ enabled: true, requireBase: false });
});

/* 복사 제한 Directive */

app.directive('stopccp', function () {
  return {
    scope: {},
    link: function (scope, element) {
      element.on('cut copy paste', function (event) {
        event.preventDefault();
      });
    }
  };
});

/* HTML 분리 Directive */



/* 숫자 입력 Directive */

/* 사원 등록 및 수정 Controller */

app.controller('informationControl', function ($scope, $http, $filter, $location) {

  $scope.paywardform = ["연봉", "계약"];
  $scope.manageform = ["생산직", "사무직"];
  $scope.selectform = ["유", "무"];
  $scope.careerform = ["신입", "경력"];
  $scope.genderform = ["남", "여"];
  $scope.nationalityform = ["내국인", "외국인"];

  $scope.check = function () {
    if ($scope.nationalityForm == "외국인") {
      $scope.nationality = false;
    } else {
      $scope.nationality = true;
    }
  }

  $scope.date = function () {
    var birthDate = $filter('date')($scope.birthDate, "yyMMdd");
    $scope.frontRegistNum = birthDate;
  }

  $scope.findAddress = function () {
    new daum.Postcode({
      oncomplete: function (data) {
        var addr = '';
        var extraAddr = '';

        if (data.userSelectedType === 'R') {
          addr = data.roadAddress;
        } else {
          addr = data.jibunAddress;
        }

        if (data.userSelectedType === 'R') {
          if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          if (data.buildingName !== '' && data.apartment === 'Y') {
            extraAddr += (extraAddr !== '' ? '-' + data.buildingName : data.buildingName);
          }
          if (extraAddr !== '') {
            extraAddr = ' (' + extraAddr + ')';
          }
          $scope.extraAddress = extraAddr;

        } else {
          $scope.extraAddress = '';
        }

        $scope.addressNum = data.zonecode;
        $scope.address = addr;
      }
    }).open();
  }

  /* 사원 등록 */

  $scope.send = function () {

    var phoneNumber = $scope.frontPhoneNum + '-' + $scope.middlePhoneNum + '-' + $scope.lastPhoneNum;
    var registrationNumber = $scope.frontRegistNum + '-' + $scope.backRegistNum;
    var address = $scope.address + ',' + $scope.detailedAddress + ',' + $scope.extraAddress;
    var joinDate = $filter('date')($scope.joinDate, "yyyy-MM-dd");
    var probationDate = $filter('date')($scope.probationDate, "yyyy-MM-dd");
    var retireSettleDate = $filter('date')($scope.retireSettleDate, "yyyy-MM-dd");
    var retireDate = $filter('date')($scope.retireDate, "yyyy-MM-dd");
    var birthDate = $filter('date')($scope.birthDate, "yyyy-MM-dd");
    var data = {
      WorkerNumber: $scope.worknum,
      Password: $scope.password,
      Name: $scope.koreanName,
      EnglishName: $scope.englishName,
      ChineseName: $scope.chineseName,
      DepartmentCode: $scope.departmentCode,
      PositionCode: $scope.positionCode,
      Payward: $scope.paywardForm,
      Manage: $scope.manageForm,
      Insurance: $scope.insuranceForm,
      Career: $scope.careerForm,
      Congregation: $scope.congregationForm,
      Gender: $scope.genderForm,
      Nationality: $scope.nationalityForm,
      NationalityCode: $scope.nationalityCode,
      TaxDeclaration: $scope.taxForm,
      JoinDate: joinDate,
      ProbationDate: probationDate,
      RetireSettlementDate: retireSettleDate,
      RetireDate: retireDate,
      RetireCode: $scope.retireCode,
      BirthDate: birthDate,
      RegistrationNumber: registrationNumber,
      PhoneNumber: phoneNumber,
      Email: $scope.email,
      AddressNumber: $scope.addressNum,
      Address: address
    };
    if ($scope.informationForm.$invalid == false) {
      $http.post("/Registersubmit", JSON.stringify(data)).then(function (res) {
        if ($location.search().employeeNumber != null) {
          location.href = '/inquiry';
        } else {
          location.href = '/';
        }
      });
    } else {
      alert("양식을 다 작성해주십시오.");
    }
  };

  /* 사원 정보 수정 */

  if ($location.search().employeeNumber != null) {
    $scope.en = true;
    $scope.pw = true;
    $http({
      url: '/revise',
      method: 'GET',
      params: { employeeNumber: $location.search().employeeNumber }
    }).then(function (res) {
      var registNumber = res.data[0].RegistrationNumber.split('-');
      var phoneNumber = res.data[0].PhoneNumber.split('-');
      var address = res.data[0].Address.split(',');
      var joinDate = new Date(res.data[0].JoinDate);
      var probationDate = new Date(res.data[0].ProbationDate);
      var retireSettleDate = new Date(res.data[0].RetireSettlementDate);
      var retireDate = new Date(res.data[0].RetireDate);
      var birthDate = new Date(res.data[0].BirthDate);

      $scope.worknum = res.data[0].WorkerNumber;
      $scope.password = res.data[0].Password;
      $scope.koreanName = res.data[0].Name;
      $scope.englishName = res.data[0].EnglishName;
      $scope.chineseName = res.data[0].ChineseName;
      $scope.departmentCode = res.data[0].DepartmentCode;
      $scope.positionCode = res.data[0].PositionCode;
      $scope.paywardForm = res.data[0].Payward;
      $scope.manageForm = res.data[0].Manage;
      $scope.insuranceForm = res.data[0].Insurance;
      $scope.careerForm = res.data[0].Career;
      $scope.congregationForm = res.data[0].Congregation;
      $scope.genderForm = res.data[0].Gender;
      $scope.nationalityForm = res.data[0].Nationality;
      $scope.nationalityCode = res.data[0].NationalityCode;
      $scope.taxForm = res.data[0].TaxDeclaration;
      $scope.joinDate = joinDate;
      $scope.probationDate = probationDate;
      $scope.retireSettleDate = retireSettleDate;
      $scope.retireDate = retireDate;
      $scope.retireCode = res.data[0].RetireCode;
      $scope.birthDate = birthDate;
      $scope.frontRegistNum = registNumber[0];
      $scope.backRegistNum = registNumber[1];
      $scope.frontPhoneNum = phoneNumber[0];
      $scope.middlePhoneNum = phoneNumber[1];
      $scope.lastPhoneNum = phoneNumber[2];
      $scope.email = res.data[0].Email;
      $scope.addressNum = res.data[0].AddressNumber;
      $scope.address = address[0];
      $scope.detailedAddress = address[1];
      $scope.extraAddress = address[2];
    });
  } else {
    $scope.en = false;
    $scope.pw = false;
  }

  /* 취소 버튼 */

  $scope.cancel = function () {
    if ($location.search().employeeNumber != null) {
      location.href = '/inquiry';
    } else {
      location.href = '/';
    }
  };
});

/* Confirm Password */

app.directive("compareTo", function () {
  return {
    require: "ngModel",
    scope: {
      confirmPw: "=compareTo"
    },
    link: function (scope, element, attributes, ngModel) {
      ngModel.$validators.compareTo = function (value) {
        return value == scope.confirmPw;
      };
      scope.$watch("confirmPw", function () {
        ngModel.$validate();
      });
    }
  };
});

/* 로그인 Controller */

app.controller('loginControl', function ($scope, $http) {

  $scope.switch = false;
  $scope.Vis = false;
  $scope.login = function () {
    $scope.switch = true;
    var data = {
      EmployeeNumber: $scope.ID,
      Password: $scope.PW
    };
    $http.post('/login', JSON.stringify(data)).then(function (res) {
      if (res.data.Login == true) {
        location.href = '/';
      } else {
        alert("Wrong ID or password");
        $scope.switch = false;
        $scope.Vis = true;
      }
    });
  };
});

/* 메인 Controller */

app.controller('mainControl', function ($scope, $http) {
  $scope.logout = function () {
    $http.put('/logout').then(function (res) {
      location.href = '/';
    });
  }

});

/* 사원 조회 Controller */

app.controller('inquiryControl', function ($scope, $http) {

  $http.get('/employeeTable').then(function (res) {
    $scope.employees = res.data;
  });
  $scope.revise = function (index) {
    location.href = '/inform?employeeNumber=' + $scope.employees[index].WorkerNumber;
  }
  $scope.searchdata = function () {
    var data = {
      Searchdata: $scope.search//?
    };
    $http({
      url: '/searchdataE',
      method: 'GET',
      params: data
    }).then(function (res) {
      $scope.employees = res.data;
    });
  };
});

/* 거래처 등록 및 수정 Controller */

app.controller('accountControl', function ($scope, $http, $location) {

  $scope.Visible = false;
  var employeeNum;
  var formWriterName;
  var formModifierName;
  $http({
    url: '/accountManagerSelect',
    method: 'GET'
  }).then(function (res) {
    $scope.employees = res.data;
  });
  $scope.manageCheck = {
    value: true
  };
  $scope.check = function () {
    if ($scope.manageCheck.value) {
      $scope.Visible = false;
    } else {
      $scope.Visible = true;
    }
  }
  if ($location.search().employeeNumber != null) {
    $http({
      url: '/formWriterName',
      method: 'GET',
      params: { EmployeeNumber: $location.search().employeeNumber }
    }).then(function (res) {
      if ($location.search().accountName != null) {
        formModifierName = res.data.FormWriterName;
      } else {
        formWriterName = res.data.FormWriterName;
      }
    });
  }
  if ($location.search().accountName != null) {
    $http({
      url: '/accountRevise',
      method: 'GET',
      params: { AccountName: $location.search().accountName }
    }).then(function (res) {
      var accountTel = res.data.AccountTel.split('-');
      var accountEmployeeTel = res.data.AccountEmployeeTel.split('-');
      if (res.data.EmployeeNumber == $location.search().employeeNumber) {
        $scope.manageCheck = {
          value: true
        };
      } else {
        $scope.manageCheck = {
          value: false
        };
        $scope.Visible = true;
        $scope.employee = res.data.EmployeeNumber;
      }
      $scope.accountName = res.data.AccountName;
      $scope.accountTel_1 = accountTel[0];
      $scope.accountTel_2 = accountTel[1];
      $scope.accountTel_3 = accountTel[2];
      $scope.accountEmployeeName = res.data.AccountEmployeeName;
      $scope.accountEmployeeTel_1 = accountEmployeeTel[0];
      $scope.accountEmployeeTel_2 = accountEmployeeTel[1];
      $scope.accountEmployeeTel_3 = accountEmployeeTel[2];
    });
  }
  $scope.sendAccount = function () {
    var accountTel = $scope.accountTel_1 + "-" + $scope.accountTel_2 + "-" + $scope.accountTel_3;
    var accountEmployeeTel = $scope.accountEmployeeTel_1 + "-" + $scope.accountEmployeeTel_2 + "-" + $scope.accountEmployeeTel_3;
    var data;
    if ($scope.manageCheck.value) {
      employeeNum = $location.search().employeeNumber;
    } else {
      employeeNum = $scope.employee;
    }
    data = {
      AccountName: $scope.accountName,
      AccountTel: accountTel,
      EmployeeNumber: employeeNum,
      AccountEmployeeName: $scope.accountEmployeeName,
      AccountEmployeeTel: accountEmployeeTel,
      FormWriterName: formWriterName,
    }

    $http.post('/accountInform', JSON.stringify(data)).then(function (res) {
      location.href = '/accountInquiry';
    });
  };
});

/* 거래처 관련 Controller */

app.controller('accountInquiryControl', function ($scope, $http, $location) {

  $http.get('/accountTable').then(function (res) {
    $scope.accounts = res.data;
  });
  $scope.accountRegister = function () {
    $http({
      url: '/cookieValue',
      method: 'GET'
    }).then(function (res) {
      location.href = '/accountInquiry/account?employeeNumber=' + res.data.employeeNumber;
    });
  }
  $scope.searchdata = function () {
    var data = {
      Searchdata: $scope.search//?
    };
    $http({
      url: '/searchdata',
      method: 'GET',
      params: data
    }).then(function (res) {
      $scope.accounts = res.data;
    });
  };
  $scope.orderReceive = function (index) {
    location.href = '/accountInquiry/orderReceive?accountName=' + $scope.accounts[index].AccountName;
  }

  $scope.orderPrint = function (index) {
    location.href = '/accountInquiry/orderPrint?accountName=' + $scope.accounts[index].AccountName;
  }

  /* 거래처 수정 */

  $scope.account_revise = function (index) {
    $http({
      url: '/cookieValue',
      method: 'GET'
    }).then(function (res) {
      location.href = '/accountInquiry/account?employeeNumber=' + res.data.employeeNumber + '&accountName=' + $scope.accounts[index].AccountName;
    });
  }
});

/* 수주 Controller */

app.controller('receiveControl', function ($scope, $http, $location) {
  $scope.sellStuffs = [];
  if ($location.search().accountName != null) {
    $http({
      url: '/stuffTable',
      method: 'GET',
      params: { AccountName: $location.search().accountName }
    }).then(function (res) {
      $scope.stuffs = res.data;
    });
  }
  $scope.receive = function (index) {
    $scope.finalPrice = 0;
    $scope.sellStuffs[index] = {
      StuffName: $scope.stuffs[index].StuffName,
      StuffPrice: $scope.stuffs[index].StuffPrice,
      StuffCount: $scope.stuffs[index].StuffAmount,
      AllStuffPrice: $scope.stuffs[index].StuffPrice * $scope.stuffs[index].StuffAmount
    }
    for (var i = 0; i < $scope.sellStuffs.length; i++) {
      $scope.finalPrice += ($scope.stuffs[i].StuffPrice * $scope.stuffs[i].StuffAmount);
    }
  }
  $scope.finalReceive = function () {
    var list = [];
    for (var i = 0; i < $scope.sellStuffs.length; i++) {
      var data = {
        StuffName: $scope.sellStuffs[i].StuffName,
        StuffCount: $scope.sellStuffs[i].StuffCount,
        AllStuffPrice: $scope.sellStuffs[i].AllStuffPrice
      };
      list[i] = data;
    }
    list[$scope.sellStuffs.length] = { AccountName: $location.search().accountName, finalPrice: $scope.finalPrice }

    $http.post('/receiveStuff', list).then(function (res) {
      location.href = '/';
    });
  }
});

/* 발주 Controller */

app.controller('printControl', function ($scope, $http, $location) {
  var list = [];
  var count = 0;

  $scope.finalPrice = 0;
  $scope.order = function () {
    var allStuffPrice = ($scope.stuffPrice * $scope.stuffCount);
    var data = {
      StuffPrice: $scope.stuffPrice,
      StuffCount: $scope.stuffCount,
      AllStuffPrice: allStuffPrice
    };
    $scope.finalPrice += ($scope.stuffPrice * $scope.stuffCount);
    list[count] = data
    $scope.stuffs = list;
    count++;
  }
  $scope.delete = function (index) {
    $scope.stuffs.splice(index, 1);
  };
  $scope.finalOrder = function () {
    var list = [];
    if ($scope.stuffs != null) {
      for (var i = 0; i < $scope.stuffs.length; i++) {
        var data = {
          StuffCount: $scope.stuffs[i].StuffCount,
          AllStuffPrice: $scope.stuffs[i].AllStuffPrice
        };
        list[i] = data;
      }
      list[$scope.stuffs.length] = {
        AccountName: $location.search().accountName
      }
      $http.post('/orderStuff', list).then(function (res) {
        location.href = '/';
      });
    } else {
      alert("발주하실 물품들을 입력해주십시오.");
    }
  }
});

/* Buckket List */

app.controller('buckketList', function ($scope, $http, $location) {

});