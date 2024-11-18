from django.urls import path
from . import views

urlpatterns = [
	path("createCustomGame", views.createCustomGame, name="createCustomGame"),
]
