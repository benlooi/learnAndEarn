ApiEndPoint = {
	eBooks:"http://www.pompipi.co/apis/index.php/Appaccess/",
	Accounts:"http://www.pompipi.co/apis/index.php/Accounts/",
	Users:"http://www.pompipi.co/apis/index.php/Appaccess/"
	//eBooks:"v1/Appaccess/",
	//Accounts:"v1/Accounts/",
	//Users:"v1/Appaccess/"
}
angular.module('services',[])

.service('UserService', function($http,$q) {
	return {

		setuser: function(user_data) {
    				window.localStorage.starter_facebook_user = JSON.stringify(user_data);
	},
		getuser:function(){
    			return JSON.parse(window.localStorage.starter_facebook_user || '{}');
  	},
  		signUp: function (user){
  			var deferred=$q.defer();
			$http.post(ApiEndPoint.Users+"normalSignUp",{user:user})
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;
  		},
  		signIn: function (user){
  			var deferred=$q.defer();
			$http.post(ApiEndPoint.Users+"normalLogin",{user:user})
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;
  		},
  		facebookSignIn: function (user){
  			var deferred=$q.defer();
			$http.post(ApiEndPoint.Users+"facebookLogin",{user:user})
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;
  		},
  		normalLogin: function (user){
  			var deferred=$q.defer();
			$http.post(ApiEndPoint.Users+"normalLogin",{user:user})
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;
  		},
  		normalSignUp: function (user,regID){
  			var deferred=$q.defer();
			$http.post(ApiEndPoint.Users+"normalSignUp",{user:user,regID:regID})
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;
  		},
  		checkUsernameExists: function (username){
  			var deferred=$q.defer();
			$http.post(ApiEndPoint.Users+"checkUsernameExists",{username:username})
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;
  		},
  		checkEmailExists: function (email){
  			var deferred=$q.defer();
			$http.post(ApiEndPoint.Users+"checkEmailExists",{email:email})
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;
  		},

  		getEbooks: function (user){
  			var deferred=$q.defer();
			$http.post(ApiEndPoint.Users+"getEbooks",{user:user})
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;
  		},
  		updateUserEBooks: function (user){
  			var deferred=$q.defer();
			$http.post(ApiEndPoint.Users+"updateUserEBooks",{user:user})
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;
  		},
  		setGCMRegID: function (regID,user){
  			var deferred=$q.defer();
			$http.post(ApiEndPoint.Users+"setGCMRegID",{regID:regID,user:user})
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;


  		},
  		followUser: function (follower,user){
  			var deferred=$q.defer();
			$http.post(ApiEndPoint.Users+"followUser",{follower:follower,user:user})
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;


  		},
  		unfollowUser: function (follower,user){
  			var deferred=$q.defer();
			$http.post(ApiEndPoint.Users+"unfollowUser",{follower:follower,user:user})
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;


  		},
  		getCountries: function (){
  			var deferred=$q.defer();
			$http.get('json/countries.json')
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;


  		}
  // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
  
}
  
})
.factory('accountsServices',function ($http,$q){
	return {
		getUserBalance: function (user){
			var deferred=$q.defer();
			$http.post(ApiEndPoint.Accounts+"getUserBalance",{user:user})
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;

		},

		getUserTransactions: function (user){
			var deferred=$q.defer();
			$http.post(ApiEndPoint.Accounts+"getUserTransactions",{user:user})
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;

		},
		getTransactionDetails: function (user,transaction){
			var deferred=$q.defer();
			$http.post(ApiEndPoint.Accounts+"getTransactionDetails",{user:user,transaction:transaction})
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;

		},
		logSale: function (sale){
			var deferred=$q.defer();
			$http.post(ApiEndPoint.Accounts+"logSale",{sale:sale})
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;

		}


	}
})

.factory('bookServices',function ($http,$q){
	return {
		getLatest: function (){
			var deferred=$q.defer();
			$http.get(ApiEndPoint.eBooks+"getTrending")
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;

		},
		getWhosReading: function (){
			var deferred=$q.defer();
			$http.get(ApiEndPoint.eBooks+"getWhosReading")
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;

		},
		getUsers: function (){
			var deferred=$q.defer();
			$http.get(ApiEndPoint.eBooks+"getUsers")
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;

		},
		checkUserAlreadyHave: function (user,book){
			var deferred=$q.defer();
			$http.post(ApiEndPoint.eBooks+"checkUserAlreadyHave",{user:user,book:book})
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;

		},
		addComment: function (comment,user){
			var deferred=$q.defer();
			$http.post(ApiEndPoint.eBooks+"addComment",{comment:comment,user:user})
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;

		}

		
	}
})
.factory('productServices',function ($http,$q){
	return {
		getElectronics: function (){
			var deferred=$q.defer();
			$http.get(ApiEndPoint.eBooks+"getElectronics")
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;

		},
		getFashion: function (){
			var deferred=$q.defer();
			$http.get(ApiEndPoint.eBooks+"getFashion")
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;

		}
	}
})
.factory('Camera', ['$q', function($q) {

  return {
    getPicture: function(options) {
      var q = $q.defer();

      navigator.camera.getPicture(function(result) {
        // Do any magic you need
        q.resolve(result);
      }, function(err) {
        q.reject(err);
      }, options);

      return q.promise;
    }
  }
}]);