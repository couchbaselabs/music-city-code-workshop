# Music City Code 2017 Workshop

This repository hosts the content for the Music City Code 2017 workshop that consists of [Node.js](https://nodejs.org), [Couchbase](https://www.couchbase.com), [Angular](https://www.angular.io), and [NativeScript](https://www.nativescript.org).

For perspective, Node.js will power the backend RESTful API that client facing applications such as Angular and NativeScript use for data consumption. The data will be stored in the NoSQL database, Couchbase. All technologies in this workshop are open source.

## About the Author

Nic Raboy is an advocate of modern web and mobile development technologies. He has experience in Java, JavaScript, Golang and a variety of frameworks such as Angular, NativeScript, and Apache Cordova. Nic writes about his development experiences related to making web and mobile development easier to understand.

[@nraboy](https://www.twitter.com/nraboy) | [The Polyglot Developer](https://www.thepolyglotdeveloper.com)

## The Requirements

There are many pieces to this project, each with their own set of dependencies. A full set of dependencies include the following:

* Node.js 6.0
* Couchbase Server 4.6
* Android SDK for Android
* Xcode for iOS

The Node Package Manager (NPM) which comes with Node.js will be heavily used for gathering dependencies for Node.js, Angular, and NativeScript. Mobile development with NativeScript allows for deployment to Android as well as iOS, however, the Android SDK must be available and configured as well as Xcode for iOS. Xcode is only available for macOS users.

## The Workshop Breakdown

The workshop is broken down into two core sections, each with their own sub-sections. The two sections consist of an **initial** project and a **complete** project. The instructions in this README will walk you through the development of the **initial** project which will become **complete** as a final result. If at any point in time you'd like to validate your work, find the corresponding sub-section in the **complete** directory.

## Instructions

The **initial** project is broken into four parts, where each part is essentially a different part of the stack.

### Deploying Couchbase and Becoming Familiar with NoSQL

In any full stack application, a database is required. For this workshop, NoSQL will be the theme and Couchbase will fulfill that theme.

The JSON data stored as NoSQL documents, at a minimum, will be modeled like this:

```
{
    "title": "Batman",
    "genre": "Fantasy / Action"
}
```

The theme of the full stack application will be a movie database.

#### Step 01 - Installing Couchbase Server

There are numerous ways to install Couchbase Server. For example, one could use Docker or one of the available AWS or Azure images. For this workshop, the Mac, Windows, or Linux binary will be installed directly onto the working machine.

[Download](https://www.couchbase.com/download) Couchbase Server and walk through the short setup wizard found at http://localhost:8091. The defaults are fine for this workshop.

#### Step 02 - Creating a Primary Index for N1QL

SQL queries with the Couchbase N1QL syntax will be used throughout the Node.js section of this workshop. For most circumstances, an index is required for querying. In development mode, a primary index can be used:

```
CREATE PRIMARY INDEX ON `default`;
```

Within the Couchbase Query Workbench found in the administrative dashboard, execute the query above. In a production environment, specific indexes should be created on a per query basis to maximize performance. Primary indexes have very poor performance by comparison.

### Building a RESTful API with Node.js and Couchbase Server

The goal of this section is to create a RESTful API that can be consumed from any front-end client. This API is powered by Node.js with Express as the logic layer and supplied with data from Couchbase Server.

Open the project, **initial/node**, as all development will be done here.

#### Step 01 - Connecting to the Couchbase Cluster and Bucket

If you recall, each Couchbase node in a cluster is aware of all other nodes in the cluster. This means that we only need to pick a single node that we wish to connect to.

Typically one would connect to a cluster like this, using the Node.js SDK for Couchbase:

```
var cluster = new Couchbase.Cluster("couchbase://host");
var bucket = cluster.openBucket("bucket_name", "bucket_password");
```

More information on connecting to a Couchbase cluster can be found in the [Managing Connections](https://developer.couchbase.com/documentation/server/current/sdk/nodejs/managing-connections.html) documentation.

Now open the project's **app.js** file and look for the first step. See if you can supply the code necessary to establish a connection to the cluster.

#### Step 02 - Creating New Couchbase Documents

The Node.js application is now connected to Couchbase and a particular Bucket has been opened. As a first step (second step), it makes sense to get data created.

Some will argue that POST requests create data and others will argue that PUT requests create data. For us, it doesn't really matter how we get to the data creation point, we only care about creating such data.

There are several ways to create data in Couchbase using the Node.js SDK. You could use N1QL or you could do a basic key-value CRUD operation.

To create data using a CRUD operation, one might do something like this:

```
bucket.insert("my-key", { "firstname": "Nic", "lastname": "Raboy" }, function(error, result) {});
```

If you try to insert documents that share the same key, you're going to get an error. If the scenario calls for it, you might find value in using a UUID as the key.

Creating a UUID is as simple as the following:

```
var uuid = Uuid.v4();
```

More information on Bucket CRUD operations can be found in the [Creating Documents](https://developer.couchbase.com/documentation/server/current/sdk/nodejs/document-operations.html) documentation.

The alternative to CRUD, is to use a N1QL query. Here is an example of a N1QL query for inserting documents:

```
var statement = "INSERT INTO `bucket_name` (KEY, VALUE) VALUES ('my-key', { 'firstname': 'Nic', 'lastname': 'Raboy' })";
bucket.query(N1qlQuery.fromString(statement), function(error, result) {});
```

When creating an API, data must be returned to the requestor after each request. With Node.js and Express Framework, this can be done with the following:

```
app.get("/endpoint", function(request, response) {
    response.send({ "success": true });
});
```

In the **app.js** file, try to find the second step and insert the supplied JSON data into Couchbase. Feel free to add extra data validation.

#### Step 03 - Querying for Couchbase Documents

With data going into the database, we need it to come out of the database as well. There are several ways to do, but since we want multiple documents to be returned, it is best to use a query rather than a CRUD operation.

You got a taste of N1QL in the third step, but it's time to put it to use in this step.

```
var statement = "SELECT `bucket_name`.* FROM `bucket_name` WHERE META().id = ?";
bucket.query(N1qlQuery.fromString(statement), ["my-key"], function(error, result) {
    if(error) {
        // Do something with the error
    }
    // Do something with the result
});
```

The N1QL query above is a little different that what was in the previous step. In the above example, parameterization is used to prevent SQL injection attacks.

Give it a try in the application. Find the third step in the **app.js** file and try to query for all documents in the Bucket. Then try to query for a specific document in the Bucket. Why not add logic to do both in the same endpoint? You may need to define your query consistency so you may want to read about [Scan Consistency](https://developer.couchbase.com/documentation/server/current/sdk/nodejs/n1ql-queries-with-sdk.html) in the documentation.

#### Step 04 - Replacing Documents in Couchbase

A CRUD API implies that there will be a way of updating or replacing data given a certain endpoint. In Couchbase, given a certain key, the document can be replaced with a new document of the same key.

Replacing documents can be done with the Node.js CRUD functions or with N1QL, similar to how inserting documents was accomplished.

```
bucket.replace("my-key", { "firstname": "Nicolas", "lastname": "Raboy" }, function(error, result) {});
```

Within the project's **app.js** file, find the fourth step and configure the endpoint for replacing documents based on the existing key value.

#### Step 05 - Deleting Documents in Couchbase

The final part of any good CRUD API would come in the form of deleting or removing data from the database. Just like with creating, retrieving, and updating, the removal of data can happen via the Couchbase Node.js SDK functions or via a N1QL query.

```
bucket.remove("my-key", function(error, result) {});
```

Within the project's **app.js** file, find the fifth step and configure the endpoint to remove a document based on the id that was passed with the HTTP request.

#### Step 06 - Advanced N1QL Queries

Querying for data in Couchbase using N1QL can go far beyond the simple `SELECT` statements. Instead of returning all documents or a document by a specific id, what if you needed to do a search?

N1QL is a very thorough form of SQL that supports operators such as `LIKE` and far beyond.

Try adding a query to search for a document based on the `title` property within the project's **app.js** file. A boilerplate endpoint function can be found after looking for the sixth step.

#### Step 07 - Running the Application with Node.js

With Couchbase Server running and the API created, it is ready for testing. From the Command Prompt or Terminal, execute the following:

```
node app.js
```

With success, the project should be running at http://localhost:3000. Using a tool like Postman or Fiddler, test the API endpoints that were added to the application. The next parts of this workshop will be in regards to creating a front-end, eliminating the need for Postman or similar.

### Developing a Client Frontend with Angular

Using a RESTful API through tools like Postman isn't necessarily an attractive solution. Instead it makes sense to build a client application that can push and consume data. This is where Angular comes in. It allows us to build a client-facing website that communicates with our Node.js backend.

The Angular client front-end will be developed within the **initial/angular** project.

#### Step 01 - Requesting Data from the RESTful API

When it comes to getting data from a RESTful API, an application needs to make an HTTP request to an available endpoint. In Angular, there is what is called the Http service. This service allows for pretty much any kind of HTTP request.

A typical request might look like the following:

```
var myObservable = http.get("http://example.com/endpoint");
```

You'll notice that we're working with observables because Angular uses what's called RxJS.

This means that we have control of our data stream. For example, the following transformation is valid:

```
http.get("http://example.com/endpoint");
    .map(result => result.json())
    .subscribe(result => {
        console.log(result);
    });
```

Open the project's **src/app/list/list.component.ts** file and look out for the first step. The goal here is to make a request against the `/movies` endpoint of the Node.js application. The result of the request should be stored in the public `movies` variable.

#### Step 02 - Removing Data from the RESTful API

The Node.js API has many endpoints, one of which will remove documents from the database. This endpoint can be hit with another HTTP request, similarly to how it was done in the previous step.

Pay attention to the type of HTTP request you're submitting and the type of HTTP request the API is expecting. If successful, the item should be removed from the array of data.

```
movies.splice(index, 1);
```

Splicing an array will remove items based on the index and the count provided.

Open the project's **src/app/list/list.component.ts** file and look for the second step. The goal here is to issue a removal from the database and from within the Angular front-end.

#### Step 03 - Searching for Data in the RESTful API

Searching for remote data in Angular is no different than any other HTTP request since all the heavy lifting is done via the API and database.

Open the project's **src/app/list/list.component.ts** file and look for the third step. The goal here is to take the function parameter and use it to consume data from the `/search` endpoint of the API.

#### Step 04 - Displaying the Remote Data

After making requests to the Node.js RESTful API, the `movies` variable should now contain data to be rendered to the screen. This requires some changes to the HTML.

To display data from an array, one would typically do the following:

```
<ul>
    <li *ngFor="let item of items">
        {{ item }}
    </li>
</ul>
```

In the above example, `items` would be an array of strings. Each iteration of the loop will allow us to print out a particular item called `item`.

Open the project's **src/app/list/list.component.html** and find the fourth step. Take note that we're not working with an unordered list and our array is not of strings.

#### Step 05 - Populating the Form with API Data

When navigating between pages of an Angular application, data is often passed between the pages. For example, maybe an id is passed from a list and is used to populate data on some detail page.

The passed data can typically be retrieved through something like this:

```
route.params.subscribe(params => {
    // Do something with params["id"]
});
```

With the parameter data in hand, an HTTP request can be made against the API for more data.

Find the fifth step in the project's **src/app/save/save.component.ts** file. The goal for this step is to accept a navigation parameter and use it to consume data from the API. This data will eventually populate the form with a particular piece of data.

#### Step 06 - Creating a New Document in the Database

Submitting HTTP requests for POST and PUT are no different than GET or DELETE when it comes to Angular.

Open the project's **src/app/save/save.component.ts** file and find the sixth step. The goal in the sixth step is to take the `movie` object and submit it to the API so it can be saved.

#### Step 07 - Binding Data to the Form

The data being sent from Angular to the Node.js API is user generated via a form. In Angular, variables can be two-way bound to forms with a simple HTML attribute.

Take the following for example:

```
<input type="text" [(ngModel)]="firstname" />
```

Assuming the TypeScript file had a public variable called `firstname`, it would be two-way bound to the HTML form.

Within the project's **src/app/save/save.component.html** file, find the seventh step. The goal is to create two form elements that are bound to the `movie` variable within the TypeScript code.

#### Step 08 - Configuring the Angular Router

In Angular, multiple page applications are simulated using the `Router` service. Every component needs to have a route assigned to it.

An example of such route information might look like this:

```
const routes: Routes = [
    { path: "", component: Page1Component },
    { path: "create", component: Page2Component }
];
```

Any route that has an empty path will be the default route. This means it will be the first to be displayed when the application loads.

Open the project's **src/app/app.routing.ts** file and look for the eighth step. Define a route for each of the components being used. Take note at the source code within the project. A third route should be created that also accesses one of the components. This should be used for updating data.

#### Step 09 - Running the Application with the Angular CLI

With Couchbase Server and the API running, the Angular application is ready for testing. From the Command Prompt or Terminal, execute the following:

```
npm run start
```

With success, the project should be running at http://localhost:4200. Make sure that it is properly communicating with the API and database. Open the browser console to see if there are any errors appearing in the logs.

### Bringing the Client Frontend to Android and iOS with NativeScript

Bringing an application to Android and iOS is often a means in completing a development stack. Having a database, backend, web front-end, and mobile front-end is a great example of a full stack application and full stack development.

Being that the web front-end is Angular, it makes sense to use an Angular framework for mobile as well to reduce code differences. NativeScript with Angular provides that power.

Open the project, **initial/nativescript**, as all development will be done here.

#### Step 01 - Listing Data in a Mobile Application

Between an Angular web application and an Angular NativeScript application there are few to no changes when it comes to the TypeScript code. In the example of this workshop, the component logic can be copied 100% between web and mobile.

Instead, there are differences in the HTML markup. Take for example listing data found in an array:

```
<ListView [items]="people">
    <ng-template let-person="item">
        <Label text="{{ person.firstname }}"></Label>
    </ng-template>
</ListView>
```

In the above example there is an array in the TypeScript called `people` and it is iterated over and displayed in a NativeScript `Label`. While CSS can be copied between web and mobile, the HTML components cannot be.

NativeScript has its own layouts instead of HTML `div` tags. Each row of the list can have layouts such as `GridLayout` or `StackLayout`, but not limited to the two. More information on the available layouts can be found in the User [Interface Layouts](https://docs.nativescript.org/ui/layouts) documentation.

Open the project's **app/components/list/list.component.html** file and find the first step. The goal here is to list the data consumed from the Node.js API.

#### Step 02 - Form Bound Input in a Mobile Application

Lists are not the only components unique to NativeScript. Forms are created a little differently, but in a very familiar fashion.

Take the example of the following form element:

```
<StackLayout class="input-field">
    <Label class="label" text="First Name:"></Label>
    <TextField hint="First Name" [(ngModel)]="firstname" class="input input-border"></TextField>
</StackLayout>
```

The above markup will create an input field bound to a TypeScript variable called `firstname`. This input field will have text above it, like you'd find in an HTML form.

Within the project's **app/components/save/save.component.html** file, find the second step. The goal is to create a form that is bound to the TypeScript code so HTTP requests can be made against the server.

#### Step 03 - Running the Application with the NativeScript CLI

Creating a NativeScript application makes it easy to convert to web or the other direction, hence so few steps. With Couchbase Server and the Node.js API running, the NativeScript mobile application can be tested.

To run the NativeScript application on Android, the Android SDK must be installed and configured. To run the application on iOS, Xcode must be installed and configured. Xcode is only available for macOS users.

From the NativeScript CLI, execute the following command:

```
tns emulate android
```

The `android` used above can easily be swapped with `ios`. In either scenario, a simulator should be launched if each Android and iOS were properly configured.

## Resources

Angular - [https://www.angular.io](https://www.angular.io)

Couchbase - [https://www.couchbase.com](https://www.couchbase.com)

NativeScript - [https://www.nativescript.org](https://www.nativescript.org)

Node.js - [https://www.nodejs.org](https://www.nodejs.org)