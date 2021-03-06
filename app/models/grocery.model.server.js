/*

There will be no model for grocery stores since grocery stores only exist if there are reviews.
Also Yelp does not store reviews with their businesses as it would take up a lot of space I am assuming.
We do not need a association of reviews in a grocery store model because it is a 1:1 relationship.
My review model has an association of the owning grocery store and the owning user.

Consider storing the grocery store by yelpId then searching for the store on yelp only if the
grocery store does not exist in the database, so that we do not run out of yelp requests.

*/