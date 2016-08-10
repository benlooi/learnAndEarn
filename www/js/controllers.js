angular.module('controllers',[])
.controller('loginCtrl', function ($scope,$cordovaImagePicker){
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
})
.controller('mainCtrl',function ($scope,$ionicPopup,$state,$cordovaInAppBrowser,PaypalService){
	$scope.books= [1,2,3];
	
	$scope.buy=function () {
		var confirmBuy= $ionicPopup.alert({
			title:"Add to Cart",
			template:'Confirm add to cart?'
		}
			);
		confirmBuy.then(function (res){
			console.log('buy it');
			$state.go('cart');
		})
	}

	$scope.rate=function () {
		var confirmBuy= $ionicPopup.alert({
			title:"Rate",
			template:'<i class="ion-ios-star"></i>'
		}
			);
		confirmBuy.then(function (res){
			console.log('buy it');
			
		})
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
$state.go('purchase');

}, function (error) {

alert('Transaction Canceled');

});

});

}
 


})
.controller('usersCtrl', function ($scope){
  $scope.users=[1,2,3,4,5,6,7];
})
.controller('purchaseCtrl', function ($scope,$timeout,$cordovaFileTransfer,$ionicPopup,$ionicLoading,$cordovaFile){

	var url = "http://learnandearn123.com/apis/assets/pdfs/Learn_and_Earn_1-2-3.pdf";
  var filename = url.split("/").pop();
    var targetPath = cordova.file.externalDataDirectory+filename;
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
        $ionicLoading.hide();
        var dlPopup = $ionicPopup.alert({

        	title:'Download',
        	template:'Your eBook is downloaded.'
        });

        dlPopup.then(function(res){

        });
      }, function(err) {
        // Error
      });
      

   }

})
.controller('earningsCtrl', function ($scope){
})

