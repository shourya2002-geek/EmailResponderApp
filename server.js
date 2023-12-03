const express = require("express");
const app = express();
const path = require("path");
const { authenticate } = require("@google-cloud/local-auth");
const fs = require("fs").promises;
const { google } = require("googleapis");
const routes = require("./routes/routes.js");

const port = 5001;
// these are the scope that we want to access 

app.use("/",routes);

app.listen(port, () => {
  console.log(`server is running ${port}`);
});