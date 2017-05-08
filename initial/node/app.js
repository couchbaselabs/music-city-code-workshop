var Express = require("express");
var Couchbase = require("couchbase");
var BodyParser = require("body-parser");
var Uuid = require("uuid");
var Cors = require("cors");

var app = Express();

app.use(BodyParser.json());
app.use(Cors());

var N1qlQuery = Couchbase.N1qlQuery;

// STEP 01: Connect to the Couchbase Cluster and Bucket

app.post("/movies", function(request, response) {
    // STEP 02: Creating New Couchbase Documents
});

app.get("/movies/:id?", function(request, response) {
    // STEP 03: Querying for Couchbase Documents
});

app.put("/movies/:id", function(request, response) {
    // Step 04: Replacing Documents in Couchbase
});

app.delete("/movies/:id", function(request, response) {
    // Step 05: Deleting Documents in Couchbase
});

app.get("/search", function(request, response) {
    // Step 06: Advanced N1QL Queries
});

var server = app.listen(3000, function() {
    console.log("Listening on port 3000...");
});