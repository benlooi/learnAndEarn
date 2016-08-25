angular.module('controllers',[])
.controller('loginCtrl', function ($scope,$rootScope,$cordovaImagePicker,$state,$q,$ionicLoading,UserService){
  
  var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
      return;
    } else if(response.authResponse){
      console.log("logged in to facebook");
      $state.go('main.home');
    }

    var authResponse = response.authResponse;

    getFacebookProfileInfo(authResponse)
    .then(function(profileInfo) {
      // For the purpose of this example I will store user data on local storage
      console.log(profileInfo);
      UserService.setUser({
        authResponse: authResponse,
        userID: profileInfo.id,
        name: profileInfo.name,
        email: profileInfo.email,
        picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
      });
      $ionicLoading.hide();
      UserService.getUser().then(function (resp){
        console.log("fb-user ="+resp);
        $rootScope.loggedinUser=resp;
      })
      $state.go('main.home');
    }, function(fail){
      // Fail get profile info
      console.log('profile info fail', fail);
    });
  };

  // This is the fail callback from the login method
  var fbLoginError = function(error){
    console.log('fbLoginError', error);
    $ionicLoading.hide();
  };

  // This method is to get the user profile info from the facebook api
  var getFacebookProfileInfo = function (authResponse) {
    var info = $q.defer();

    facebookConnectPlugin.api('/me?fields=email,name&access_token=' + authResponse.accessToken, null,
      function (response) {
        console.log(response);
        info.resolve(response);
      },
      function (response) {
        console.log(response);
        info.reject(response);
      }
    );
    return info.promise;
  };

  //This method is executed when the user press the "Login with facebook" button
  $scope.facebookSignIn = function() {
   
    facebookConnectPlugin.getLoginStatus(function(success){
      console.log(JSON.stringify(success));
      if(success.status === 'connected'){
        // The user is logged in and has authenticated your app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed request, and the time the access token
        // and signed request each expire
      

        // Check if we have our user saved
        var user = UserService.getUser('facebook');
        console.log(JSON.stringify(user));
       
        if(!user.userID){
          getFacebookProfileInfo(success.authResponse)
          .then(function(profileInfo) {
            // For the purpose of this example I will store user data on local storage
            UserService.setUser({
              authResponse: success.authResponse,
              userID: profileInfo.id,
              name: profileInfo.name,
              email: profileInfo.email,
              picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"
            });
            $rootScope.loggedinUser={
              authResponse: success.authResponse,
              userID: profileInfo.id,
              name: profileInfo.name,
              email: profileInfo.email,
              picture : "http://graph.facebook.com/" + success.authResponse.userID + "/picture?type=large"


            }
            $state.go('main.home');
          }, function(fail){
            // Fail get profile info
            console.log('profile info fail', fail);
          });
        }else{
          $rootScope.loggedinUser=user;
          $state.go('main.home');
        }
      } else {
        // If (success.status === 'not_authorized') the user is logged in to Facebook,
        // but has not authenticated your app
        // Else the person is not logged into Facebook,
        // so we're not sure if they are logged into this app or not.

        console.log('getLoginStatus', success.status);

        $ionicLoading.show({
          template: 'Logging in...'
        });

        // Ask the permissions you need. You can learn more about
        // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
        facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
      }
    });
  };


  $scope.signup=false;

  $scope.user={};
  $scope.showSignUp = function () {
    $scope.signup=true;
  }

  $scope.setAvatar = function () {
    var options={
      maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
                width: 800,
                height: 800,
                quality: 80 
    }
    $cordovaImagePicker.getPictures(options).then(function(results){
      for (var i=0;i<results.length;i++){

        $scope.user.avatar=results[i];

        window.plugins.Base64.encodeFile($scope.user.avatar, function (base64){
          $scope.user.avatar=base64;

        })
      }
    })
  }

  $scope.goDownload = function () {
    $state.go('purchase');
  }


})
.controller('mainCtrl',function ($scope,$ionicPopup,$state,UserService,$cordovaInAppBrowser,PaypalService,$ionicSideMenuDelegate){

  $scope.toggleMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  }
	
	
	
 


})
.controller('homeCtrl', function ($rootScope,$scope,$state,bookServices,$stateParams,UserService){
console.log($rootScope.loggedinUser);

  bookServices.getLatest().then(function(resp){
    console.log(resp);
    $scope.latestEbooks=resp;
  })

  bookServices.getWhosReading().then(function(resp){
    console.log(resp);
    $scope.whosReading=resp;
  })
  $scope.goToBook = function (ebook) {
   
    $state.go('main.book',{book:ebook});
    console.log(ebook);
  }

  $scope.goToUser = function (user){
    console.log(user);
    $rootScope.user=user;
    $state.go('main.user',{user:user});
  }
})
.controller('userCtrl',function ($scope,$state,$stateParams){
  
 // $scope.user=$state.params.user;
 // console.log($scope.user);

  $scope.goToBook=function (book){
    book.buyer={};
    book.buyer.avatar=$scope.user.avatar;
    book.buyer.user_id=$scope.user.user_id;
    book.buyer.username=$scope.user.username;
    
    
    $state.go('main.book',{book:book});
    

  }
})

.controller('bookCtrl', function ($scope,$stateParams,$state,$ionicPopup,$ionicModal){
  $scope.thisEbook=$state.params.book;
  //console.log(ebook);

  $ionicModal.fromTemplateUrl('templates/comments.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.buy=function (book) {
    var confirmBuy= $ionicPopup.alert({
      title:"Add to Cart",
      template:'Confirm add to cart?'
    }
      );
    confirmBuy.then(function (res){
      console.log('buy it');
      $state.go('cart',{book:book});
    })
  }

    $scope.ratingsObject = {
        iconOn: 'ion-ios-star',    //Optional
        iconOff: 'ion-ios-star-outline',   //Optional
        iconOnColor: 'rgb(200, 200, 100)',  //Optional
        iconOffColor:  'rgb(200, 100, 100)',    //Optional
        rating:  2, //Optional
        minRating:1,    //Optional
        readOnly: true, //Optional
        callback: function(rating) {    //Mandatory
          $scope.ratingsCallback(rating);
        }
      };

      $scope.ratingsCallback = function(rating) {
        console.log('Selected rating is : ', rating);
      };


  $scope.rate=function () {
    $scope.modal.show();
  }

  $scope.submitComment = function () {

    $scope.modal.hide();
  }

  
  

  var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes'
    };


  $scope.payMoney=function () {
    $cordovaInAppBrowser.open('http://www.paypal.com', '_blank', options)
      .then(function(event) {
        // success
        console.log('success');
      })
      .catch(function(event) {
        // error
         console.log('error');
      });
  }

   $scope.backToApp= function () {
    $cordovaInAppBrowser.close();
   } 

$scope.paypalPay = function () {

  PaypalService.initPaymentUI().then(function () {

PaypalService.makePayment(90, 'Total Amount').then(function (response) {

alert('success'+JSON.stringify(response));
$state.go('main.home');

}, function (error) {

alert('Transaction Canceled');
$state.go('main.home');

});

});

}
})
.controller('usersCtrl', function ($rootScope,$scope,bookServices,$state,$stateParams){
  bookServices.getUsers().then(function (resp){
    $scope.users=resp;
  })

  $scope.goToUser= function (user){
    console.log(user);
    $rootScope.user=user;
    $state.go('main.user',{user:user});
  }
  
})
.controller('purchaseCtrl', function ($scope,$timeout,$cordovaFileTransfer,$ionicPopup,$ionicLoading,$cordovaFile,$cordovaDevice,$state){

  var platform= $cordovaDevice.getPlatform();
  console.log(platform);
	var url = "http://learnandearn123.com/apis/assets/pdfs/DOGBOV.epub";
  var filename = url.split("/").pop();
  localStorage.setItem("ebook",filename);
  //var filename="Learn_and_Earn_1-2-3.pdf";
if (platform=="iOS") {
   var targetPath = cordova.file.documentsDirectory+filename;
} else if (platform=="Android") {
   var targetPath = cordova.file.externalDataDirectory+filename;
}
   
    var trustHosts = true;
    var options = {};

	$scope.download = function () {
    console.log(targetPath);
    $ionicLoading.show({
      template:"downloading..."
    });

		$cordovaFileTransfer.download(url, targetPath, options, trustHosts)
      .then(function(result) {
        // Success!
        console.log("downloaded to "+result.toURL());
        $ionicLoading.hide();
        var dlPopup = $ionicPopup.alert({

        	title:'Download',
        	template:'Your eBook is downloaded.'
        });

        dlPopup.then(function(res){
          $state.go('main.shelf');

        });
      }, function(err) {
        // Error
        alert("not downloaded");
         $state.go('main.home');
      });
      

   }

})
.controller('earningsCtrl', function ($scope,accountsServices,$state){

  accountsServices.getUserBalance().then(function (resp){
    $scope.balance=resp;
    console.log(resp);
  })

  accountsServices.getUserTransactions().then(function (resp){

    $scope.transactions=resp;
    console.log(resp);
  })

  $scope.goToDetails = function (transaction){
    console.log(transaction);
    accountsServices.getTransactionDetails(transaction).then(function (resp){
      console.log(resp);
      $scope.tx=resp;
      $state.go('earnings_details',{tx:resp});
    })
  }
})
.controller('earningsDetailsCtrl', function ($scope,accountsServices,$state){

  console.log($state.params.tx);
  for(i=0;i<$state.params.tx.length;i++){
    //$state.params.tx[i].datetime=new Date($state.params.tx[i].datetime);
  }
  $scope.tx=$state.params.tx;

})

.controller('shelfCtrl',function ($scope,$cordovaInAppBrowser,$cordovaDevice,$cordovaFile,$cordovaFileOpener2){
 /* ebook=localStorage.getItem('ebook');
  ebooktype=ebook.split('.').pop();
  var platform= $cordovaDevice.getPlatform();
  if (platform == "iOS") {
     var ebook = cordova.file.documentsDirectory+ebook;
} else if (platform=="Android") {
   var ebook = cordova.file.externalDataDirectory+ebook;
   console.log(ebook);
  }
*/
$scope.readEbook = function (number) {
  
   ebook=localStorage.getItem('ebook');
  ebooktype=ebook.split('.').pop();
  console.log(ebook+" - "+ebooktype);
  var platform= $cordovaDevice.getPlatform();
  if (platform == "iOS") {
     var ebook = cordova.file.documentsDirectory+ebook;
} else if (platform=="Android") {
   var ebook = cordova.file.externalDataDirectory+ebook;
   console.log(ebook);
  }
  
  
  if (number=="2") {
    ebooktype=="epub";
    ebook=cordova.file.externalDataDirectory+"DOGBOV.epub";
      $cordovaFileOpener2.open(
        ebook,
        'application/epub+zip'
      ).then(function() {
          // file opened successfully
      }, function(err) {
          // An error occurred. Show a message to the user
      });
    } else if (number=="1") {
      ebook=cordova.file.externalDataDirectory+"Learn_and_Earn_1-2-3.pdf";
       $cordovaFileOpener2.open(
        ebook,
        'application/pdf'
      ).then(function() {
          // file opened successfully
      }, function(err) {
          // An error occurred. Show a message to the user
      });
    } 

}
  
})
.controller('cartCtrl', function (PaypalService,$rootScope,$scope,$cordovaInAppBrowser,$state){
  $scope.book=$state.params.book;
  $scope.total=10.0;
  $scope.buyNow = function () { PaypalService.initPaymentUI().then(function () { 
    PaypalService.makePayment($scope.total, "Total").then(); }); }
})
.filter('monthName', [function() {
    return function (monthNumber) { //1 = January
        var monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
        return monthNames[monthNumber - 1];
    }
}]);

