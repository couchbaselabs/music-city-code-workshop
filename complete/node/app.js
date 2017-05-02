var Express = require("express");
var Couchbase = require("couchbase");
var BodyParser = require("body-parser");
var Uuid = require("uuid");
var Cors = require("cors");

var app = Express();

app.use(BodyParser.json());
app.use(Cors());

var N1qlQuery = Couchbase.N1qlQuery;
var bucket = (new Couchbase.Cluster("couchbase://localhost")).openBucket("default", "");

app.post("/movies", function(request, response) {
    bucket.insert(Uuid.v4(), request.body, function(error, result) {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(request.body);
    });
});

app.get("/movies/:id?", function(request, response) {
    var statement = "SELECT META().id, `" + bucket._name + "`.* FROM `" + bucket._name + "`";
    if(request.params.id) {
        statement += " WHERE META().id = ?";
    }
    bucket.query(N1qlQuery.fromString(statement).consistency(N1qlQuery.Consistency.REQUEST_PLUS), [request.params.id], function(error, result) {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

app.put("/movies/:id", function(request, response) {
    bucket.replace(request.params.id, request.body, function(error, result) {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(request.body);
    });
});

app.delete("/movies/:id", function(request, response) {
    bucket.remove(request.params.id, function(error, result) {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(request.body);
    });
});

app.get("/search", function(request, response) {
    var statement = "SELECT META().id, `" + bucket._name + "`.* FROM `" + bucket._name + "` WHERE LOWER(title) LIKE '%' || ? || '%'";
    bucket.query(N1qlQuery.fromString(statement), [request.query.title], function(error, result) {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result);
    });
});

var server = app.listen(3000, function() {
    console.log("Listening on port 3000...");
});