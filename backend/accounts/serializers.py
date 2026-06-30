from rest_framework import serializers
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError as DjangoValidationError
from django.db import IntegrityError
from .models import CustomUser
from .validators import validate_strong_password
import re


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = CustomUser
        fields = ('username', 'email', 'first_name', 'last_name', 'phone', 
                 'income_group', 'state', 'age', 'gender', 'password', 'password_confirm')
    
    def validate_password(self, password):
        """Validate password strength"""
        try:
            validate_strong_password(password)
        except DjangoValidationError as e:
            messages = e.messages if hasattr(e, 'messages') else [str(e)]
            raise serializers.ValidationError(messages)
        return password
    
    def validate_username(self, username):
        """Check if username already exists"""
        if CustomUser.objects.filter(username=username).exists():
            raise serializers.ValidationError(
                "This username is already taken. Please choose a different username."
            )
        return username
    
    def validate_email(self, email):
        """Check if email already exists"""
        if CustomUser.objects.filter(email=email).exists():
            raise serializers.ValidationError(
                "An account with this email already exists. Please use a different email or try logging in."
            )
        return email
    
    def validate_phone(self, phone):
        """Validate phone number - must be exactly 10 digits"""
        if phone:
            # Remove any spaces or special characters
            phone_digits = re.sub(r'\D', '', phone)
            
            # Check if exactly 10 digits
            if len(phone_digits) != 10:
                raise serializers.ValidationError(
                    "Phone number must be exactly 10 digits."
                )
            
            # Check if phone number already exists
            if CustomUser.objects.filter(phone=phone).exists():
                raise serializers.ValidationError(
                    "This phone number is already registered. Please use a different number."
                )
        return phone
    
    def validate(self, attrs):
        """Validate password confirmation"""
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                'password_confirm': "Passwords don't match. Please make sure both passwords are identical."
            })
        return attrs
    
    def create(self, validated_data):
        """Create user with validated data"""
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        
        try:
            user = CustomUser(**validated_data)
            user.set_password(password)
            user.save()
            return user
        except IntegrityError as e:
            # Handle any database integrity errors
            if 'username' in str(e):
                raise serializers.ValidationError({
                    'username': "This username is already taken."
                })
            elif 'email' in str(e):
                raise serializers.ValidationError({
                    'email': "This email is already registered."
                })
            else:
                raise serializers.ValidationError({
                    'non_field_errors': "Registration failed. Please check your information and try again."
                })


class UserProfileSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    old_password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'phone',
                 'income_group', 'state', 'age', 'gender', 'password', 'old_password',
                 'created_at', 'is_staff', 'is_superuser')
        read_only_fields = ('id', 'username', 'created_at', 'is_staff', 'is_superuser', 'income_group', 'state')
    
    def validate_phone(self, phone):
        """Validate phone number - must be exactly 10 digits"""
        if phone:
            # Remove any spaces or special characters
            phone_digits = re.sub(r'\D', '', phone)
            
            # Check if exactly 10 digits
            if len(phone_digits) != 10:
                raise serializers.ValidationError(
                    "Phone number must be exactly 10 digits."
                )
            
            # Check if phone number already exists (exclude current user)
            if self.instance:
                if CustomUser.objects.filter(phone=phone).exclude(id=self.instance.id).exists():
                    raise serializers.ValidationError(
                        "This phone number is already registered to another account."
                    )
        return phone
    
    def validate(self, attrs):
        # If password is being changed, old_password is required
        if 'password' in attrs and attrs.get('password'):
            old_password = attrs.get('old_password')
            if not old_password:
                raise serializers.ValidationError({
                    'old_password': 'Current password is required to change password'
                })
            
            # Verify old password is correct
            user = self.instance
            if not user.check_password(old_password):
                raise serializers.ValidationError({
                    'old_password': 'Current password is incorrect'
                })
        
        return attrs
    
    def update(self, instance, validated_data):
        # Extract password fields before updating other fields
        password = validated_data.pop('password', None)
        validated_data.pop('old_password', None)  # Remove old_password, we don't save it
        
        # Update all other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Hash and set password if provided
        if password:
            instance.set_password(password)
        
        instance.save()
        return instance


class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')
        
        if username and password:
            # Try to find user first
            try:
                user_obj = CustomUser.objects.get(username=username)
            except CustomUser.DoesNotExist:
                raise serializers.ValidationError(
                    "Login failed. Please check your username and try again."
                )
            
            # Now try to authenticate
            user = authenticate(username=username, password=password)
            if not user:
                raise serializers.ValidationError(
                    "Invalid password. Please check your password and try again."
                )
            
            if not user.is_active:
                raise serializers.ValidationError(
                    "Your account has been deactivated. Please contact support for assistance."
                )
            
            attrs['user'] = user
            return attrs
        else:
            raise serializers.ValidationError(
                "Please provide both username and password to log in."
            )
