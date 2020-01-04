# Logger

[![Build Status](https://travis-ci.com/justincqz/orbit-db-time-machine.svg?branch=master)](https://travis-ci.com/justincqz/orbit-db-time-machine)

Logger for OrbitDB time machine that can be added to projects to enable using OrbitDB Time Machine for time travel.

# Getting started

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
You can now use the debugger by visiting https://orbitdb-time-machine.netlify.com/ and entering your database address.
