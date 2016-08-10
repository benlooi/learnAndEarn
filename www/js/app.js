// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic','controllers','services','ngCordova','starter.payPalService'])

.run(function($ionicPlatform) {
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
  });
})
.constant('shopSettings',{

payPalSandboxId :'AcI9PSDkSycyk2RCjtd7m3qdLnx5GcV1Jf3yDrz2IwCFQYLoSZNkiP9hUA4E6_0cDUZo0GpZ4x9wCiuK',
payPalSandboxSIgnature:'Am3Q-yMfXU2jSNP.eDC9.Zj8u7a3ABGq6ZO3aBGRUrIj53yBVzudXDM2',
payPalSandboxPW:'1408486369',
payPalSandboxUsername:'ben.looi-facilitator_api1.tellmyfriends.biz',
payPalProductionId : 'production id here',

payPalEnv: 'PayPalEnvironmentSandbox', // for testing production for production

payPalShopName : 'MyShopName',

payPalMerchantPrivacyPolicyURL : 'url to policy',

payPalMerchantUserAgreementURL : 'url to user agreement '

})

.config(function ($stateProvider,$urlRouterProvider){
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
   
        templateUrl:'templates/main.html'
      
  })
  .state('main.user',{
    url:'/user',
     views: {
      'main-users':{
    templateUrl:'templates/users.html',
    controller: 'mainCtrl'
    }
    }
  })
  .state('main.home',{
    url:'/home',
     views: {
      'main-users':{
    templateUrl:'templates/home.html',
    controller: 'mainCtrl'
    }
    }
  })
  .state('main.book',{
    url:'/book',
     views :{
      'main-users':{
    templateUrl:'templates/book.html',
    controller: 'mainCtrl'
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
      'main-profile':{
    templateUrl:'templates/profile.html',
    controller: 'usersCtrl'
     }
    }
  })
  .state('cart',{
    url:'/cart',
     views: {
      'main-users@main':{
    templateUrl:'templates/cart.html',
    controller: 'mainCtrl'
     }
   }
  })
  .state('purchase',{
    url:'/purchase',
    views: {
      'main-purchase@main':{
    templateUrl:'templates/payment_success.html',
    controller: 'purchaseCtrl'
      }
    }
     
  })
  .state('earnings',{
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
    controller: 'earningsCtrl'
      }
      }
     
  })
  ;
  $urlRouterProvider.otherwise('/login');
})

