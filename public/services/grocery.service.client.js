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

        /* Returns the grocery store found by the given groceryId from our own database*/
        function findGroceryStoreById(groceryId) {
            var i;
            for (i = 0; i < groceryStores.length; i++) {
                if (groceryStores[i]._id === groceryId.toString()) {
                    return groceryStores[i];
                }
            }
            return null;
        }

        /* Searches the YelpService with the name and location and picks the data
         * to put into our own JSON object. 
         */
        function findGroceryStoresByNameAndLocation(name, location) {
            // TODO: use yelp api to get result.
            //
            // Take all 20 results given back and pack into our own JSON format shown in the 
            // mock data.
            
            // Only pass back results that are not closed.
            
            // Yelp gives us back a maximum of 20 results that we will display only the ones that 
            // have grocery as a category. We will use the utm source as grocery id.
            
            var i;
            var groceryResults = [];
            for (i = 0; i < groceryStores.length; i++) {
                if (name.toLowerCase() === groceryStores[i].name &&
                    groceryStores[i].address.toLowerCase().includes(location.toLowerCase())) {
                    groceryResults.push(groceryStores[i]);
                }
            }
            
            return groceryResults;
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
                            for (i = 0; i < groceryStores.length; i++) {
                                results.push(
                                    {
                                        "_id": groceryStores[i].id,
                                        "name": groceryStores[i].name,
                                        "address": groceryStores[i].location.display_address[0] + ", " + groceryStores[i].location.display_address[1]
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