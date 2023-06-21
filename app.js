/**
 * Run server
 */
const express = require("express");
const app = express();
const fs = require("fs");

const pseudonymisation = require("./pseudonymisation");

// Routes registered here
// *TODO* Extract into a route config for bigger apps
app.get('/', (_, res) => {
  fs.readFile("index.html", "utf-8", (err, data) => {
    if (err) {
      // TODO add error handling
    } else {
      res.header({'Content-Type': 'text/html'});
      res.statusCode = 200;
      res.send(data);
    }
  });
})

app.post('/pseudonymise', async (req, res) => {
  // TODO fix the dynamic import
  const formidable = await import("formidable");
  try {
    const form = await (new formidable.IncomingForm()).parse(req);
    // IncomingForm returns an array, where attached files are in the second element
    const file = form[1].upload[0].filepath;
    pseudonymisation.anonymise(res, file)
  } catch (err) {
    // TODO add error handling
  }
})

app.listen(3000)
