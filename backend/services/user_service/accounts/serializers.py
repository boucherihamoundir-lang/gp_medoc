from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        token['role'] = user.role
        token['first_name'] = user.first_name
        token['last_name'] = user.last_name
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        # Renvoyer les informations utilisateur directement dans la réponse de login
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'email': self.user.email,
            'role': self.user.role,
            'civility': self.user.civility,
            'first_name': self.user.first_name,
            'last_name': self.user.last_name,
            'full_name': f"{self.user.civility} {self.user.first_name} {self.user.last_name}".strip(),
            'phone': self.user.phone,
            'wilaya': self.user.wilaya,
            'avatar': self.user.avatar,
        }
        return data

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'confirm_password',
            'role', 'civility', 'first_name', 'last_name', 'phone', 'wilaya', 'avatar'
        ]

    def validate(self, data):
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"password": "Les mots de passe ne correspondent pas."})
        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'role', 'civility',
            'first_name', 'last_name', 'phone', 'wilaya', 'avatar',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'username', 'role', 'created_at', 'updated_at']
