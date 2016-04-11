(function () {
    // We put the directive in the FruitRaterApp so we can use FruitRaterApp services.
    angular
        .module("FruitRaterApp")
        .directive("fruitReview", fruitReview);

    fruitReview.$inject = ['$location', 'UserService', 'ReviewService'];
    function fruitReview($location, UserService, ReviewService) {
        function link($scope, element, attrs) {
            $scope.rangeArray = rangeArray;
            $scope.editReview = editReview;
            $scope.deleteReview = deleteReview;
            $scope.user = null;
            $scope.currentUser = UserService.getCurrentUser();

            UserService
                .findUserById($scope.review.userId)
                .then(
                    function (response) {
                        if (response.data) {
                            $scope.user = response.data;
                        }
                    }
                );

            function rangeArray(n) {
                return new Array(n);
            }

            /* Takes us to the to review page for editing. */
            function editReview(fruit, reviewId) {

                $location.url('/review/edit/' + reviewId);
            }

            /* Deletes the review in the server. We are assuming that reviews are always on a page of reviews and never
             * stand alone. Feels like there is some coupling here... */
            function deleteReview(reviewId) {
                //console.log(reviewId);
                ReviewService.deleteReview(reviewId);
                $scope.deleteUpdate();
            }

        }
        return {
            // scope binds attribute variables
            // to local bound variables
            scope: {
                "review": "=",
                "deleteUpdate": "&"
            },
            // templateUrl refers to template file
            // template file iterates over users array
            // renders each user in a row
            templateUrl: "directives/fruitReview.directive.html",
            link: link
        }
    }
})();