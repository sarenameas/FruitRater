(function () {
    angular
        .module("FruitRaterApp")
        .config(configuration);
    
    function configuration($routeProvider) {
        $routeProvider
            .when("/home", {
                templateUrl: "views/home/home.view.html",
                controller: "HomeController",
                resolve: {
                    getLoggedIn: getLoggedIn
                }
            })
            .when("/register", {
                templateUrl: "views/register/register.view.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when("/login", {
                templateUrl: "views/login/login.view.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when("/profile", {
                templateUrl: "views/profile/account/profile-account.view.html",
                controller: "ProfileAccountController",
                controllerAs: "model",
                resolve: {
                    checkLoggedIn: checkLoggedIn
                }
            })
            .when("/profile/account", {
                templateUrl: "views/profile/account/profile-account.view.html",
                controller: "ProfileAccountController",
                controllerAs: "model",
                resolve: {
                    checkLoggedIn: checkLoggedIn
                }
            })
            .when("/profile/myreviews/:page", {
                templateUrl: "views/profile/reviews/profile-reviews.view.html",
                controller: "ProfileReviewsController",
                controllerAs: "model",
                resolve: {
                    checkLoggedIn: checkLoggedIn
                }
            })
            .when("/profile/usersfollowing/:page", {
                templateUrl: "views/profile/users_following/profile-users-following.view.html",
                controller: "UsersFollowingController",
                controllerAs: "model",
                resolve: {
                    checkLoggedIn: checkLoggedIn
                }
            })
            .when("/profile/grocerystoresfollowing/:page", {
                templateUrl: "views/profile/grocery_stores_following/profile-grocery-stores-following.view.html",
                controller: "GroceryStoresFollowingController",
                controllerAs: "model",
                resolve: {
                    checkLoggedIn: checkLoggedIn
                }
            })
            .when("/profile/allusers/:page", {
                templateUrl: "views/profile/all_users/profile-all-users.view.html",
                resolve: {
                    checkLoggedIn: checkLoggedIn
                }
            })
            .when("/profile/usersresults/:username/:page&", {
                templateUrl: "views/profile/users_results/profile-users-results.view.html",
                controller: "UserResultsController",
                controllerAs: "model",
                resolve: {
                    checkLoggedIn: checkLoggedIn
                }
            })
            // We can look at other users without being logged in.
            .when("/user/:id", {
                templateUrl: "views/user/user_profile/user-profile.view.html",
                controller: "UserProfileController",
                controllerAs: "model",
                resolve: {
                    getLoggedIn: getLoggedIn
                }
            })
            .when("/user/:id/reviews/:page", {
                templateUrl: "views/user/user_reviews/user-reviews.view.html",
                controller: "UserReviewsController",
                controllerAs: "model",
                resolve: {
                    getLoggedIn: getLoggedIn
                }
            })
            // We can view grocery stores without being logged in.
            .when("/grocery/:id", {
                templateUrl: "views/grocery/grocery.view.html",
                controller: "GroceryController",
                controllerAs: "model",
                resolve: {
                    getLoggedIn: getLoggedIn
                }
            })
            .when("/grocery/:id/page=:page", {
                templateUrl: "views/grocery/grocery.view.html",
                controller: "GroceryController",
                controllerAs: "model",
                resolve: {
                    getLoggedIn: getLoggedIn
                }
            })
            .when("/grocery/:id/search=:search/page=:page", {
                templateUrl: "views/grocery/grocery.view.html",
                controller: "GroceryController",
                controllerAs: "model",
                resolve: {
                    getLoggedIn: getLoggedIn
                }
            })
            .when("/grocery/:id/:fruit", {
                templateUrl: "views/fruit/fruit.view.html",
                controller: "FruitController",
                controllerAs: "model",
                resolve: {
                    getLoggedIn: getLoggedIn
                }
            })
            .when("/grocery/:id/:fruit/:page", {
                templateUrl: "views/fruit/fruit.view.html",
                controller: "FruitController",
                controllerAs: "model",
                resolve: {
                    getLoggedIn: getLoggedIn
                }
            })
            .when("/results/fruit=:fruit/grocery=:grocery/location=:location", {
                templateUrl: "views/results/results.view.html",
                controller: "ResultsController",
                controllerAs: "model",
                resolve: {
                    getLoggedIn: getLoggedIn
                }
            })
            // The review page will not reroute for not logged in user.
            .when("/review", {
                templateUrl: "views/review/review.view.html",
                controller: "ReviewController",
                controllerAs: "model",
                resolve: {
                    getLoggedIn: getLoggedIn
                }
            })
            .when("/review/:groceryId", {
                templateUrl: "views/review/review.view.html",
                controller: "ReviewController",
                controllerAs: "model",
                resolve: {
                    getLoggedIn: getLoggedIn
                }
            })
            .when("/review/edit/:id", {
                templateUrl: "views/review/review.view.html",
                controller: "ReviewController",
                controllerAs: "model",
                resolve: {
                    getLoggedIn: getLoggedIn
                }
            })
            .when("/review/:groceryId/:fruit", {
                templateUrl: "views/review/review.view.html",
                controller: "ReviewController",
                controllerAs: "model",
                resolve: {
                    getLoggedIn: getLoggedIn
                }
            })
            .otherwise({
                redirectTo:"/home"
            });
    }

    var getLoggedIn = function ($http, $q, $timeout, UserService) {
        var deferred = $q.defer();

        $http
            .get("/api/loggedin")
            .then(function(response){
                var currentUser = response.data;
                UserService.setCurrentUser(currentUser);
                deferred.resolve();
            });

        return deferred.promise;
    };

    var checkLoggedIn = function ($http, $q, $location, $timeout, UserService) {

        var deferred = $q.defer();

        $http
            .get("/api/loggedin")
            .then(function(response) {
                var currentUser = response.data;
                if(currentUser) {
                    UserService.setCurrentUser(currentUser);
                    deferred.resolve();
                } else {
                    deferred.reject();
                    $location.url("/home");
                }
            });

        return deferred.promise;
    };


    
})();