angular.module('controllers',[])
.controller('loginCtrl', function ($scope,$rootScope,$cordovaImagePicker,$state,$q,$ionicPopup,$ionicLoading,UserService){
  //checks for authresponse

    var PompipiSync = function (authResponse) {
    getFacebookProfileInfo(authResponse).then(function (resp){
                  console.log(JSON.stringify(resp));
                     UserService.facebookSignIn(resp).then(function (resp){
                      console.log(JSON.stringify(resp));
                        if(resp.user_id!=null){
                          $rootScope.loggedinUser=resp;
                          console.log($rootScope.loggedinUser);
                          localStorage.setItem("pomuser",JSON.stringify($rootScope.loggedinUser));
                        }
                      

                      })
                  })
    $state.go('main.home');

  }
  var fbLoginSuccess = function(response) {
    if (!response.authResponse){
      fbLoginError("Cannot find the authResponse");
      return;
    } else if(response.authResponse){
      console.log("logged in to facebook");
      PompipiSync(response.authResponse);
    }
/*
    var authResponse = response.authResponse;

    getFacebookProfileInfo(authResponse)
    .then(function(profileInfo) {
      // For the purpose of this example I will store user data on local storage
      console.log(profileInfo);

      UserService.setuser({
        authResponse: authResponse,
        userID: profileInfo.id,
        name: profileInfo.name,
        email: profileInfo.email,
        picture : "http://graph.facebook.com/" + authResponse.userID + "/picture?type=large"
      });*/
      $ionicLoading.hide();
      $state.go("main.home");
/*
      UserService.getuser().then(function (resp){
        console.log("fb-user ="+resp);
        $rootScope.loggedinUser=resp;
      })
      $state.go('main.home');
    }, function(fail){
      // Fail get profile info
      console.log('profile info fail', fail);
    });*/
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
      //console.log(success.authResponse.userID);
        if(success.status == 'connected'){
         console.log("we are here");
        // The user is logged in and has authenticated your app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed request, and the time the access token
        // and signed request each expire
        PompipiSync(success.authResponse);
                
            } else if (success.status != 'connected'){
              console.log('login with Facebook');
              facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
            /* facebookConnectPlugin.login(['email','accessToken','name'], function (success){
                 getFacebookProfileInfo(success.authResponse).then(function (resp){
                  console.log(JSON.stringify(resp));
                     UserService.facebookSignIn(resp).then(function (resp){
                        if(resp.user_id!=null){
                          $rootScope.loggedinUser=resp;
                          localStorage.setItem("pomuser",JSON.stringify($rootScope.loggedinUser));
                        }
                      

                      })
                  })
*/
              }
            },


                function (fail){
              var noFacebook = $ionicPopup.alert(
              {
                title:"Facebook Login Failed",
                template:"Unable to login via Facebook."
              }
                );
              noFacebook.then(function (resp){
                console.log("facebook login fail");
              })

              });
             
            
}
            
          

        $scope.facebookSignOut = function () {
          facebookConnectPlugin.logout(function (resp){
            console.log("logged out");
          },function (resp){
            console.log("fail to log out");

          })


        }

  $scope.signup=false;

  $scope.user={};
  $scope.showSignUp = function () {
    $scope.signup=!$scope.signup;
  }

  $scope.setAvatar = function () {
    var options={
      maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
                width: 400,
                height: 400,
                quality: 90 
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
  $scope.normalLogin = function () {
    
    UserService.normalLogin($scope.user).then(function (resp){
      if (resp.user_id){

        $rootScope.loggedinUser=resp;
        console.log($rootScope.loggedinUser);
        localStorage.setItem("pomuser",JSON.stringify($rootScope.loggedinUser));
        $state.go('main.home');

      } else if (resp=="user not found"||!resp.user_id){
        var loginFail = $ionicPopup.alert({
          title:"Login Failed",
          template:"Incorrect Password, username or user not found."
        });

        loginFail.then(function (resp){
          console.log("normal login failed.");
        })
      }
      
      //console.log(resp);
   // })

  })
}
  $scope.normalSignUp = function () {
    UserService.normalSignUp($scope.user),then(function (resp){

      console.log(resp);
    })

  }
  $scope.goDownload = function () {
    $state.go('purchase');
  }


})
.controller('mainCtrl',function ($scope,$rootScope,$ionicPopup,$state,UserService,PaypalService, $cordovaInAppBrowser,$ionicModal,$ionicHistory,$ionicSideMenuDelegate,accountsServices){

  $scope.toggleMenu = function () {
    $ionicSideMenuDelegate.toggleLeft();
  }
	
	$scope.haveBackView=false;

  if ($ionicHistory.backView!=null) {
    $scope.haveBackView=true;
  } else {
    $scope.haveBackView=false;
  }
	$scope.goBack= function () {
    $scope.cartmodal.hide();
  }
 
 var cart=localStorage.getItem("pomcart");
 if (cart==null){
  $rootScope.cart=[];
 } else {
  $rootScope.cart=JSON.parse(cart);
 }

 var shoppingCart = $ionicModal.fromTemplateUrl('templates/cart.html',{
   scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.cartmodal = modal;
  });
 

 $scope.backToMain= function (fromState) {
 
  $state.go ($rootScope.thisState);
  
 }

  $scope.openCart = function () {
      $scope.cartmodal.show();
       $scope.total=0;
      for (i=0;i<$rootScope.cart.length;i++){
    $scope.total+=$rootScope.cart[i].price;

  } 


  }
  $scope.removeItem = function (index){
    $scope.total =$scope.total-$rootScope.cart[index].price;
    $rootScope.cart.splice(index,1);
    localStorage.setItem("pomcart",JSON.stringify($rootScope.cart));

  }

  $scope.buyNow = function () { 
      PaypalService.initPaymentUI().then(function () { 
        PaypalService.makePayment($scope.total, "Total").then(function (resp){
          if(resp.response.state=="approved") {
            $scope.cartmodal.hide();
            $scope.cart=[];
            localStorage.setItem("pomcart",'[]');

            var SuccessfulBuy= $ionicPopup.alert({
              title: "Transaction successful",
              template:" Your books are on your Bookshelf."
            })

            
            var sale = {
              ref:resp.response.id,
              datetime:resp.response.create_time,
              products:$scope.cart,
              buyer:$rootScope.loggedinUser.user_id
            } 

            //update user's shelf in-app

            accountsServices.logSale(sale).then(function (resp){
              console.log(resp);

            })

              SuccessfulBuy.then(function (resp){
                localStorage.setItem('pomcart',"[]");
                $state.go('main.shelf');
              })
            //send user to bookshelf
          }else if (resp.response.state!="approved"){
                //direct user to a failed payment page
                 var UnsuccessfulBuy= $ionicPopup.alert({
              title: "Transaction unsuccessful",
              template:"Unable to process at the moment. Directing you back."
            })
                 UnsuccessfulBuy.then (function (resp){
                  $state.go('main.home');
                 })

            }
           /*
            accountsServices.logSale().then (function () {
              $state.go('main.bookshelf');
            })
          */
          
      console.log(JSON.stringify(resp));
     }); 
      })
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
  $scope.goToBook = function (ebook,fromState) {
    ebook.referrer=ebook.buyer.user_id;
    
    $state.go('book',{book:ebook,fromState:fromState});
    console.log(JSON.stringify(ebook));
  }

  $scope.goToUser = function (user){
    console.log(user);
    $rootScope.user=user;
    $state.go('main.user',{user:user});
  }

   $scope.doRefresh= function () {
     bookServices.getLatest().then(function(resp){
    console.log(resp);
    $scope.latestEbooks=resp;
  })

  bookServices.getWhosReading().then(function(resp){
    console.log(resp);
    $scope.whosReading=resp;
  })
  .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
    
  }
})
.controller('userCtrl',function ($scope,$state,$stateParams){
  
 // $scope.user=$state.params.user;
 // console.log($scope.user);

  $scope.goToBook=function (book,fromState){
    book.referrer=$state.params.user.user_id;
    book.product_id=book.ebook_id;
    book.buyer=$state.params.user;
    

    
    
    $state.go('book',{book:book, fromState:fromState});
    

  }


})

.controller('bookCtrl', function ($scope,$rootScope, $stateParams,$state,$ionicPopup,$ionicModal){
  
  var cart = localStorage.getItem("pomcart");

  if (cart==null) {
    $rootScope.cart=[];
  } else {
    //cart = JSON.parse(cart);
    $rootScope.cart=JSON.parse(cart);
  }

  //console.log(cart);
  $scope.thisEbook=$state.params.book;
  $rootScope.thisState=$state.params.fromState;
  console.log($scope.thisEbook);

  $ionicModal.fromTemplateUrl('templates/comments.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.buy=function (book) {
    var confirmBuy= $ionicPopup.confirm({
      title:"Add to Cart",
      template:'Confirm add to cart?'
    }
      );
    confirmBuy.then(function (res){
      if (res) {
        var thisbook={
          "name":book.name,
          "author":book.author,
          "quantity":1,
          "currency":"SGD",
          "price":parseFloat(book.price),
          "sku":book.product_id+"-"+"20161007",
          "product_id":book.product_id,
          "referrer":book.referrer,
          "buyer":$rootScope.loggedinUser.user_id
        }
        console.log(thisbook);

          var books_index = $rootScope.cart.map(function (eb){
            return eb.product_id;
          } )

          var isInCart = books_index.indexOf(thisbook.product_id);
           if (isInCart== -1){
            $rootScope.cart.push(thisbook);
          } else {
            var InCartMsg = $ionicPopup.alert({
              title:"Cart Status",
              template:"Item already in cart."
            });
            inCartMsg.then(function (resp){
              console.log("item in cart already");
            })
          }
      
      //console.log(josn.stringify(cart));
      localStorage.setItem("pomcart",JSON.stringify($rootScope.cart));
      console.log(JSON.stringify($rootScope.cart));
     // $state.go('cart',{cart:$rootScope.cart});
      } else {
       // console.log("cancelled")
      }
      
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
        console.log(event);
      })
      .catch(function(event) {
        // error
         console.log('error');
         console.log(event);
      });
  }

   $scope.backToApp= function () {
    $cordovaInAppBrowser.close();
   } 

$scope.paypalPay = function () {

  PaypalService.initPaymentUI().then(function () {

PaypalService.makePayment(90, 'Total Amount').then(function (response) {

alert('success'+JSON.stringify(response));
console.log(response);
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

.controller('shelfCtrl',function ($scope,$rootScope,$state,$ionicPopup,$ionicLoading,$cordovaInAppBrowser,UserService,$cordovaDevice,$cordovaFile,$cordovaFileTransfer,$cordovaFileOpener2){
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
console.log(JSON.stringify($rootScope.loggedinUser));
//$scope.eBooks=$rootScope.loggedinUser.ebooks;
console.log(JSON.stringify($scope.eBooks));
UserService.getEbooks($rootScope.loggedinUser.user_id).then (function (resp){

  console.log(JSON.stringify(resp));
  $scope.eBooks=resp;
})

var openEBook = function (ebook,filetype) {
      if (filetype=="epub") {
        $cordovaFileOpener2.open(
        ebook,
        'application/epub+zip'
      ).then(function() {
          // file opened successfully
      }, function(err) {
          // An error occurred. Show a message to the user
      });
      } else if (filetype=="pdf"){
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

    var downloadEBook = function (ebook,filename) {
      var url = "http://learnandearn123.com/apis/assets/pdfs/"+filename;
      var trustHosts = true;
      var options = {};

      $ionicLoading.show({
      template:"downloading..."
    });
          $cordovaFileTransfer.download(url, ebook, options, trustHosts)
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
         $state.go('main.shelf');
      });

    }
$scope.readEbook = function (filename,filetype) {
  
  var platform= $cordovaDevice.getPlatform();

    
  if (platform == "iOS") {
     var ebook = cordova.file.documentsDirectory+filename;

     $cordovaFile.checkFile(cordova.file.documentsDirectory,filename).then(function (success){
      //file exist
      openEBook(ebook,filetype);
      
     }, function (error){
        downloadEBook(ebook,filename);
        
      })
   }


     
 else if (platform=="Android") {
   var ebook = cordova.file.externalDataDirectory+filename;
  $cordovaFile.checkFile(cordova.file.externalDataDirectory,filename).then(function (success){
      //file exist
      openEBook(ebook,filetype);
     }, function (error){
          downloadEBook(ebook,filename);

     })
  
   console.log(ebook);
  }
  
  
  }



$scope.doRefresh = function() {
    UserService.getEbooks($rootScope.loggedinUser.user_id).then (function (resp){

  console.log(resp);
  $scope.eBooks = resp;
})
     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };
  
})
.controller('cartCtrl', function (PaypalService,$rootScope,$scope,$cordovaInAppBrowser,$state,accountsServices,$ionicPopup,$ionicHistory){

 
  var items=$state.params.cart;
  $scope.cart=$state.params.cart;
  console.log(items);
  $scope.total=0;
  for (i=0;i<items.length;i++){
    $scope.total+=items[i].price;

  } 

  
  

  $scope.back= function () {
   $state.go('main.home');
  }
  })
.filter('monthName', [function() {
    return function (monthNumber) { //1 = January
        var monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
        return monthNames[monthNumber - 1];
    }
}]);

