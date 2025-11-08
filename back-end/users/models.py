from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    """
    Custom User model extending Django's AbstractUser.
    Uses email as the primary identifier instead of username.
    """

    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=15, blank=True)
    # avatar = models.ImageField(upload_to='avatars/', null=True, blank=True)
    date_joined = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # Username still required for AbstractUser compatibility

    def __str__(self):
        return self.email