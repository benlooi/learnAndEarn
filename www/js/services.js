ApiEndPoint = {
	eBooks:"http://www.pompipi.co/apis/index.php/Appaccess/",
	Accounts:"http://www.pompipi.co/apis/index.php/Accounts/"
}
angular.module('services',[])
.service('UserService', function($http,$q) {
  // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
  var setUser = function(user_data) {
    window.localStorage.starter_facebook_user = JSON.stringify(user_data);
  };

  var getUser = function(){
    return JSON.parse(window.localStorage.starter_facebook_user || '{}');
  };

  return {
    getUser: getUser,
    setUser: setUser
  };
})
.factory('accountsServices',function ($http,$q){
	return {
		getUserBalance: function (){
			var deferred=$q.defer();
			$http.get(ApiEndPoint.Accounts+"getUserBalance")
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;

		},

		getUserTransactions: function (){
			var deferred=$q.defer();
			$http.get(ApiEndPoint.Accounts+"getUserTransactions")
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;

		},
		getTransactionDetails: function (transaction){
			var deferred=$q.defer();
			$http.post(ApiEndPoint.Accounts+"getTransactionDetails",{transaction:transaction})
			.success(function (data){
				deferred.resolve(data);
			})
			.error(function(error){
				deferred.reject(error);
			})
			return deferred.promise;

		},


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

		}

		
	}
})