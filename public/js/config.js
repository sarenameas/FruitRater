(function () {
    angular
        .module("FruitRaterApp")
        .config(configuration);

    configuration.$inject = ['$routeProvider'];
    function configuration($routeProvider) {
        $routeProvider
            .when("/home", {
                templateUrl: "views/home/home.view.html",
                controller: "HomeController"
            })
            .when("/register", {
                templateUrl: "views/register/register.view.html",
                controller: "RegisterController"
            })
            .when("/login", {
                templateUrl: "views/login/login.view.html",
                controller: "LoginController"
            })
            .when("/profile", {
                templateUrl: "views/profile/account/profile-account.view.html",
                controller: "ProfileAccountController"
            })
            .when("/profile/account", {
                templateUrl: "views/profile/account/profile-account.view.html",
                controller: "ProfileAccountController"
            })
            .when("/profile/myreviews/:page", {
                templateUrl: "views/profile/reviews/profile-reviews.view.html"
            })
            .when("/profile/usersfollowing/:page", {
                templateUrl: "views/profile/users_following/profile-users-following.view.html"
            })
            .when("/profile/grocerystoresfollowing/:page", {
                templateUrl: "views/profile/grocery_stores_following/profile-grocery-stores-following.view.html"
            })
            .when("/profile/allusers/:page", {
                templateUrl: "views/profile/all_users/profile-all-users.view.html"
            })
            .when("/profile/usersresults/:username/:page&", {
                templateUrl: "views/profile/users_results/profile-users-results.view.html"
            })
            .when("/review", {
                templateUrl: "views/review/review.view.html"
            })
            .when("/review/edit/:id", {
                templateUrl: "views/review/review.view.html"
            })
            .when("/user/:id", {
                templateUrl: "views/user/user_profile/user-profile.view.html"
            })
            .when("/user/:id/reviews/:page", {
                templateUrl: "views/user/user_reviews/user-reviews.view.html"
            })
            .when("/grocery/:id", {
                templateUrl: "views/grocery/grocery.view.html"
            })
            .when("/grocery/:id/page=:page", {
                templateUrl: "views/grocery/grocery.view.html"
            })
            .when("/grocery/:id/:fruit", {
                templateUrl: "views/fruit/fruit.view.html"
            })
            .when("/grocery/:id/:fruit/:page", {
                templateUrl: "views/fruit/fruit.view.html"
            })
            .when("/results/fruit=:fruit/grocery=:grocery/location=:location", {
                templateUrl: "views/results/results.view.html"
            })
            .when("/review/:groceryId", {
                templateUrl: "views/review/review.view.html"
            })
            .when("/review/:groceryId/:fruit", {
                templateUrl: "views/review/review.view.html"
            })
            .when("/review/edit/:id", {
                templateUrl: "views/review/review.view.html"
            })
            .otherwise({
                redirectTo:"/home"
            });
    }
})();