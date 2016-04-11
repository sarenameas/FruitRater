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

        // Mock Data
        var groceryStores = [
            {
                "_id": "1",
                "name": "safeway",
                "address": "12519 NE 85th St, Kirkland, WA"
            },
            {
                "_id": "2",
                "name": "safeway",
                "address": "10020 NE 137th, Kirkland, WA"
            },
            {
                "_id": "3",
                "name": "safeway",
                "address": "14444 124th Ave, Kirkland, WA"
            }
        ];

        // API
        var api = {
            findAllGroceryStores: findAllGroceryStores,
            findGroceryStoreById: findGroceryStoreById,
            findGroceryStoresByNameAndLocation: findGroceryStoresByNameAndLocation,
            findGroceryStoresByLocation: findGroceryStoresByLocation,
            deleteGroceryStore: deleteGroceryStore,
            createGroceryStore: createGroceryStore,
            updateGroceryStore: updateGroceryStore
        };


        return api;

        /* Returns all groceries stores in the system */
        function findAllGroceryStores() {
            var allGroceryStores = groceryStores;
            return allGroceryStores;
        }

        function findGroceryStoreById(groceryId) {
            var deferred = $q.defer();
            $http
                .get('/api/business/grocery/' + groceryId)
                .then(
                    function (response) {
                        var groceryStore = null;
                        if (response.data) {
                            var groceryStore = {
                                "_id": response.data.id,
                                "name": response.data.name,
                                "address": response.data.location.display_address[0] + ", " + response.data.location.display_address[1]
                            };
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
                        deferred.resolve(results);
                    },
                    function (err) {
                        deferred.reject(err);
                    }
                );

            return deferred.promise;
        }


        function deleteGroceryStore(groceryId) {
            var i;
            for (i = 0; i < groceryStores.length; i++) {
                if (groceryStores[i]._id === groceryId.toString()) {
                    groceryStores.splice(i, 1);
                }
            }

            return groceryStores;
        }

        function createGroceryStore(grocery) {
            var newGrocery = {
                "_id": grocery._id,
                "name": grocery.name.toLowerCase(),
                "address": grocery.address
            }

            groceryStores.push(newGrocery);
            return newGrocery;
        }

        /* Updates the grocery store found with the given groceryID to the given grocery. */
        function updateGroceryStore(groceryId, grocery) {
            var i;
            for (i = 0; i < groceryStores.length; i++) {
                if (groceryStores[i]._id === groceryId.toString()) {
                    groceryStores[i].name = grocery.name;
                    groceryStores[i].address = grocery.address;
                    return groceryStores[i];
                }
            }


        }
    }
})();