(function () {
    angular
        .module("FruitRaterApp")
        .factory("PagesService", pagesService);

    function pagesService() {
        //API
        var api = {
            splitItemsIntoPages: splitItemsIntoPages,
            getPageNumArray: getPageNumArray
        }

        return api;

        /* Splits the items into an array of array of items where each array has maximum of numPerPage. */
        function splitItemsIntoPages(items, numPerPage) {
            var itemPages = [];
            var i;
            for (i = 0; i < Math.ceil(items.length / numPerPage); i++) {
                var bottom = numPerPage*i;
                var top = numPerPage*i+numPerPage;
                if (top > items.length) {
                    top = items.length
                }
                itemPages[i] = items.slice(bottom, top);
            }

            // Defensive
            if (items.length === 0) {
                itemPages = [];
            }

            return itemPages;
        }

        /* Takes the pages array input and returns the counting array for each page. */
        function getPageNumArray(pages) {
            var i;
            var pageNumArray = [];
            for (i = 1; i <= pages.length; i++) {
                pageNumArray.push(i);
            }

            return pageNumArray;
        }
    }
})();