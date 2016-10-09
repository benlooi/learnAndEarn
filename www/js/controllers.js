angular.module('controllers',[])
.controller('loginCtrl', function ($scope,$rootScope,$cordovaImagePicker,Camera,$state,$jrCrop,$q,$ionicPopup,$ionicLoading,UserService){
  //checks for authresponse

    var PompipiSync = function (authResponse) {
    getFacebookProfileInfo(authResponse).then(function (resp){
                  console.log(JSON.stringify(resp));
                  resp.gcmRegID=localStorage.getItem('gcmRegID');
                     UserService.facebookSignIn(resp).then(function (res){
                      console.log(JSON.stringify(res));
                        if(res.user_id!=null){
                          $rootScope.loggedinUser=res;
                          
                          console.log(JSON.stringify($rootScope.loggedinUser));
                      /*    localStorage.setItem("pomuser",JSON.stringify($rootScope.loggedinUser));
                        var regID=localStorage.getItem('gcmRegID');
    UserService.setGCMRegID(regID,$rootScope.loggedinUser.user_id).then(function(resp){

      console.log(resp);
    });*/
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
      $ionicLoading.hide();
      $state.go("main.home");

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
   $ionicLoading.show({
    template:"<ion-spinner></ion-spinner><p>just a moment...</p>"
   });
    facebookConnectPlugin.getLoginStatus(function(success){
      console.log(success.status);
      //console.log(success.authResponse.userID);
        if(success.status == 'connected'){
          $ionicLoading.hide();
        // console.log("we are here");
        // The user is logged in and has authenticated your app, and response.authResponse supplies
        // the user's ID, a valid access token, a signed request, and the time the access token
        // and signed request each expire
        PompipiSync(success.authResponse);
                
            } else if (success.status != 'connected'){
              $ionicLoading.hide();
              console.log('login with Facebook');
              facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
            PompipiSync(success.authResponse);
              }
            },


                function (fail){
                  console.log(JSON.stringify(fail));
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
  //new image impletmetnation
  $scope.type = 'square';
            $scope.imageDataURI = '';
            $scope.dominantColor = [];
            $scope.resBlob = {};
            $scope.urlBlob = {};
            $scope.resImgSize = 200;
            $scope.paletteColor = '';
            $scope.paletteColorLength = 8;
            $scope.getBlob = function() {
                console.log($scope.resBlob);
            };
            var handleFileSelect = function(evt) {
                var file = evt.currentTarget.files[0],
                    reader = new FileReader();
                if(navigator.userAgent.match(/iP(hone|od|ad)/i) ) {
                    var canvas = document.createElement('canvas'),
                        mpImg = new MegaPixImage(file);
                    canvas.width = mpImg.srcImage.width;
                    canvas.height = mpImg.srcImage.height;
                    EXIF.getData(file, function() {
                        var orientation = EXIF.getTag(this, 'Orientation');
                        mpImg.render(canvas, {
                            maxHeight: $scope.resImgSize * 2,
                            orientation: orientation
                        }, function(){
                            var tt = canvas.toDataURL("image/jpeg", 1);
                            canvas.toBlob(function(blob) {
                                $scope.$apply(function($scope) {
                                    $scope.imageDataURI = blob;
                                });
                            });
                        });
                    });
                } else {
                    reader.onload = function(evt) {
                        $scope.$apply(function($scope) {
                            console.log(evt.target.result);
                            $scope.imageDataURI = evt.target.result;
                        });
                    };
                    reader.readAsDataURL(file);
                }
            };
            angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);


//end new image

 $scope.croppedDataUrl="";
 $scope.selectedImage="";


  


  $scope.setAvatar = function () {

    //imgaePicker method

    var options = {
      height:600,
      width:600,
      quality:80,
      maximumImagesCount:1
    }

    $cordovaImagePicker.getPictures(options).then(function (results){
      console.log("image URI : "+results[0]);
      var selectedImage=results[0];
      $jrCrop.crop({
        url:selectedImage,
        width:200,
        height:200,
        circle:true
      }).then(function (canvas){
        console.log(canvas);
        var croppedImage=canvas.toDataURL("image/jpeg",1);
        console.log(croppedImage);
       
        $scope.croppedDataUrl=croppedImage;
        
      })
     
      })
      


    
}
  $scope.normalLogin = function () {
    $ionicLoading.show({
    template:"<ion-spinner></ion-spinner><p>just a moment...</p>"
   });
    
    UserService.normalLogin($scope.user).then(function (resp){
      $ionicLoading.hide();
      if (resp.user_id){

        $rootScope.loggedinUser=resp;
        console.log($rootScope.loggedinUser);
        localStorage.setItem("pomuser",JSON.stringify($rootScope.loggedinUser));
       var regID=localStorage.getItem('gcmRegID');
       UserService.setGCMRegID(regID,$rootScope.loggedinUser.user_id).then(function(resp){
        console.log(resp);
       });
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
   $ionicLoading.show({
    template:"<ion-spinner></ion-spinner><p>just a moment...</p>"
   });
    var regID=localStorage.getItem('gcmRegID');
    $scope.user.avatar=$scope.croppedDataUrl;
    UserService.normalSignUp($scope.user,regID).then(function (resp){
      if (resp.user_id){
        $rootScope.loggedinUser=resp;
        $ionicLoading.hide();
        $state.go('main.home');

      } else if (!resp.user_id){
        $ionicLoading.hide();
        var FailSignUp = $ionicPopup.alert({
          title:"Sign Up Unsuccessful",
          template:"Unable to sign you up at the moment. Try again later?"
        });

        FailSignUp.then(function (resp){
          //done
        })
      }
      console.log(resp);
    })

  }
  $scope.usernameExists=false;
  $scope.checkUsernameExists = function () {
    UserService.checkUsernameExists($scope.user.username).then(function (resp){

      console.log(resp);
      if (resp=="username exists"){
      $scope.usernameExists=true;
      $scope.user.username=null;
      } else if (resp=="username not found"){

      $scope.usernameExists=false;
      }
    })
  }

  $scope.emailExists=false;
  $scope.resetEmailandUsername=function () {
    $scope.emailExists=false;
    $scope.usernameExists=false;


  }
  $scope.checkEmailExists = function () {
    UserService.checkEmailExists($scope.user.email).then(function (resp){

      console.log(resp);

      if (resp=="email exists"){
        $scope.emailExists=true;
        $scope.user.email=null;
      } else if (resp=="email not found"){

        $scope.emailExists=false;

        
      }
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
	
  UserService.getCountries().then(function (resp){
    $scope.countries=resp;
  })
	
  $scope.shipping={};

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

$scope.goToPage=function (page){
  $state.go(page);
  $scope.toggleMenu();
}
  
 
 $scope.showShippingAddress=true;
var physicalItemCheck = function () {
  var item_types= $rootScope.cart.map(function(item){
    if (item.type=="fashion"||item.type=="electronics"){
      return "physical";
    } else {
      return item.type;
    }
    
  });
console.log(JSON.stringify(item_types));
  var a = item_types.indexOf('physical');
  if (a!= -1){
    $scope.showShippingAddress=true;
  } else if (a== -1) {
    $scope.showShippingAddress=false;
  }
}
 $scope.backToMain= function (fromState) {
 
  $state.go ($rootScope.thisState);
  
 }

  $scope.openCart = function () {
    physicalItemCheck();
    console.log($rootScope.cart);
      $scope.cartmodal.show();
       $scope.total=0;
      for (i=0;i<$rootScope.cart.length;i++){
    $scope.total+=$rootScope.cart[i].price*$rootScope.cart[i].quantity;

  } 


  }
  $scope.removeItem = function (index){
    //find out if any physical item


    $scope.total =$scope.total-$rootScope.cart[index].price;
    $rootScope.cart.splice(index,1);
    localStorage.setItem("pomcart",JSON.stringify($rootScope.cart));
    physicalItemCheck();

  }

  $scope.increaseQty= function (index){
    $rootScope.cart[index].quantity++;
    $scope.total =$scope.total+$rootScope.cart[index].price;
    localStorage.setItem("pomcart",JSON.stringify($rootScope.cart));
  }

  $scope.decreaseQty= function (index){
    if ($rootScope.cart[index].quantity>1){
      $rootScope.cart[index].quantity--;
      $scope.total =$scope.total-$rootScope.cart[index].price;
      physicalItemCheck();
      localStorage.setItem("pomcart",JSON.stringify($rootScope.cart));
      
    }

   
     else if ($rootScope.cart[index].quantity==1){
      $rootScope.cart[index].quantity--;
      $scope.total =$scope.total-$rootScope.cart[index].price;
      $rootScope.cart.splice(index,1);
      physicalItemCheck();
      localStorage.setItem("pomcart",JSON.stringify($rootScope.cart));

     }
  }

  $scope.buyNow = function () { 
      PaypalService.initPaymentUI().then(function () { 
        PaypalService.makePayment($scope.total, "Total").then(function (resp){
          if(resp.response.state=="approved") {
            $scope.cartmodal.hide();
            
           // localStorage.setItem("pomcart",'[]');

            var SuccessfulBuy= $ionicPopup.alert({
              title: "Transaction successful",
              template:" Your items are on your Shelf and Page."
            })

            
            var sale = {
              ref:resp.response.id,
              datetime:resp.response.create_time,
              products:$rootScope.cart,
              buyer:$rootScope.loggedinUser.user_id,
              shipping:$scope.shipping
            } 

            //update user's shelf in-app



            accountsServices.logSale(sale).then(function (resp){
              console.log(resp);
              $rootScope.cart=[];
              if (resp=="transactions updated"){
                 UserService.updateUserEBooks($rootScope.loggedinUser.user_id).then(function(res){
                $scope.loggedinUser.ebooks=resp;
              })
              }
             

            }, function (err){
              console.log(err);
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
          
     // console.log(JSON.stringify(resp));
     }); 
      })
    }

    $scope.goBack = function () {
      $scope.cartmodal.hide();
    }

})
.controller('homeCtrl', function ($rootScope,$scope,$state,bookServices,productServices,$stateParams,UserService,$ionicLoading){
console.log($rootScope.loggedinUser);
$ionicLoading.show({
  template: "<ion-spinner></ion-spinner><p>just a moment...</p>"
});

  productServices.getElectronics().then(function(resp){
    $scope.Electronics=resp;
    console.log(resp);
  })
  productServices.getFashion().then(function(resp){
    $scope.Fashion=resp;
    console.log(resp);
  })

  productServices.getServices().then(function(resp){
    $scope.Services=resp;
    console.log(resp);
  })

  bookServices.getLatest().then(function(resp){
    $ionicLoading.hide();
    console.log(resp);
    $scope.latestEbooks=resp;
  })
  productServices.getLatestMusic().then(function(resp){
    
    console.log(resp);
    $scope.Music=resp;
  })

  UserService.getNewUsers().then(function(resp){
    console.log(resp);
    for (i=0;i<resp.length;i++){
      resp[i].following=JSON.parse(resp[i].following);
      resp[i].followers=JSON.parse(resp[i].followers);
    }
    $scope.newUsers=resp;
  })
  $scope.goToBook = function (ebook,fromState) {
    ebook.referrer=ebook.buyer.user_id;
    
    $state.go('book',{book:ebook,fromState:fromState});
    console.log(JSON.stringify(ebook));
  }

  $scope.goToUser= function (user){
    console.log(user);
    $rootScope.user=user;
    $rootScope.thisState="main.home";
    $state.go('user',{user:user,fromState:"main.home"});
  }
  $scope.showProduct =function(product,fromState) {
    product.referrer=product.buyer.user_id;
    
    $state.go('product',{product:product,fromState:fromState});
    console.log(JSON.stringify(product));
  }

  $scope.showServices =function(service,fromState) {
    service.referrer=service.buyer.user_id;
    
    $state.go('service',{service:service,fromState:fromState});
    console.log(JSON.stringify(service));
  }
$scope.showAlbum =function(album,fromState) {
    
    album.referrer=album.buyer.user_id;
   
    
    $state.go('music',{album:album,fromState:fromState});
    //console.log(JSON.stringify(product));
  }

   $scope.doRefresh= function () {
     productServices.getElectronics().then(function(resp){
    $scope.Electronics=resp;
    console.log(resp);
  })
  productServices.getFashion().then(function(resp){
    $scope.Fashion=resp;
    console.log(resp);
  })

  productServices.getServices().then(function(resp){
    $scope.Services=resp;
    console.log(resp);
  })

  bookServices.getLatest().then(function(resp){
    $ionicLoading.hide();
    console.log(resp);
    $scope.latestEbooks=resp;
  })

  productServices.getLatestMusic().then(function(resp){
    
    console.log(resp);
    $scope.Music=resp;
  })

  UserService.getNewUsers().then(function(resp){
    console.log(resp);
    for (i=0;i<resp.length;i++){
      resp[i].following=JSON.parse(resp[i].following);
      resp[i].followers=JSON.parse(resp[i].followers);
    }
    $scope.newUsers=resp;
  })
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
.controller('userCtrl',function ($scope,$rootScope,$state,$stateParams,$ionicLoading,UserService,$ionicPopup){
 
  //$scope.user=$state.params.user;
 // console.log($scope.user);

 UserService.getUserPurchasedItems($rootScope.user.user_id).then(function(resp){
  console.log(JSON.stringify(resp));
$rootScope.user.electronics=resp.electronics;
$rootScope.user.fashion=resp.fashion;
$rootScope.user.services=resp.services;
$rootScope.user.ebooks=resp.ebooks;
$rootScope.user.music=resp.music;

 }, function (err){
  console.log(err);
 });
 
  $scope.following=false;
  $rootScope.thisState=$state.params.fromState;
  console.log($state.params.fromState);
  /*var checkIfFollowing = function (){
    console.log(JSON.stringify($state.params.user));
    console.log($rootScope.loggedinUser.following);

    var following=$rootScope.loggedinUser.following;
    var in_list=following.indexOf(parseInt($state.params.user.user_id));
    if (in_list==-1){
      $scope.following=false;
    } else if (in_list>0) {
      $scope.following=true;
    }
  }

  checkIfFollowing();
*/
  $scope.goToBook=function (book,fromState){
    book.referrer=$state.params.user.user_id;
    book.product_id=book.ebook_id;
    book.buyer=$state.params.user;
    

    
    
    $state.go('book',{book:book, fromState:fromState});
    

  }
  $scope.showProduct =function(product,fromState) {
    product.referrer=$state.params.user.user_id;
    product.product_id=product.product_id;
    product.buyer=$state.params.user;
    
    $state.go('product',{product:product,fromState:fromState});
    //console.log(JSON.stringify(product));
  }

  $scope.showAlbum =function(album,fromState) {
    console.log('album clicked');
    album.referrer=$state.params.user.user_id;
    album.product_id=album.media_id;
    album.buyer=$state.params.user;
    
    $state.go('music',{album:album,fromState:fromState});
    //console.log(JSON.stringify(product));
  }

  $scope.showServices =function(service,fromState) {
    service.referrer=$state.params.user.user_id;
     service.product_id=service.service_id;
    service.buyer=$state.params.user;
    
    $state.go('service',{service:service,fromState:fromState});
    //console.log(JSON.stringify(product));
  }


  

  $scope.follow = function (user) {
    $ionicLoading.show();
    UserService.followUser($rootScope.loggedinUser.user_id,user).then(function(resp){
      console.log(resp);
        $ionicLoading.hide();
      if (resp=="following"){
        $rootScope.loggedinUser.following.push(user);


        var users=$rootScope.users.map(function (us){
          return us.user_id;
        });
        var thisuser=users.indexOf(user);
        $rootScope.users[thisuser].followers.push($rootScope.loggedinUser.user_id);
        

        var followMsg= $ionicPopup.alert(
            {
              title:"Follow",
              template:"You are now following "+$state.params.user.username
            }
          );

        followMsg.then(function(resp){
          //done
        })

      }
      $scope.following=true;
    })
  }

  $scope.unfollow = function (user){
    $ionicLoading.show();
    UserService.unfollowUser($rootScope.loggedinUser.user_id,user).then(function(resp){
      console.log(resp);
      var following=$rootScope.loggedinUser.following;
      var a=following.indexOf(user);
      following.splice(a,1);
      $rootScope.loggedinUser.following=following;

      var users=$rootScope.users.map(function (us){
        return us.user_id;
      });
      var thisuser=users.indexOf(user);
      var user_followers=$rootScope.users[thisuser].followers;
      var me=user_followers.indexOf($rootScope.loggedinUser.user_id);
      $rootScope.users[thisuser].followers.splice(me,1);


        $ionicLoading.hide();
      if (resp=="unfollowed"){

        var followMsg= $ionicPopup.alert(
            {
              title:"Unfollow",
              template:"You have unfollowed "+$state.params.user.username
            }
          );

        followMsg.then(function(resp){
          //done
        })

      }
    $scope.following=false;

  })

}




})

.controller('bookCtrl', function ($scope,$rootScope,$stateParams,$state,$ionicPopup,$ionicModal,bookServices,UserService){
  
  var cart = localStorage.getItem("pomcart");


  if (cart==null) {
    $rootScope.cart=[];
  } else {
    //cart = JSON.parse(cart);
    $rootScope.cart=JSON.parse(cart);
  }
$scope.factor=1;
  //console.log(cart);
  $scope.thisEbook=$state.params.book;
  

$scope.project= function (factor) {
  var Projections=[];
  for (i=0;i<$scope.thisEbook.commission.length;i++){

    var thisProjection=($scope.thisEbook.price*$scope.thisEbook.commission[i]*Math.pow(factor,i+1)).toFixed(2);
    console.log(thisProjection);
    Projections.push(thisProjection);
  }
  $scope.thisEbook.projections=Projections;
}

$scope.increaseFactor= function () {
  $scope.factor++;
  $scope.project($scope.factor);
  console.log($scope.thisEbook.projections);
}

$scope.decreaseFactor= function () {
  if ($scope.factor>0){
    $scope.factor--;
    $scope.project($scope.factor);

  }
  
}
$scope.project($scope.factor);
  
  $rootScope.thisState=$state.params.fromState;
  console.log($scope.thisEbook);
$scope.comment={};
$scope.comment.comment_by=$rootScope.loggedinUser.user_id;
$scope.comment.username=$rootScope.loggedinUser.username;
$scope.comment.facebookID=$rootScope.loggedinUser.facebookID;
$scope.comment.product_id=$scope.thisEbook.product_id;
$scope.comment.product_type="ebooks";

 $scope.showRewards=false;

  $scope.toggleRewards= function () {
    $scope.showRewards=!$scope.showRewards;
  }


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
      
          bookServices.checkUserAlreadyHave($rootScope.loggedinUser.user_id,book.product_id).then(function (resp){
            console.log(resp);
            if (resp=="already purchased"){
              var informUser = $ionicPopup.alert({

                title:"You have this Book",
                template:"You've already bought this book. Check your Shelf."
              });

              informUser.then(function (res){

              });
            } else if (resp=="not found") {

                  var thisbook={
                  "name":book.name,
                  "author":book.author,
                  "quantity":1,
                  "currency":"SGD",
                  "type":book.type,
                  "cart_id":book.type+"-"+book.product_id,
                  "price":parseFloat(book.price),
                  "sku":book.product_id+"-"+"20161007",
                  "product_id":book.product_id,
                  "referrer":book.referrer,
                  "purch_ref":book.purch_ref,
                  "buyer":$rootScope.loggedinUser.user_id
                  }
            console.log(thisbook);

          var books_index = $rootScope.cart.map(function (eb){
            return eb.type+"-"+eb.product_id;
          } )

          var isInCart = books_index.indexOf(thisbook.cart_id);
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
      } 
      
  
    }) //END BOOK SERVICES TO CHECK FOR BOOK
  })
  } //END SCOPEBUY

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
        $scope.comment.rating=rating;
        console.log('Selected rating is : ', rating);
      };


  $scope.rate=function () {
    $scope.modal.show();
  }

  $scope.submitComment = function () {
    console.log(JSON.stringify($scope.comment));
    bookServices.addComment($scope.comment,$scope.loggedinUser.user_id).then(function(res){
      console.log(res);
      if (res=="comment added"){
        $scope.thisEbook.comments.push($scope.comment);
      }
    })

    $scope.modal.hide();
  }

  $scope.closeComment = function () {
     $scope.modal.hide();
  }

  
  

  var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes'
    };


  $scope.payMoney=function () {
    $cordovaInAppBrowser.open('https://www.paypal.com', '_blank', options)
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



$scope.goToUser = function (user){

    $rootScope.user=user;
  $state.go('user',{user:$rootScope.user,fromState:$rootScope.thisState})
}

$scope.goToCommentUser = function(user){

  UserService.getUser(user).then(function(resp){
    console.log(resp);
    $rootScope.user=resp;
    $state.go('user',{user:$rootScope.user,fromState:$rootScope.thisState});
  }, function (err){
    console.log(err);
  })
}

})
.controller('albumCtrl', function ($scope,$rootScope, $stateParams,$state,$ionicPopup,MediaManager,$ionicModal,bookServices,productServices,UserService){
  
  var cart = localStorage.getItem("pomcart");

  if (cart==null) {
    $rootScope.cart=[];
  } else {
    //cart = JSON.parse(cart);
    $rootScope.cart=JSON.parse(cart);
  }
$scope.factor=1;
  //console.log(cart);


  $scope.thisAlbum= $state.params.album;
  console.log($scope.thisAlbum);
  
  
$scope.project= function (factor) {
  var Projections=[];
  for (i=0;i<$scope.thisAlbum.commission.length;i++){

    var thisProjection=($scope.thisAlbum.price*$scope.thisAlbum.commission[i]*Math.pow(factor,i+1)).toFixed(2);
    //console.log(thisProjection);
    Projections.push(thisProjection);
  }
  $scope.thisAlbum.projections=Projections;
}

$scope.increaseFactor= function () {
  $scope.factor++;
  $scope.project($scope.factor);
  console.log($scope.thisAlbum.projections);
}

$scope.decreaseFactor= function () {
  if ($scope.factor>0){
    $scope.factor--;
    $scope.project($scope.factor);

  }
  
}
$scope.project($scope.factor);
  
  $rootScope.thisState=$state.params.fromState;
  console.log($scope.thisAlbum);
$scope.comment={};
$scope.comment.comment_by=$rootScope.loggedinUser.user_id;
$scope.comment.username=$rootScope.loggedinUser.username;
$scope.comment.facebookID=$rootScope.loggedinUser.facebookID;
$scope.comment.product_id=$scope.thisAlbum.product_id;
$scope.comment.product_type="music";

 $scope.showRewards=false;

  $scope.toggleRewards= function () {
    $scope.showRewards=!$scope.showRewards;
  }


  $ionicModal.fromTemplateUrl('templates/comments.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.buy=function (album) {
    var confirmBuy= $ionicPopup.confirm({
      title:"Add to Cart",
      template:'Confirm add to cart?'
    }
      );
    confirmBuy.then(function (res){
      
          productServices.checkUserAlreadyHaveAlbum($rootScope.loggedinUser.user_id,album.product_id).then(function (resp){
            console.log(resp);
            if (resp=="already purchased"){
              var informUser = $ionicPopup.alert({

                title:"You have this Album",
                template:"You've already bought this album. Check your Shelf."
              });

              informUser.then(function (res){

              });
            } else if (resp=="not found") {

                  var thisalbum={
                  "name":album.name,
                  "author":album.author,
                  "quantity":1,
                  "currency":"SGD",
                  "type":album.type,
                  "cart_id":album.type+"-"+album.product_id,
                  "price":parseFloat(album.price),
                  "sku":album.product_id+"-"+"20161007",
                  "product_id":album.product_id,
                  "referrer":album.referrer,
                  "purch_ref":album.purch_ref,
                  "buyer":$rootScope.loggedinUser.user_id
                  }
            console.log(thisalbum);

          var albums_index = $rootScope.cart.map(function (alb){
            return alb.type+"-"+alb.product_id;
          } )

          var isInCart = albums_index.indexOf(thisalbum.cart_id);
           if (isInCart== -1){
            $rootScope.cart.push(thisalbum);
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
      } 
      
  
    }) //END BOOK SERVICES TO CHECK FOR BOOK
  })
  } //END SCOPEBUY

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
        $scope.comment.rating=rating;
        console.log('Selected rating is : ', rating);
      };


  $scope.rate=function () {
    $scope.modal.show();
  }

  $scope.submitComment = function () {
    console.log(JSON.stringify($scope.comment));
    bookServices.addComment($scope.comment,$scope.loggedinUser.user_id).then(function(res){
      console.log(res);
      if (res=="comment added"){
        $scope.thisAlbum.comments.push($scope.comment);
      }
    })

    $scope.modal.hide();
  }

  $scope.closeComment = function () {
     $scope.modal.hide();
  }

  
  

  var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes'
    };


  $scope.payMoney=function () {
    $cordovaInAppBrowser.open('https://www.paypal.com', '_blank', options)
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



$scope.goToUser = function (user){

    $rootScope.user=user;
  $state.go('user',{user:$rootScope.user,fromState:$rootScope.thisState})
}

$scope.goToCommentUser = function(user){

  UserService.getUser(user).then(function(resp){
    console.log(resp);
    $rootScope.user=resp;
    $state.go('user',{user:$rootScope.user,fromState:$rootScope.thisState});
  }, function (err){
    console.log(err);
  })
}

})
.controller('productCtrl', function ($scope,$rootScope, $stateParams,$state,$ionicPopup,$ionicModal,bookServices,UserService){
  
  var cart = localStorage.getItem("pomcart");

  var SelectedProduct = $ionicModal.fromTemplateUrl('templates/product_selection.html',{
      scope:$scope,
      animation:'slide-in-up'
    }).then(function(modal){
      $scope.productmodal=modal;
    })
    if (cart==null) {
      $rootScope.cart=[];
    } else {
      //cart = JSON.parse(cart);
      $rootScope.cart=JSON.parse(cart);
    }

  //console.log(cart);
  $scope.showRewards=false;

  $scope.toggleRewards= function () {
    $scope.showRewards=!$scope.showRewards;
  }

  $scope.item_index=0;

  $scope.factor=1;
  $scope.thisProduct=$state.params.product;

  $scope.project= function (factor) {
  var Projections=[];
  for (i=0;i<$scope.thisProduct.commission.length;i++){

    var thisProjection=($scope.thisProduct.price*$scope.thisProduct.commission[i]*Math.pow(factor,i+1)).toFixed(2);
    //console.log(thisProjection);
    Projections.push(thisProjection);
  }
  $scope.thisProduct.projections=Projections;
}

$scope.increaseFactor= function () {
  $scope.factor++;
  $scope.project($scope.factor);
  console.log($scope.thisProduct.projections);
}

$scope.decreaseFactor= function () {
  if ($scope.factor>0){
    $scope.factor--;
    $scope.project($scope.factor);

  }
  
}
$scope.project($scope.factor);
$scope.comment={};
$scope.comment.comment_by=$rootScope.loggedinUser.user_id;
$scope.comment.username=$rootScope.loggedinUser.username;
$scope.comment.facebookID=$rootScope.loggedinUser.facebookID;
$scope.comment.product_id=$scope.thisProduct.product_id;
$scope.comment.product_type=$scope.thisProduct.type;


  $rootScope.thisState=$state.params.fromState;
  console.log($scope.thisProduct);

  $ionicModal.fromTemplateUrl('templates/comments.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });





   $scope.selectModel = function (product) {
    $scope.selected_product=product.models;
    $scope.order_product={};
    $scope.order_product.name=product.name;
    $scope.order_product.model=$scope.selected_product[0].model;
    $scope.order_product.product_id=product.product_id;
    $scope.order_product.referrer=product.referrer;
    $scope.order_product.purch_ref=product.purch_ref;
    $scope.order_product.price=parseFloat(product.price,2);
    $scope.order_product.color=$scope.selected_product[0].color;
     $scope.order_product.type=product.type;
     $scope.order_product.buyer=$rootScope.loggedinUser.user_id;

    $scope.order_product.quantity=1;
    console.log(JSON.stringify($scope.selected_product));
      $scope.productmodal.show();

    }
$scope.nextModel= function () {
  if ($scope.item_index==$scope.selected_product.length-1){
    var productMsg = $ionicPopup.alert({
      title:"Product Information",
      template:"Swipe right to view more."
    });
    productMsg.then(function(res){

    })
  } else if ($scope.item_index<$scope.selected_product.length){
    $scope.item_index++;
     $scope.order_product.model=$scope.selected_product[$scope.item_index].model;

  }
  

}

$scope.prevModel= function () {
  if ($scope.item_index>0) {
    $scope.item_index--;
    $scope.order_product.model=$scope.selected_product[$scope.item_index].model;
  } else if ($scope.item_index==0){
    var productMsg = $ionicPopup.alert({
      title:"Product Information",
      template:"Swipe left to view more."
    });
     productMsg.then(function(res){
      
    })
  }
}
  $scope.increaseQty= function () {
    $scope.order_product.quantity++;
  }

  $scope.decreaseQty= function () {
    if ($scope.order_product.quantity>1){
      $scope.order_product.quantity--;
    }
    
  }

    $scope.closeProductDetails = function () {
      $scope.productmodal.hide();
    }
    $scope.addItemToCart = function () {
     
      
      //check order details 

      if ((($scope.order_product.quantity<1 || $scope.order_product.size==null|| $scope.order_product.color==null) && $scope.order_product.type=="fashion") || (($scope.order_product.quantity<1 || $scope.order_product.color==null) && $scope.order_product.type=="elecronics" )) {
        var checkItemMsg = $ionicPopup.alert({
          title: "Add To Cart",
          template:"Please specify required information."
        });
        checkItemMsg.then (function(resp){

        })
      } else {
        $scope.productmodal.hide();
        $rootScope.cart.push($scope.order_product);
      }
      console.log(JSON.stringify($scope.order_product))
      
    }

    $scope.selectSize = function (index) {


    }
  $scope.buy=function (product) {

    var confirmBuy= $ionicPopup.confirm({
      title:"Add to Cart",
      template:'Confirm add to cart?'
    }
      );
    confirmBuy.then(function (res){
      
           

                  var thisProduct={
                  "name":product.name,
                  "quantity":1,
                  "currency":"SGD",
                  "type":product.type,
                  "price":parseFloat(product.price),
                  "sku":product.sku,
                  "cart_id":product.type+"-"+product.product_id,
                  "product_id":product.product_id,
                  "referrer":product.referrer,
                  "purch_ref":product.purch_ref,
                  "buyer":$rootScope.loggedinUser.user_id
                  }
            console.log(thisProduct);

          var product_index = $rootScope.cart.map(function (pd){
            if (pd.type=="fashion"||pd.type=="electronics") {
              return pd.type+"-"+pd.product_id;
            }
            
          } )

          var isInCart = product_index.indexOf(thisProduct.cart_id);
           if (isInCart== -1){
            $rootScope.cart.push(thisProduct);
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
      
  })
  } //END SCOPEBUY

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
        $scope.comment.rating=rating;
        console.log('Selected rating is : ', rating);
      };


  $scope.rate=function () {
    $scope.modal.show();
  }

  $scope.submitComment = function () {
    console.log(JSON.stringify($scope.comment));
    bookServices.addComment($scope.comment,$scope.loggedinUser.user_id).then(function(res){
      console.log(res);
      if (res=="comment added"){
        $scope.thisProduct.comments.push($scope.comment);
      }
    })

    $scope.modal.hide();
  }

  $scope.closeComment = function () {
     $scope.modal.hide();
  }
  
   $scope.backToApp= function () {
    $cordovaInAppBrowser.close();
   } 

$scope.goToUser = function (user){

    UserService.getUser(user.user_id).then(function(resp){
    console.log(JSON.stringify(resp));
    $rootScope.user=resp;
    console.log(JSON.stringify($rootScope.user));
  $state.go('user',{user:$rootScope.user,fromState:$rootScope.thisState})
})
}

$scope.goToCommentUser = function(user){

  UserService.getUser(user).then(function(resp){
    console.log(JSON.stringify(resp));
    $rootScope.user=resp;
    $state.go('user',{user:$rootScope.user,fromState:$rootScope.thisState});
  })
}

})
.controller('serviceCtrl', function ($scope,$rootScope, $stateParams,$state,$ionicPopup,$ionicModal,bookServices,couponServices,UserService){
  
  var cart = localStorage.getItem("pomcart");

  if (cart==null) {
    $rootScope.cart=[];
  } else {
    //cart = JSON.parse(cart);
    $rootScope.cart=JSON.parse(cart);
  }

 $scope.showRewards=false;

  $scope.toggleRewards= function () {
    $scope.showRewards=!$scope.showRewards;
  }
  //console.log(cart);
  $scope.factor=1;
  $scope.thisService=$state.params.service;


  $scope.project= function (factor) {
  var Projections=[];
  for (i=0;i<$scope.thisService.commission.length;i++){

    var thisProjection=($scope.thisService.price*$scope.thisService.commission[i]*Math.pow(factor,i+1)).toFixed(2);
    console.log(thisProjection);
    Projections.push(thisProjection);
  }
  $scope.thisService.projections=Projections;
}

$scope.increaseFactor= function () {
  $scope.factor++;
  $scope.project($scope.factor);
  console.log($scope.thisService.projections);
}

$scope.decreaseFactor= function () {
  if ($scope.factor>0){
    $scope.factor--;
    $scope.project($scope.factor);

  }
  
}
$scope.project($scope.factor);
  $rootScope.thisState=$state.params.fromState;
  //console.log(JSON.stringify($scope.thisService));
$scope.comment={};
$scope.comment.comment_by=$rootScope.loggedinUser.user_id;
$scope.comment.username=$rootScope.loggedinUser.username;
$scope.comment.facebookID=$rootScope.loggedinUser.facebookID;
$scope.comment.product_id=$scope.thisService.product_id;
$scope.comment.product_type="services";



  $ionicModal.fromTemplateUrl('templates/comments.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.buy=function (svc) {
    var confirmBuy= $ionicPopup.confirm({
      title:"Add to Cart",
      template:'Confirm add to cart?'
    }
      );
    confirmBuy.then(function (res){
      
          couponServices.checkAvailable($scope.thisService.product_id).then(function (resp){
            console.log(resp);
            if (resp!="available"){
              var informUser = $ionicPopup.alert({

                title:"Coupon/Deal",
                template:"This offer is sold out at the moment."
              });

              informUser.then(function (res){

              });
            } else if (resp=="available") {

                  var thisService={
                  "name":svc.name,
                  "author":svc.author,
                  "quantity":1,
                  "currency":"SGD",
                  "price":parseFloat(svc.price),
                  "sku":svc.product_id+"-"+"20161007",
                  "cart_id":svc.type+"-"+svc.product_id,
                  "product_id":svc.product_id,
                  "referrer":svc.referrer,
                  "purch_ref":svc.purch_ref,
                  "buyer":$rootScope.loggedinUser.user_id,
                  "type":'services'
                  }
            console.log(thisService);

          var service_index = $rootScope.cart.map(function (sv){
            if (sv.type=="services"){


              return sv.type+"-"+sv.product_id;}
          } )

          var isInCart = service_index.indexOf(thisService.cart_id);
           if (isInCart== -1){
            $rootScope.cart.push(thisService);
          } else {
            var InCartMsg = $ionicPopup.confirm({
              title:"Cart Status",
              template:"Item already in cart. Do you want to buy more?"
            });
            inCartMsg.then(function (resp){
              if (resp) {
                $rootScope.cart[isInCart].quantity++;
              } else {
                console.log("item in cart already");
              }
              
            })
          }
      
      //console.log(josn.stringify(cart));
      localStorage.setItem("pomcart",JSON.stringify($rootScope.cart));
      console.log(JSON.stringify($rootScope.cart));
     // $state.go('cart',{cart:$rootScope.cart});
      } 
      
  
    }) //END BOOK SERVICES TO CHECK FOR BOOK
  })
  } //END SCOPEBUY

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
        $scope.comment.rating=rating;
        console.log('Selected rating is : ', rating);
      };


  $scope.rate=function () {
    $scope.modal.show();
  }

  $scope.submitComment = function () {
    console.log(JSON.stringify($scope.comment));
    bookServices.addComment($scope.comment,$scope.loggedinUser.user_id).then(function(res){
      console.log(res);
      if (res=="comment added"){
        $scope.thisService.comments.push($scope.comment);
      }
    })

    $scope.modal.hide();
  }

  $scope.closeComment = function () {
     $scope.modal.hide();
  }
  

  var options = {
      location: 'yes',
      clearcache: 'yes',
      toolbar: 'yes'
    };


  $scope.payMoney=function () {
    $cordovaInAppBrowser.open('https://www.paypal.com', '_blank', options)
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
$scope.goToUser = function (user){

    $rootScope.user=user;
  $state.go('user',{user:user,fromState:$rootScope.thisState});
}

$scope.goToCommentUser = function(user){

  UserService.getUser(user).then(function(resp){
    console.log(resp);
    $rootScope.user=resp;
    $state.go('user',{user:$rootScope.user,fromState:$rootScope.thisState});
  })
}

})
.controller('usersCtrl', function ($rootScope,$scope,bookServices,$state,$stateParams,$ionicLoading){
$ionicLoading.show({

  template:"<ion-spinner></ion-spinner><p>just a moment...</p>"
})

  bookServices.getUsers().then(function (resp){
   $ionicLoading.hide();
    for (i=0;i<resp.length;i++){
      var bookCount=resp[i].ebooks.length;
      resp[i].bookCount=bookCount;
     var rankingCount=resp[i].ebooks.length+resp[i].products.length+resp[i].services.length+resp[i].media.length;
     resp[i].rankingCount=rankingCount;

    }
    
    $rootScope.users=resp;
     
  })

  $scope.goToUser= function (user){
    console.log(user);
    $rootScope.user=user;
    $rootScope.thisState="main.users";
    $state.go('user',{user:user,fromState:"main.users"});
  }
  
})
.controller('purchaseCtrl', function ($scope,$timeout,$cordovaFileTransfer,$ionicPopup,$ionicLoading,$cordovaFile,$cordovaDevice,$state){

  var platform= $cordovaDevice.getPlatform();
  console.log(platform);
	var url = "https://www.pompipi.co/apis/assets/pdfs/DOGBOV.epub";
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
.controller('earningsCtrl', function ($scope,$rootScope,accountsServices,$state){

  var getUserAccountDetails = function (user) {
    accountsServices.getUserBalance(user).then(function (resp){
    $scope.balance=resp;
    console.log(resp);
  })

  accountsServices.getUserTransactions(user).then(function (resp){

    $scope.transactions=resp;
    console.log(resp);
  })
}
  getUserAccountDetails($rootScope.loggedinUser.user_id);

  $scope.goToDetails = function (transaction){
    console.log(transaction);
    accountsServices.getTransactionDetails($rootScope.loggedinUser.user_id,transaction).then(function (resp){
      console.log(JSON.stringify(resp));
      $scope.tx=resp;
      $state.go('earnings_details',{tx:resp});
    })
}
    $scope.doRefresh= function () {
getUserAccountDetails($rootScope.loggedinUser.user_id)
.finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
;
    }
  
})
.controller('earningsDetailsCtrl', function ($scope,accountsServices,$state){

  console.log($state.params.tx);
  for(i=0;i<$state.params.tx.length;i++){
    $state.params.tx[i].datetime_moment=moment($state.params.tx[i].datetime).fromNow();;
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
//console.log(JSON.stringify($scope.eBooks));
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
          var Advisory = $ionicPopup.alert(
          {
            title:"Reader Required",
            template: "Download any EBook reader to read your eBook."

          });

          Advisory.then(function (resp){
            console.log("user informed");
          })
      });
      } else if (filetype=="pdf"){
        $cordovaFileOpener2.open(
        ebook,
        'application/pdf'
      ).then(function() {
          // file opened successfully
      }, function(err) {
          // An error occurred. Show a message to the user
          var Advisory = $ionicPopup.alert(
          {
            title:"Reader Required",
            template: "Download any PDF reader to read your eBook."

          });

          Advisory.then(function (resp){
            console.log("user informed");
          })
      });
      }

    }

    var downloadEBook = function (ebook,filename,filetype) {
      var url = "https://www.pompipi.co/apis/assets/pdfs/"+filename;
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

          title:'Free Download',
          template:'Your Book comes with a complimentary eBook version and is downloaded. Book is sent to you either in paper form or CD/SD card.'
        });

        dlPopup.then(function(res){
          openEBook(ebook,filetype)

        });
    }, function(err) {
        // Error
        alert("not downloaded");
         $state.go('main.shelf');
      });

    }
$scope.readEbook = function (filename,filetype) {
  
  var platform= $cordovaDevice.getPlatform();
document.addEventListener('deviceready', function () {
    
  if (platform == "iOS") {
     var ebook = cordova.file.documentsDirectory+filename;

     $cordovaFile.checkFile(cordova.file.documentsDirectory,filename).then(function (success){
      //file exist
      openEBook(ebook,filetype);
      
     }, function (error){
        downloadEBook(ebook,filename,filetype);
        console.log(ebook)
      })
   }


     
 else if (platform=="Android") {
   var ebook = cordova.file.externalDataDirectory+filename;
  $cordovaFile.checkFile(cordova.file.externalDataDirectory,filename).then(function (success){
      //file exist
      openEBook(ebook,filetype);
     }, function (error){
          downloadEBook(ebook,filename,filetype);

     })
  
   console.log(ebook);
  }
  
  })
  }

UserService.getMusic($scope.loggedinUser.user_id).then(function (resp){
  console.log(JSON.stringify(resp));
  for (i=0;i<resp.length;i++){
    for (t=0;t<resp[i].contents.length;t++){
      resp[i].contents[t].file=resp[i].contents[t].url;
     
    }
    
  }
  $scope.music=resp;
  
  
  
})

UserService.getMovies($scope.loggedinUser.user_id).then(function (resp){
  $scope.movies=resp;
   console.log(resp);
})
$scope.Playing=-1;


var downloadTrack = function (trackFile,platform) {


      var url = trackFile;
      if (platform=="IOS"){
        var targetPath = cordova.file.documentsDirectory + "/music/"+trackFile;
      } else if (platform=="Android"){
        var targetPath = cordova.file.externalDataDirectory + "/music/"+trackFile;
      }
      
      var trustHosts = true;
      var options = {};
    $cordovaFileTransfer.download(url,targetPath,trustHosts,options).then(function (success) {
        $ionicLoading.hide();
          $cordovaFileOpener2.open(targetPath,'audio/mpeg').then (function (success){
            //open with media player
          },function(error){
            openerMsg = $ionicPopup.alert({
              title:"Play Music",
              template:"Download a Media Player to play MP3s on your device."
            })
          })


        },function (error){
          //download failed 
          $ionicLoading.hide();
          var downloaderMsg = $ionicPopup.alert({
            title:"Track Download",
            template:"Oops, download failed. Try again later, maybe?"
          });
          downloaderMsg.then(function(res){

          })

        })

}
$scope.downloadThisTrack = function (album_id,trackFile) {
  $ionicLoading.show({
    template:"<ion-spinner></ion-spinner><p>downloading...</p>"
  });
  var platform= $cordovaDevice.getPlatform();
document.addEventListener('deviceready', function () {
    
  if (platform == "iOS") {

    //check if music directory exist
    $cordovaFile.checkDir(cordova.file.documentsDirectory,"music").then (function (success){
      //check if file_exists
      $cordovaFile.checkFile(cordova.file.documentsDirectory+"/music",trackFile).then(function(success){
        $ionicLoading.hide();
        var trackInfo=$ionicPopup.alert({
          title:"Track info",
          template:"Track already downloaded"
        });
        trackInfo.then(function (res){

        })
      }, function(error){
        //if file does not exists - download
        downloadTrack(trackFile,platform);
      
      })
      //dir exists
    },function (error){
      //no dir
      $cordovaFile.createDir(cordova.file.documentsDirectory,"music",false).then(function (success){
        //download track
        downloadTrack(trackFile,platform);
      }, function(error){
        $ionicLoading.hide();
        console.log('dir MUSIC creation failed');

      })

    })
     }


     
 else if (platform=="Android") {

  $cordovaFile.checkDir(cordova.file.externalDataDirectory,"music").then (function (success){
    $cordovaFile.checkFile(cordova.file.externalDataDirectory+'/music',trackFile).then(function(success){
      $ionicLoading.hide();
      var trackInfo=$ionicPopup.alert({
          title:"Track info",
          template:"Track already downloaded"
        });
        trackInfo.then(function (res){
          
        });
    }, function(error){
       downloadTrack(trackFile,platform);

    })
  
  }, function (error) {
    $cordovaFile.createDir(cordova.file.externalDataDirectory,"music",false).then(function(success){
       downloadTrack(trackFile,platform);
    },function(error){
      $ionicLoading.hide();
console.log('dir MUSIC creation failed');
    })

  })
  
  }

})
}


$scope.doRefresh = function() {
    UserService.getEbooks($rootScope.loggedinUser.user_id).then (function (resp){

  console.log(resp);
  $scope.eBooks = resp;

  UserService.getMusic($scope.loggedinUser.user_id).then(function (resp){
     for (i=0;i<resp.length;i++){
    for (t=0;t<resp[i].contents.length;t++){
      resp[i].contents[t].file=resp[i].contents[t].url;
     
       
    }
    
  }
  $scope.music=resp;
  console.log(resp);
})

UserService.getMovies($scope.loggedinUser.user_id).then(function (resp){
  $scope.movies=resp;
   console.log(resp);
})
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

.controller('couponAdminCtrl', function ($scope,$state,$rootScope,couponServices,$cordovaBarcodeScanner,$ionicPopup,$ionicModal){
$rootScope.thisState=$state.params.fromState;

 var locationChoice= $ionicModal.fromTemplateUrl('templates/locations.html',{
              scope:$scope,
              animation:'slide-in-up'
            }).then(function (modal){
              $scope.modal=modal;
            })
 
  $scope.scanQRCode= function () {

    couponServices.getCouponInfo('1').then(function (res){
      console.log(res);
  
})

    $cordovaBarcodeScanner
      .scan()
      .then(function(barcodeData) {
       
        // Success! Barcode data is here
        console.log(JSON.stringify(barcodeData));
        var couponcode=barcodeData.text;
        
        var thiscoupon=couponcode.split('service');
        var coupon_info=thiscoupon[1];
        coupon_info=coupon_info.split('-');
        var service_id=coupon_info[1];
        purch_ref=coupon_info[2];
        console.log(coupon_id);
        $scope.couponData = {
          couponcode:barcodeData.text,
          purch_ref:purch_ref,
          service_id:service_id,
          buyer_id:coupon_info[0],
          processed_by:$rootScope.loggedinUser.user_id
        }
        couponServices.getCouponInfo(service_id).then (function (res){
          console.log(res);
          if (res.locations) {
           console.log(res);
           $scope.service=res;
  $scope.locations=$scope.service.locations;
            $scope.modal.show();

         } else {
          var informStaff =$ionicPopup.alert({
            title:"Not Available",
            template:"Sale ended or sold out"
          });
          informStaff.then(function (res){
            //done
          })
         }
        });

      }, function(error) {
        // An error occurred
      });

  }

  $scope.closeModal = function (){
    $scope.modal.hide();
  }
  $scope.selectLocation = function (location){
    $scope.couponData.location=location;
    $scope.modal.hide();
  }

$scope.acceptCoupon = function () {
  couponServices.redeemCoupon($scope.couponData).then(function (res){
    console.log(res);
    if (res=="coupon redeemed"){
      var informStaff= $ionicPopup.alert({
        title:"Coupon Status",
        template:"Coupon accepted"
      });
      informStaff.then(function(res){
        //done
      });
    } else if (res!="coupon redeemed"){
var informStaff= $ionicPopup.alert({
        title:"Coupon Status",
        template:"Coupon rejected"
      });
      informStaff.then(function(res){
        //done
      });


    }
  })
}


})
.controller('couponCtrl', function ($scope,$rootScope,$state,couponServices,$ionicLoading){

  couponServices.getUserCoupons($rootScope.loggedinUser.user_id).then(function(res){

    if (res.length>0){
      $scope.userCoupons=res;
      console.log(res);
    } 
  })
  $rootScope.thisState="main.home";

})
.controller('profileSettingsCtrl', function ($scope,$rootScope,$sce,$state,Camera,$cordovaImagePicker,$jrCrop,UserService,$ionicPopup,$ionicLoading){

  $scope.myinfo={};
  $rootScope.thisState="main.home";

  $scope.selectedImage="";
  $scope.croppedDataUrl="";

  $scope.shippingAddress={};
  $scope.mailingAddress={};
  $scope.paypalAddress={};
  $scope.shipping_update=false;
  $scope.mailing_update=false;
  $scope.paypal_update=false;

  UserService.getCountries().then(function (resp){
      $scope.countries=resp;
    });

  UserService.getUpdateInfo($rootScope.loggedinUser.user_id).then(function (res) {
    console.log(JSON.stringify(res));
    $scope.myinfo.shippingAddress=res.shipping_address;
    $scope.myinfo.mailingAddress=res.mailing_address;
    $scope.myinfo.paypalAddress=res.paypal_address;
    $scope.myinfo.avatar=res.avatar;
    $scope.myinfo.use_avatar=res.use_avatar;
    $scope.myinfo.username=res.username;

    

  })

  $scope.setAvatar = function () {

    //imgaePicker method

    var options = {
      height:600,
      width:600,
      quality:80,
      maximumImagesCount:1
    }

    $cordovaImagePicker.getPictures(options).then(function (results){
      console.log("image URI : "+results[0]);
      var selectedImage=results[0];
      $jrCrop.crop({
        url:selectedImage,
        width:200,
        height:200,
        circle:true
      }).then(function (canvas){
        console.log(canvas);
        var croppedImage=canvas.toDataURL("image/jpeg",1);
        console.log(croppedImage);
        //context.drawImage(canvas,0,0);
        
        $scope.croppedDataUrl=croppedImage;
     
      })
     
      })
      


    
}
$scope.useAvatar={"checked":false};
$scope.updateAvatar = function () {
  $ionicLoading.show({
    template:"<ion-spinner></ion-spinner><p>just a moment...</p>"
  })
  UserService.updateAvatar($rootScope.loggedinUser.user_id,$scope.croppedDataUrl).then(function (res){
    $ionicLoading.hide();
    if (res.status=="updated"){
      $rootScope.loggedinUser.avatar=res.avatar;
      var AvatarMsg= $ionicPopup.alert({
        title:"Avatar Status",
        template:"Avatar updated."
      });

      AvatarMsg.then(function (res){
        //updated avatar on server
      })
    }
  })
}

$scope.updateUseAvatar= function () {
  $ionicLoading.show({
    template:"<ion-spinner></ion-spinner><p>just a moment...</p>"
  })
  UserService.updateUseAvatar($rootScope.loggedinUser.user_id,$scope.useAvatar).then(function (res){
    $ionicLoading.hide();

    if (res=="updated"){
      $rootScope.loggedinUser.useAvatar=$scope.useAvatar;
      var updateProfile = $ionicPopup.alert({
        title:"Avatar Update",
        template:"Your avatar settings is updated."
      })

      updateProfile.then(function (res){
        //done
      })
    } else {
      //console.log(not updated)
    }
  })

}

  $scope.showShipping= function () {
   
$scope.shipping_update=!$scope.shipping_update;

  }

  $scope.showMailing= function () {
    console.log('mailing toggled');
$scope.mailing_update=!$scope.mailing_update;

  }

  $scope.showPaypal= function () {
      
$scope.paypal_update=!$scope.paypal_update;

  }

  $scope.update_Shipping = function () {
     $ionicLoading.show({
    template:"<ion-spinner></ion-spinner><p>just a moment...</p>"
  })
    UserService.updateShipping($rootScope.loggedinUser.user_id,$scope.shippingAddress).then(function(res){
      console.log(res);
$ionicLoading.hide();
      if(res.status=="updated"){
        $rootScope.loggedinUser.shipping_address=$scope.shippingAddress;
        $scope.myinfo.shippingAddress=$scope.shippingAddress;
      }
      $scope.showShipping();
    })

  
}

$scope.update_Mailing = function () {
   $ionicLoading.show({
    template:"<ion-spinner></ion-spinner><p>just a moment...</p>"
  });
    UserService.updateMailing($rootScope.loggedinUser.user_id,$scope.mailingAddress).then(function(res){
      console.log(res);
$ionicLoading.hide();
      if(res.status=="updated"){
        $rootScope.loggedinUser.mailing_address=$scope.mailingAddress;
        $scope.myinfo.mailingAddress=$scope.mailingAddress;
      }
      $scope.showMailing();
  
})

 
}
$scope.updatePaypal = function () {
    console.log('updating paypal');
$ionicLoading.show({

  template:"<ion-spinner></ion-spinner><p>just a moment...</p>"
});
UserService.updatePaypal($rootScope.loggedinUser.user_id,$scope.paypalAddress).then(function (res){
    $ionicLoading.hide();
    //$scope.showPaypal();
     console.log(JSON.stringify(res));
    if (res.status=="updated"){
       $scope.showPaypal();
      $rootScope.loggedinUser.paypal_address=$scope.paypalAddress.address;

      $scope.myinfo.paypalAddress=$scope.paypalAddress.address;
    }
  })
  
  
}
})
.filter('monthName', [function() {
    return function (monthNumber) { //1 = January
        var monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
            'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];
        return monthNames[monthNumber - 1];
    }
}])
.filter('pompipiEmbedUrl', function ($sce) {
    return function(songfile) {
      return $sce.trustAsResourceUrl('https://www.pompipi.co/apis/assets/fullsong/' + songfile);
    };
  });
;

