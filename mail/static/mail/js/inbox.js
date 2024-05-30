document.addEventListener("DOMContentLoaded", function () {
  // Event listeners for navigation buttons to load respective mailboxes
  document.querySelector("#inbox").addEventListener("click", () => load_mailbox("inbox"));
  document.querySelector("#sent").addEventListener("click", () => load_mailbox("sent"));
  document.querySelector("#archived").addEventListener("click", () => load_mailbox("archive"));
  document.querySelector("#compose").addEventListener("click", compose_email);

  // Load the inbox by default when the page loads
  load_mailbox("inbox");

  // Event listener for the form submission in the compose email view
  const form = document.querySelector("#compose-form");
  const msg = document.querySelector("#message");
  form.addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent default form submission behavior
    const to = document.querySelector("#compose-recipients");
    const subject = document.querySelector("#compose-subject");
    const body = document.querySelector("#compose-body");
    if (to.value.length === 0) return; // Ensure that the recipient field is not empty

    // Send a POST request to the server to save the composed email
    fetch("/emails", {
      method: "POST",
      body: JSON.stringify({
        recipients: to.value,
        subject: subject.value,
        body: body.value,
      }),
    })
    .then((response) => response.json())
    .then((result) => {
      console.log(result.status);
      if (result.status === 201) {
        // If email was sent successfully, load the 'sent' mailbox
        load_mailbox("sent");
      } else {
        // If there was an error, display it to the user
        msg.innerHTML = `<div class="alert alert-danger" role="alert">${result.error}</div>`;
      }
    });
  });
});

// Function to show the compose email view and clear any existing values
function compose_email() {
  document.querySelector("#emails-view").style.display = "none"; // Hide the emails view
  document.querySelector("#compose-view").style.display = "block"; // Show the compose view

  // Clear out the composition fields
  document.querySelector("#compose-recipients").value = "";
  document.querySelector("#compose-subject").value = "";
  document.querySelector("#compose-body").value = "";
}

// Function to load the specified mailbox (inbox, sent, archived)
function load_mailbox(mailbox) {
  document.querySelector("#emails-view").style.display = "block"; // Show the emails view
  document.querySelector("#compose-view").style.display = "none"; // Hide the compose view

  // Display the name of the mailbox
  document.querySelector("#emails-view").innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  // Special case for showing a single email
  if (mailbox === "show_mail") {
    show_mail();
    return;
  }

  // Fetch emails for the specified mailbox
  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      emails.forEach(element => {
        // Determine the sender or recipients based on the mailbox
        let sender_recipients = mailbox !== "sent" ? element.sender : element.recipients;
        // Determine if the email is read (only applicable for the inbox)
        let is_read = mailbox === "inbox" && element.read ? "read" : "";

        // Create a new email item element
        let item = document.createElement("div");
        item.className = `card ${is_read} my-1 items`;
        item.innerHTML = `<div class="card-body" id="item-${element.id}">
          Received: <b>${element.subject}</b>, From: <b>${sender_recipients}</b>, At: <b>${element.timestamp}</b>
          <br>
          ${element.body.slice(0, 100)}
        </div>`;
        document.querySelector("#emails-view").appendChild(item);
        // Add an event listener to show the full email when clicked
        item.addEventListener("click", () => {
          show_mail(element.id, mailbox);
        });
      });
    });
}

// Function to display a single email
function show_mail(id, mailbox) {
  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => {
      document.querySelector("#emails-view").innerHTML = "";
      let item = document.createElement("div");
      item.className = `card`;
      item.innerHTML = `
        <div class="card-body" style="text-align: left;">
          <div style="position: relative;">
            <p style="position: absolute; top: 0; right: 0;">${email.timestamp}</p>
          </div>
          <h1 style="text-align: justify; font-size: 20px;">Subject: ${email.subject}</h1>
          <hr>
          <p style="text-align: justify;">Sender: ${email.sender}</p>
          <p style="text-align: justify;">Recipients: ${email.recipients}</p>
          <hr>
          <p style="text-align: justify;">${email.body}</p>
        </div>
      `;
      document.querySelector("#emails-view").appendChild(item);

      // Only show archive and reply buttons for emails not in the sent mailbox
      if (mailbox !== "sent") {
        let actionContainer = document.createElement("div");
        actionContainer.className = "action-container";

        // Archive button
        let archiveBtn = document.createElement("button");
        archiveBtn.className = `btn archive-btn`;
        archiveBtn.textContent = email.archived ? "Unarchive" : "Archive";
        archiveBtn.addEventListener("click", () => {
          toggle_archive(id, email.archived);
          archiveBtn.textContent = archiveBtn.textContent === "Archive" ? "Unarchive" : "Archive";
        });
        actionContainer.appendChild(archiveBtn);

        // Reply button
        let replyBtn = document.createElement("button");
        replyBtn.className = `btn reply-btn`;
        replyBtn.textContent = "Reply";
        replyBtn.addEventListener("click", () => {
          reply_mail(email.sender, email.subject, email.body, email.timestamp);
        });
        actionContainer.appendChild(replyBtn);

        // Delete button
        let deleteBtn = document.createElement("button");
        deleteBtn.className = `btn delete-btn`;
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
          if (confirm("Are you sure you want to delete this email?")) {
            delete_email(id);
          }
        });
        actionContainer.appendChild(deleteBtn);

        document.querySelector("#emails-view").appendChild(actionContainer);
      } else {
        // Show delete button for emails in the sent mailbox
        let actionContainer = document.createElement("div");
        actionContainer.className = "action-container";

        let deleteBtn = document.createElement("button");
        deleteBtn.className = `btn delete-btn`;
        deleteBtn.textContent = "Delete";
        deleteBtn.addEventListener("click", () => {
          if (confirm("Are you sure you want to delete this email?")) {
            delete_email(id);
          }
        });
        actionContainer.appendChild(deleteBtn);

        document.querySelector("#emails-view").appendChild(actionContainer);
      }

      // Mark the email as read
      make_read(id);
    });
}

// Function to delete an email
function delete_email(id) {
  fetch(`/emails/${id}`, {
    method: "DELETE",
  })
  .then(response => {
    if (response.ok) {
      // Reload the inbox after deletion
      load_mailbox('inbox');
    } else {
      alert('Failed to delete email.');
    }
  });
}

// Function to toggle the archive status of an email
function toggle_archive(id, state) {
  fetch(`/emails/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      archived: !state,
    }),
  });
}

// Function to mark an email as read
function make_read(id) {
  fetch(`/emails/${id}`, {
    method: "PUT",
    body: JSON.stringify({
      read: true,
    }),
  });
}

// Function to prefill the compose view for replying to an email
function reply_mail(sender, subject, body, timestamp) {
  compose_email();
  if (!/^Re:/.test(subject)) subject = `Re: ${subject}`;
  document.querySelector("#compose-recipients").value = sender;
  document.querySelector("#compose-subject").value = subject;

  let pre_fill = `On ${timestamp} ${sender} wrote:\n${body}\n`;

  document.querySelector("#compose-body").value = pre_fill;
}