from django.contrib.auth.models import AbstractUser
from django.db import models

# Extending the default Django User model
class User(AbstractUser):
    # Explicitly specify a primary key for the User model
    id = models.BigAutoField(primary_key=True)  

# Model to represent an email
class Email(models.Model):
    # Explicitly specify a primary key for the Email model
    id = models.BigAutoField(primary_key=True)
    
    # Foreign key to link email to a user, on user deletion, emails are also deleted
    user = models.ForeignKey("User", on_delete=models.CASCADE, related_name="emails")
    
    # Foreign key to indicate the sender of the email, on user deletion, emails are protected
    sender = models.ForeignKey("User", on_delete=models.PROTECT, related_name="emails_sent")
    
    # Many-to-many relationship to indicate the recipients of the email
    recipients = models.ManyToManyField("User", related_name="emails_received")
    
    # Subject of the email with a maximum length of 255 characters
    subject = models.CharField(max_length=255)
    
    # Body of the email, can be blank
    body = models.TextField(blank=True)
    
    # Timestamp when the email is created, automatically set on creation
    timestamp = models.DateTimeField(auto_now_add=True)
    
    # Boolean field to indicate if the email has been read
    read = models.BooleanField(default=False)
    
    # Boolean field to indicate if the email has been archived
    archived = models.BooleanField(default=False)

    # Method to serialize the email data into a dictionary format
    def serialize(self):
        return {
            "id": self.id,
            "sender": self.sender.email,
            "recipients": [recipient.email for recipient in self.recipients.all()],
            "subject": self.subject,
            "body": self.body,
            "timestamp": self.timestamp.strftime("%b %d %Y, %I:%M %p"),
            "read": self.read,
            "archived": self.archived
        }

    # String representation of the Email model
    def __str__(self):
        return f"From: {self.sender}, Sub: {self.subject}"