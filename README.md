# OrbitDB time machine

Repository for orbitdb time machine.

A logical time machine for [OrbitDB](https://github.com/orbitdb/orbit-db) databases.

This repository holds the code for the web application, that allow users to visualise/debug their OrbitDB databases:

`debugger` contains the GUI web application to debug your database

`logger` contains the logger you can add to your own applications to start collecting debug data

# Usage - Database View Page

![Capture](https://user-images.githubusercontent.com/20010384/71241715-3fe76180-2347-11ea-8aa3-57c1a7de8d66.JPG)

### 1. Action Bar

These are the available **modifying** operations on the particular database type. In this case, we are looking at a KeyValue database type, which supports the following operations:

  - `put`: Adds a key-value pair into the database
  - `set`: Modifies a key-value pair if it exists
  - `del`: Deletes a key-value pair if it exists

As such, the available operations will be different depending on the database type.

### 2. Perspective Selector

The perspective selector allows you to select from wich node's perspective you are viewing the oplog. Either click in the box and select a user identitiy, or type the user identitiy directly.

Changing the perspective changes the logging data used to the data collected from the selected node.

### 3. Join Events

This bar encapsulates the time-travelling functionality of this application.

This application will keep a record of every time a JOIN-conflict has been resolved (straightforward joins are ignored). A JOIN-conflict typically refers to case where the Operations Log DAG has a branch after two versions have been JOIN-ed.

Clicking on any of the JOIN events within this bar will change the Operations Log View to the point of occurrence of the selected JOIN event.

### 4. Display Limit

Allows users to change the maximum amount of nodes to display. Increasing this value may lead to bad performance.

### 5. Operations Log View

The entries for the underlying Operations Log will be displayed here. You can see the manner in which the entries are ordered, especially after join events have been resolved through the CRDTs.

There are available interactions with each entries in this view.

  - Hovering

You can hover over the entry node, which will display a summary of the entry's information.

  - Clicking

Clicking on an entry will render the Database Display. This will display the state of the database at that particular entry. The state is obtained by replaying the events from the beginning of time, up till the selected entry.

Depending on the database type, you may encounter different display formats. For instance, the Counter database type will simply display a numeric counter.

# Usage - API

NOTE: The logger only works for browser-based applications, as it makes use of the browser's localstorage.

Install the logger package:

```bash
npm i --save orbit-db-time-machine-logger
```
In you application:

```javascript
import Logger from 'orbit-db-time-machine-logger'

// ... Code to set up your OrbitDB instance ...
// This code will create an OrbitDB store

var logger = new Logger(store)
logger.start()
```

# Setting up Locally

To set up the debugger locally, clone the repository and change to the debugger folder:

```bash
git clone https://github.com/justincqz/orbit-db-time-machine.git
cd debugger
```

Install the necessary dependencies:

```bash
npm i
```

Run the project:

```bash
npm start
```

It will run at http://localhost:3000. This application is built upon [create-react-app](https://github.com/facebook/create-react-app)
