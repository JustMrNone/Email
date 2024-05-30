from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("inbox", views.inbox, name="inbox"),
    path("login", views.login_view, name="login"),
    path("accounts/login/", views.login_view, name="login_required"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    # API Routes
    path("emails", views.compose, name="compose"),
    path("emails/<int:email_id>", views.email, name="email"),
    path("emails/<str:mailbox>", views.mailbox, name="mailbox"),
]