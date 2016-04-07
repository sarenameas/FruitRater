/*

We will be rewriting our data model design.
In the grocery model we will want to store reference to the reviews.
If grocery store doesn't exist reviews will still exist.
Search results are yelp results.
When a result is clicked we check the database for an existing grocery store.
If there is no existing grocery store for that Yelp ID then we create it in the database.
If there is an existing grocery store for that Yelp ID then check for updates.

*/