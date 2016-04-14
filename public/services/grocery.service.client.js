/* This service will take the data from the yelp api and pack it into our own JSON format before
 * returning it to the controller to display results.
 * This service also gets data from our own server for the given grocery Id when requested by the
 * client. */
(function () {
    angular
        .module("FruitRaterApp")
        .factory("GroceryService", groceryService);

    groceryService.$inject = ['$http', '$q'];
    function groceryService($http, $q) {
        // API
        var api = {
            findGroceryStoreById: findGroceryStoreById,
            findGroceryStoresByNameAndLocation: findGroceryStoresByNameAndLocation,
            findGroceryStoresByLocation: findGroceryStoresByLocation,
            deleteGroceryStore: deleteGroceryStore
        };


        return api;


        function findGroceryStoreById(groceryId) {
            var deferred = $q.defer();
            $http
                .get('/api/business/grocery/' + groceryId)
                .then(
                    function (response) {
                        var groceryStore = null;
                        if (response.data) {
                            if (response.data.error) {
                                // do nothing no grocery store found.
                            }
                            else {
                                var groceryStore = {
                                    "_id": response.data.id,
                                    "name": response.data.name,
                                    "address": response.data.location.display_address[0] + ", " + response.data.location.display_address[1]
                                };

                            }
                        }
                        deferred.resolve(groceryStore);

                    },
                    function (err) {
                        deferred.reject(err);
                    }
                );

            return deferred.promise;
        }


        function findGroceryStoresByNameAndLocation(name, location) {
            var deferred = $q.defer();
            $http
                .get("/api/search/grocery/" + name + "/" + location)
                .then(
                    function (response) {
                        var results = [];
                        if (response.data) {
                            if (response.data.error) {
                                // do nothing no grocery store found.
                            }
                            else {
                                var groceryStores = response.data.businesses;

                                var i;
                                var j;
                                for (i = 0; i < groceryStores.length; i++) {
                                    var address = "";
                                    for (j = 0; j < groceryStores[i].location.display_address.length; j++) {
                                        address = address + groceryStores[i].location.display_address[j] + ", ";
                                    }
                                    // Delete trailing comma and space
                                    address = address.substring(0, address.length - 2);
                                    results.push(
                                        {
                                            "_id": groceryStores[i].id,
                                            "name": groceryStores[i].name,
                                            "address": address
                                        }
                                    );
                                }
                            }
                        }
                        deferred.resolve(results);
                    },
                    function (err) {
                        deferred.reject(err);
                    }
                );

            return deferred.promise;
        }
        
        function findGroceryStoresByLocation(location) {
            var deferred = $q.defer();
            $http
                .get("/api/search/grocery/" + "empty" + "/" + location)
                .then(
                    function (response) {
                        var results = [];
                        if (response.data) {
                            if (response.data.error) {
                                // do nothing no grocery store found.
                            }
                            else {
                                var groceryStores = response.data.businesses;

                                var i;
                                var j;
                                for (i = 0; i < groceryStores.length; i++) {
                                    var address = "";
                                    for (j = 0; j < groceryStores[i].location.display_address.length; j++) {
                                        address = address + groceryStores[i].location.display_address[j] + ", ";
                                    }
                                    // Delete trailing comma and space
                                    address = address.substring(0, address.length - 2);
                                    results.push(
                                        {
                                            "_id": groceryStores[i].id,
                                            "name": groceryStores[i].name,
                                            "address": address
                                        }
                                    );
                                }
                            }

                        }
                        deferred.resolve(results);
                    },
                    function (err) {
                        deferred.reject(err);
                    }
                );

            return deferred.promise;
        }


        function deleteGroceryStore(groceryId) {
           //TODO: Delete all grocery store reviews
        }
    }
})();