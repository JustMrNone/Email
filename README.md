# Django Email Application
![Email](https://justmrnone.github.io/NeverEndingPong/repersentation/mail.png)
This project is a Django-based email application designed for user authentication and email functionalities like sending, receiving, archiving, and deleting emails. Here's a detailed breakdown of each part:

## Features

- User Registration and Authentication
- Composing and Sending Emails
- Viewing Received and Sent Emails
- Archiving and Unarchiving Emails
- Marking Emails as Read
- Deleting Emails
- Replying to Emails
- Project Structure and Explanation

## 1. User Authentication and Views

### Modules and Packages

- `json`: Parses JSON data from requests.
- `django.contrib.auth`: Manages user authentication, login, and logout.
- `django.shortcuts`: Renders templates and redirects HTTP responses.
- `django.contrib.auth.decorators`: Requires login for certain views.
- `django.db`: Handles database errors.
- `django.http`: Returns JSON responses and handles HTTP methods.
- `django.urls`: For URL routing.
- `django.views.decorators.csrf`: Handles CSRF tokens.

### Implemented Views

- `index`: Renders the application homepage (landing page).
- `inbox`: Renders the inbox view for authenticated users.
- `compose`: Handles creating and sending emails via POST requests.
- `mailbox`: Retrieves emails for different mailboxes (inbox, sent, archive) based on user requests.
- `email`: Retrieves, updates, or deletes a specific email based on the request method.
- `register`: Handles user registration with password confirmation and error handling for duplicate emails.
- `login_view`: Manages user login, authenticating users based on provided credentials.
- `logout_view`: Logs out the current user and redirects to the homepage.

## 2. Detailed Explanation of Each View

**index**:

Renders the main application page.

**inbox**:

Checks if the user is authenticated. If yes, renders the inbox page. If not, redirects to the login page.

**compose**:

Handles composing and sending emails (only accepts POST requests):

- Parses JSON data from the request body to extract email details.
- Validates recipients' email addresses (at least one recipient required).
- Retrieves recipient user objects from the database (returns an error if a recipient doesn't exist).
- Creates an email object for each recipient and saves it to the database.
- Sends a JSON response indicating success or failure of the email sending process.

**mailbox**:

Retrieves and returns emails for a specified mailbox (inbox, sent, archive). Filters emails based on mailbox type and authenticated user:

- Inbox: Retrieves received emails (not archived).
- Sent: Retrieves emails sent by the user.
- Archive: Retrieves archived received emails.
- Orders emails by timestamp and returns them as a JSON response.

**email**:

Handles retrieving, updating, and deleting a specific email based on the request method:

- GET: Retrieves and returns the email's details as a JSON response.
- PUT: Updates the email's read and archived status based on provided JSON data.
- DELETE: Deletes the email from the database.
- Validates that the email exists for the authenticated user and handles errors.

**register**:

Handles user registration (processes POST requests containing user registration details):

- Extracts email, password, and password confirmation from the request.
- Ensures passwords match and checks for duplicate email addresses.
- Creates and saves a new user object if validation passes.
- Logs in the user and redirects them to the inbox upon successful registration.
- Renders the registration page with error messages if validation fails.

**login_view**:

Manages the login process:

- Processes POST requests containing the user's email and password.
- Authenticates the user and logs them in if credentials are correct.
- Redirects the user to the inbox page upon successful login.
- Renders the login page with an error message if authentication fails.

**logout_view**:

Logs out the current user and redirects them to the homepage.

## 3. JavaScript Integration

JavaScript enhances the user interface and experience by handling frontend interactions and dynamically updating content without full page reloads.

**Event Listeners and DOM Manipulation:**

- `DOMContentLoaded Event`: Initializes the application by setting up event listeners and loading the default inbox view.
- `Form Submission Handling`: Prevents default form submission behavior, collects form data, and sends it to the server using the Fetch API.
- `Mailbox Loading`: Fetches and displays emails for different mailboxes, dynamically creating and updating DOM elements to show email details.
- `Email Actions`: Handles archiving, unarchiving, replying, and deleting emails by sending requests to the server
