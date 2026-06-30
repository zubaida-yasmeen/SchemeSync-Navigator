from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import CustomUser
from .serializers import (
    UserRegistrationSerializer, 
    UserProfileSerializer, 
    UserLoginSerializer
)

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            
            # Generate tokens for immediate login
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Account created successfully! Welcome to Scheme Seva.',
                'user': UserProfileSerializer(user).data,
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            detail = getattr(serializer, 'errors', None)
            if detail:
                return Response(detail, status=status.HTTP_400_BAD_REQUEST)
            return Response({
                'error': 'Registration failed. Please try again or contact support if the problem persists.'
            }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    serializer = UserLoginSerializer(data=request.data)
    
    try:
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'message': f'Welcome back, {user.first_name or user.username}! Login successful.',
            'user': UserProfileSerializer(user).data,
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        })
    except Exception as e:
        detail = getattr(serializer, 'errors', None)
        if detail:
            if isinstance(detail, dict):
                first_error = next(iter(detail.values()))
                if isinstance(first_error, list):
                    first_error = first_error[0]
                return Response({'error': str(first_error)}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': str(detail)}, status=status.HTTP_400_BAD_REQUEST)

        if hasattr(e, 'detail'):
            if isinstance(e.detail, dict):
                first_error = next(iter(e.detail.values()))
                if isinstance(first_error, list):
                    first_error = first_error[0]
                return Response({'error': str(first_error)}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': str(e.detail[0]) if isinstance(e.detail, list) else str(e.detail)}, status=status.HTTP_400_BAD_REQUEST)

        return Response({'error': 'Login failed. Please check your credentials and try again.'}, status=status.HTTP_400_BAD_REQUEST)

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        return self.request.user
