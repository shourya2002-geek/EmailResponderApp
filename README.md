# Email Responder App for Gmail

This application is designed to automatically respond to unread messages in your Gmail inbox with a predefined message. It utilizes the Gmail API provided by Google to fetch unread messages, detect unreplied messages, and send an automated response.

# Features
--------

-   Automated Response: Detects unread messages and sends a predefined response to those without a previous reply.
-   Label Creation: Creates a specific label ("Auto-Reply") in your Gmail account to organize responded messages.
-   Scheduled Process: Runs at intervals to check for new unread messages and respond to them.
-   Google Cloud Authentication: Uses Google Cloud authentication to access the Gmail API securely.

# Setup
-----

### Prerequisites

-   Node.js installed on your machine.
-   A Google Cloud Platform project set up with the Gmail API enabled.
-   `secrets.json` file containing your Google Cloud authentication credentials.

### Installation

1.  Clone this repository to your local machine.
2.  Install dependencies using `npm install`.
3.  Place your `secrets.json` file in the root directory of the application.

### Configuration

-   Modify the predefined response message in `routes/routes.js` to customize the auto-response.
-   Adjust the port number in `index.js` if necessary.

### Running the Application

Run the application using `npm start`. The server will start on port 5001 by default.

Usage
-----

-   Access `http://localhost:5001/` in your browser to check if the server is running.
-   Navigate to `http://localhost:5001/email` to trigger the autoresponder functionality.
-   Ensure the application continues running for automated responses by keeping the server running.
