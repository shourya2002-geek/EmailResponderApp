const express = require("express");
const app = express();
const path = require("path");
const { authenticate } = require("@google-cloud/local-auth");
const fs = require("fs").promises;
const { google } = require("googleapis");

// The name of the label to be created or identified
const labelName = "Auto-Reply";

// Function to create or retrieve a label from Gmail
async function labelCreate(auth) {
  const gmail = google.gmail({ version: "v1", auth });

  try {
    // Attempt to create a new label
    const response = await gmail.users.labels.create({
      userId: "me",
      requestBody: {
        name: labelName,
        labelListVisibility: "labelShow",
        messageListVisibility: "show",
      },
    });

    // Return the ID of the created label
    return response.data.id;
  } catch (error) {
    // Handle label creation conflict (label already exists)
    if (error.code === 409) {
      // Retrieve a list of labels
      const response = await gmail.users.labels.list({
        userId: "me",
      });

      // Find the label by name from the list
      const label = response.data.labels.find(
        (label) => label.name === labelName
      );

      // Return the ID of the existing label
      return label.id;
    } else {
      // Throw any other errors encountered during label creation
      throw error;
    }
  }
}

module.exports = labelCreate; // Export the function for external use
