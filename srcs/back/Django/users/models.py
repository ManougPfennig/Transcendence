from django.db import models
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password

class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    profile_picture = models.URLField(blank=True, null=True)
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    language = models.CharField(max_length=30, default="English")