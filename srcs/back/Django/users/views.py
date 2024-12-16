from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .serializers import PlayerUpdateSerializer, PlayerSerializer, PlayerRegistrationSerializer, FriendRequestSerializer, FriendshipSerializer
from .models import Player, FriendRequest, Friendship
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.db.models import Q

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

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updatePlayerProfile(request):
    try:
        player = Player.objects.get(user=request.user)
        serializer = PlayerUpdateSerializer(player, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            updated_player = Player.objects.get(user=request.user)
            return Response(PlayerSerializer(updated_player).data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Player.DoesNotExist:
        return Response({"detail": "Player profile not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_friends(request):
    friendships = Friendship.objects.filter(user=request.user)
    serializer = FriendshipSerializer(friendships, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_friends(request):
    try:
        player = Player.objects.get(user=request.user)
        friendships = Friendship.objects.filter(user=request.user)
        serializer = FriendshipSerializer(friendships, many=True)
        return Response(serializer.data)
    except Player.DoesNotExist:
        return Response({"detail": "Player profile not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_friend_requests(request):
    try:
        player = Player.objects.get(user=request.user)
        friend_requests = FriendRequest.objects.filter(
            receiver=request.user,
            status='PENDING'
        )
        serializer = FriendRequestSerializer(friend_requests, many=True)
        return Response(serializer.data)
    except Player.DoesNotExist:
        return Response({"detail": "Player profile not found"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_friend_request(request):
    username = request.data.get('username')

    try:
        sender_player = Player.objects.get(user=request.user)
    except Player.DoesNotExist:
        return Response(
            {'detail': 'Sender player profile not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if username == request.user.username:
        return Response(
            {'detail': 'You cannot send a friend request to yourself'},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        receiver_player = Player.objects.get(user__username=username)
    except Player.DoesNotExist:
        return Response(
            {'detail': 'Player not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    if Friendship.objects.filter(
        user=request.user,
        friend=receiver_player.user
    ).exists():
        return Response(
            {'detail': 'You are already friends'},
            status=status.HTTP_400_BAD_REQUEST
        )

    existing_request = FriendRequest.objects.filter(
        sender=request.user,
        receiver=receiver_player.user,
        status='PENDING'
    ).exists()

    if existing_request:
        return Response(
            {'detail': 'Friend request already sent'},
            status=status.HTTP_400_BAD_REQUEST
        )

    friend_request = FriendRequest.objects.create(
        sender=request.user,
        receiver=receiver_player.user,
        status='PENDING'
    )

    serializer = FriendRequestSerializer(friend_request)
    return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_friend_request(request):
    request_id = request.data.get('request_id')

    friend_request = get_object_or_404(
        FriendRequest,
        id=request_id,
        receiver=request.user,
        status='PENDING'
    )

    friend_request.status = 'ACCEPTED'
    friend_request.save()

    Friendship.objects.create(user=request.user, friend=friend_request.sender)
    Friendship.objects.create(user=friend_request.sender, friend=request.user)

    return Response({'detail': 'Friend request accepted'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def remove_friend(request):
    friend_id = request.data.get('friend_id')

    try:
        friend_player = Player.objects.get(user__id=friend_id)
    except Player.DoesNotExist:
        return Response(
            {'detail': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )

    Friendship.objects.filter(
        user=request.user,
        friend=friend_player.user
    ).delete()
    Friendship.objects.filter(
        user=friend_player.user,
        friend=request.user
    ).delete()

    FriendRequest.objects.filter(
        (Q(sender=request.user, receiver=friend_player.user) |
         Q(sender=friend_player.user, receiver=request.user))
    ).delete()

    return Response({'detail': 'Friend removed'})