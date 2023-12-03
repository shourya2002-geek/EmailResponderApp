const express = require("express"); // Importing Express.js
const app = express(); // Creating an Express application
const path = require("path"); // Utility for handling file paths
const { authenticate } = require("@google-cloud/local-auth"); // Importing Google Cloud authentication utility
const fs = require("fs").promises; // File system promises
const { google } = require("googleapis"); // Importing Google APIs
const routes = require("./routes/routes.js"); // Importing application routes from a separate file

const port = 5001; // Port number the server will listen on

// Middleware: Using the defined routes for handling requests
app.use("/", routes);

// Start the server and listen on the defined port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
