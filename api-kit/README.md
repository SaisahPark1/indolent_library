Description:
 - A basic router with CRUD requests, an async handler, and a response envelope made to run independently from other modules

Install:
 - npm i

Usage:
 - npm run test:api

API:
 - This is the most important piece of the api taking requests and outputting clean, predictable responses without erroring out.

Decisions:
 - I had to figure out a way to make this work without an actual database, authentication, or error handler. In the end I needed to copy a snippet of Java to make a working app.

Changes:
 - To implement, one would only need to get rid of the Java as it is unnecessary after combining with the other kits.