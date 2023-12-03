const express = require("express");
const app = express();
const path = require("path");
const { authenticate } = require("@google-cloud/local-auth");
const fs = require("fs").promises;
const { google } = require("googleapis");

// Function to fetch unreplied messages from Gmail
async function unrepliedMessages(auth) {
  // Create a Gmail client using the provided authentication
  const gmail = google.gmail({ version: "v1", auth });

  // Fetch a list of unread messages from the INBOX label
  const response = await gmail.users.messages.list({
    userId: "me",
    labelIds: ["INBOX"], // Only look in the INBOX
    q: "is:unread", // Search for unread messages
  });

  // Return the array of messages, or an empty array if there are no messages
  return response.data.messages || [];
}

module.exports = unrepliedMessages; // Export the function for external use
