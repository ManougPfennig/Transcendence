from django.urls import path
from . import views
from .views import MyTokenObtainPairView

from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_view'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.RegisterPlayer.as_view(), name='register_player'),
    path('profile/', views.getPlayerProfile, name='get_player_profile'),
    path('settings/', views.getPlayerLanguage, name='get_player_language'),
]
