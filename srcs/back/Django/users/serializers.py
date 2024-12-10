from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Player

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

class PlayerSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Player
        fields = ['username', 'profile_picture', 'first_name', 'last_name', 'email']

class LanguageSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.language', read_only=True)

    class Meta:
        model = Player
        fields = ['username', 'language']

class PlayerRegistrationSerializer(serializers.ModelSerializer):
    username = serializers.CharField(write_only=True)
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Player
        fields = ['username', 'password', 'profile_picture', 'first_name', 'last_name', 'email']

    def create(self, validated_data):
        username = validated_data.pop('username')
        password = validated_data.pop('password')

        user = User.objects.create_user(
            username=username,
            password=password,
            email=validated_data.get('email')
        )

        player = Player.objects.create(
            user=user,
            **validated_data
        )

        return player