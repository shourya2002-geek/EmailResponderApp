const express = require("express");
const router = express.Router();
const app = express();
const path = require("path");
const { authenticate } = require("@google-cloud/local-auth");
const fs = require("fs").promises;
const { google } = require("googleapis");
const labelCreate = require('../labelCreate.js'); // Importing a function to create a label
const unrepliedMessages = require('../unrepliedMessages.js'); // Importing a function to get unreplied messages

// Scope definitions for accessing Gmail API
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.labels",
  "https://mail.google.com/",
];

// Route to handle root endpoint
router.get("/", (req, res) => {
  res.json("Welcome to the app");
});

// Route to handle email processing
router.get("/email", async (req, res) => {
  // Authenticate with Google GMAIL API using local authentication
  const auth = await authenticate({
    keyfilePath: path.join(__dirname, "../secrets.json"),
    scopes: SCOPES,
  });

  // Initialize Gmail API
  const gmail = google.gmail({ version: "v1", auth });

  // Function to perform label creation and email processing at intervals
  async function main() {
    // Create a label for the app
    const labelId = await labelCreate(auth);

    // Set an interval to check and process unreplied messages
    setInterval(async () => {
      // Get messages that have no prior reply
      const messages = await unrepliedMessages(auth);

      if (messages && messages.length > 0) {
        for (const message of messages) {
          // Get message details
          const messageData = await gmail.users.messages.get({
            auth,
            userId: "me",
            id: message.id,
          });

          const email = messageData.data;

          // Check if the email has been replied to previously
          const hasReplied = email.payload.headers.some(
            (header) => header.name === "In-Reply-To"
          );

          if (!hasReplied) {
            // Craft the reply message
            const replyMessage = {
              userId: "me",
              resource: {
                raw: Buffer.from(
                  `To: ${
                    email.payload.headers.find(
                      (header) => header.name === "From"
                    ).value
                  }\r\n` +
                    `Subject: Re: ${
                      email.payload.headers.find(
                        (header) => header.name === "Subject"
                      ).value
                    }\r\n` +
                    `Content-Type: text/plain; charset="UTF-8"\r\n` +
                    `Content-Transfer-Encoding: 7bit\r\n\r\n` +
                    `Thank you for your email. I'm currently on vacation and will reply to you when I return.\r\n`
                ).toString("base64"),
              },
            };

            // Send the crafted reply message
            await gmail.users.messages.send(replyMessage);

            // Add label and move the email
            await gmail.users.messages.modify({
              auth,
              userId: "me",
              id: message.id,
              resource: {
                addLabelIds: [labelId],
                removeLabelIds: ["INBOX"],
              },
            });
          }
        }
      }
    }, Math.floor(Math.random() * (120 - 45 + 1) + 45) * 1000); // Random intervals between 45 and 120 seconds
  }

  // Execute the main function to start email processing
  main();

  res.json({ "Email Responder App": auth }); // Respond with authentication details
});

module.exports = router;
