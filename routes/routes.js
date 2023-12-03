const express = require("express");
const router = express.Router();
const app = express();
const path = require("path");
const { authenticate } = require("@google-cloud/local-auth");
const fs = require("fs").promises;
const { google } = require("googleapis");
const labelCreate = require('../labelCreate.js');
const unrepliedMessages = require('../unrepliedMessages.js');

// these are the scope that we want to access 
const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/gmail.labels",
  "https://mail.google.com/",
];



router.get("/", (req, res) => {
    res.json("Welcome to the app");
  });

router.get("/email", async (req, res) => {

    // here i am taking google GMAIL  authentication 
    const auth = await authenticate({
      keyfilePath: path.join(__dirname, "../secrets.json"),
      scopes: SCOPES,
    });
  
    // console.log("this is auth",auth)
  
    // here i getting authorize gmail id
    const gmail = google.gmail({ version: "v1", auth });
  
  
    //  here i am finding all the labels availeble on current gmail
    const response = await gmail.users.labels.list({
      userId: "me",
    });
  
 
  
    async function main() {
      // Create a label for theApp
      const labelId = await labelCreate(auth);
      // console.log(`Label  ${labelId}`);
      // Repeat  in Random intervals
      setInterval(async () => {
        //Get messages that have no prior reply
        const messages = await unrepliedMessages(auth);
        // console.log("Unreply messages", messages);
  
        //  Here i am checking is there any gmail that did not get reply
        if (messages && messages.length > 0) {
          for (const message of messages) {
            const messageData = await gmail.users.messages.get({
              auth,
              userId: "me",
              id: message.id,
            });
  
            const email = messageData.data;
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
      }, Math.floor(Math.random() * (120 - 45 + 1) + 45) * 1000);
    }
  
  
    
    main();
    // const labels = response.data.labels;
    res.json({ "Email Responder App": auth });
  });
  



module.exports = router;
