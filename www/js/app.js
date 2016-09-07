// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','directives','controllers','services','ngCordova','starter.payPalService','ionicLazyLoad','ionic-ratings'])

.run(function($ionicPlatform,$http, $cordovaPushV5,$rootScope,UserService) {

  var options = {
    android: {
      senderID: "295998469081"
    },
    ios: {
      alert: "true",
      badge: "true",
      sound: "true"
    },
    windows: {}
  };
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
if(window.cordova && $cordovaPushV5) {
    // initialize
  $cordovaPushV5.initialize(options).then(function() {
    // start listening for new notifications
    $cordovaPushV5.onNotification();
    // start listening for errors
    $cordovaPushV5.onError();
    
    // register to get registrationId
    $cordovaPushV5.register().then(function(registrationId) {
      // save `registrationId` somewhere;
      localStorage.setItem("gcmRegID",registrationId);

      console.log(registrationId);
    })
  })
}
  });
  
  // triggered every time notification received
  $rootScope.$on('$cordovaPushV5:notificationReceived', function(event, data){
    // data.message,
    // data.title,
    // data.count,
    // data.sound,
    // data.image,
    // data.additionalData
  });

  // triggered every time error occurs
  $rootScope.$on('$cordovaPushV5:errorOcurred', function(event, e){
    // e.message
  });


  })


.constant('shopSettings',{

payPalSandboxId :'AcI9PSDkSycyk2RCjtd7m3qdLnx5GcV1Jf3yDrz2IwCFQYLoSZNkiP9hUA4E6_0cDUZo0GpZ4x9wCiuK',
payPalSandboxSignature:'Am3Q-yMfXU2jSNP.eDC9.Zj8u7a3ABGq6ZO3aBGRUrIj53yBVzudXDM2',
payPalSandboxPW:'1408486369',
payPalSandboxUsername:'ben.looi-facilitator_api1.tellmyfriends.biz',
payPalProductionId : 'AXukI-JvV6fFKtEF2AOW4Hd-450u2iVX8_PFeNZx8JB8pX7y1-cAZE-pRZX6yoFLVXCObO73nMv5ghp3',

payPalEnv: 'PayPalEnvironmentSandbox', // for testing production for production

payPalShopName : 'Creative Spectrum',

payPalMerchantPrivacyPolicyURL : 'http://www.pompipi.co/main/privacypolicy',

payPalMerchantUserAgreementURL : 'http://www.pompipi.co/main/user_agreement'

})

.config(function ($stateProvider,$urlRouterProvider,$ionicConfigProvider){
  $ionicConfigProvider.tabs.position('bottom');
  
  $ionicConfigProvider.backButton.icon('ion-chevron-left');
  $stateProvider
  .state('login',{
    url:'/login',
   
   
        templateUrl:'templates/login.html',
        controller:'loginCtrl'
      
  })
  .state('howitworks',{
    url:'/howitworks',
   
   
        templateUrl:'templates/howitworks.html',
        controller:'loginCtrl'
      
  })
  .state('main',{
    url:'/main',
    abstract:true,
   
        templateUrl:'templates/main.html',
        controller: 'mainCtrl'
      
  })
  
  .state('main.home',{
    url:'/home',
     views: {
      'main-home':{
    templateUrl:'templates/home.html',
    controller: 'homeCtrl'
    }
    }
    
  })
 // .state('main.user',{
    .state('user',{
      cache: false,
    url:'/user',
    //views: {
    //  'main-users':{
    templateUrl:'templates/users.html',
    controller: 'userCtrl'
   // }
   // }
    ,
    params: {
      user:null,
      fromState:null
    }

  })
  .state('book',{
    cache: false,
    url:'/book',
     
    templateUrl:'templates/book.html',
    controller: 'bookCtrl'
   ,
 params: {
  book:null,
  fromState:null
 }
 

  })
  .state('product',{
    cache: false,
    url:'/product',
     
    templateUrl:'templates/product.html',
    controller: 'productCtrl'
   ,
 params: {
  product:null,
  fromState:null
 }
 

  })
   .state('service',{
    cache: false,
    url:'/service',
     
    templateUrl:'templates/service.html',
    controller: 'serviceCtrl'
   ,
 params: {
  service:null,
  fromState:null
 }
 

  })

    .state('coupon_admin',{
      cache: false,
    url:'/coupon_admin',
    //views: {
    //  'main-users':{
    templateUrl:'templates/redemption.html',
    controller: 'couponAdminCtrl'
   // }
   // }
    ,
    params: {
      
      fromState:'main.home'
    }

  })
    .state('coupon',{
      cache: false,
    url:'/coupon',
    //views: {
    //  'main-users':{
    templateUrl:'templates/coupon.html',
    controller: 'couponCtrl'
   // }
   // }
    ,
    params: {
      user:null,
      fromState:null
    }

  })
  .state('main.shelf',{
    url:'/shelf',
     views :{
      'main-shelf':{
    templateUrl:'templates/shelf.html',
    controller: 'shelfCtrl'
   }
 }
  })

  .state('main.account',{
    url:'/account',
     views: {
      'main-account':{
    templateUrl:'templates/account.html',
    controller: 'mainCtrl'
    }
    }
  })
  .state('main.users',{
    url:'/users',
    views: {
      'main-users':{
    templateUrl:'templates/profile.html',
    controller: 'usersCtrl'
     }
    }
  })
  .state('cart',{
    url:'/cart',
    
    templateUrl:'templates/cart.html',
    controller: 'cartCtrl',
    params: {
      cart:null
    }
     
  })
  .state('purchase',{
    url:'/purchase',
    
    templateUrl:'templates/payment_success.html',
    controller: 'purchaseCtrl'
      
     
  })
  .state('main.earnings',{
    url:'/earnings',
   views: {
      'main-earnings@main':{
    templateUrl:'templates/earnings.html',
    controller: 'earningsCtrl'
      }
    }
     
  })
  .state('earnings_details',{
    url:'/earnings_details',
   views: {
      'main-earnings@main':{
    templateUrl:'templates/earnings_details.html',
    controller: 'earningsDetailsCtrl'
      }
      },
      params: {
        tx:null
      }
     
  })
  ;
  $urlRouterProvider.otherwise('/login');
})

