from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from .models import Player
from .serializers import PlayerSerializer, LanguageSerializer, PlayerRegistrationSerializer

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

class RegisterPlayer(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PlayerRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getPlayerProfile(request):
    try:
        player = Player.objects.get(user=request.user)
        serializer = PlayerSerializer(player)
        return Response(serializer.data)
    except Player.DoesNotExist:
        return Response({"detail": "Player profile not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getPlayerLanguage(request):
    try:
        player = Player.objects.get(user=request.user)
        serializer = LanguageSerializer(player)
        return Response(serializer.data)
    except Player.DoesNotExist:
        return Response({"detail": "Player profile not found"}, status=status.HTTP_404_NOT_FOUND)