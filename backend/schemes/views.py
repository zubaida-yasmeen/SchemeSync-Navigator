from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.db.models import Exists, OuterRef
from .models import Scheme, UserFavorite
from .serializers import SchemeListSerializer, SchemeDetailSerializer
from applications.models import Application

# List all active schemes
class SchemeListView(generics.ListAPIView):
    serializer_class = SchemeListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        queryset = Scheme.objects.filter(is_active=True)
        
        # Exclude schemes user has already applied to
        applied_schemes = Application.objects.filter(user=user).values_list('scheme_id', flat=True)
        queryset = queryset.exclude(id__in=applied_schemes)
        
        # Apply filters
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        scheme_type = self.request.query_params.get('scheme_type')
        if scheme_type:
            queryset = queryset.filter(scheme_type=scheme_type)
        
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)
        
        return queryset

# Get scheme details
class SchemeDetailView(generics.RetrieveAPIView):
    queryset = Scheme.objects.all()
    serializer_class = SchemeDetailSerializer
    permission_classes = [IsAuthenticated]

# Toggle favorite
@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def toggle_favorite(request, pk):
    try:
        scheme = Scheme.objects.get(pk=pk)
        user = request.user
        
        if request.method == 'POST':
            UserFavorite.objects.get_or_create(user=user, scheme=scheme)
            return Response({'message': 'Added to favorites'}, status=status.HTTP_201_CREATED)
        
        elif request.method == 'DELETE':
            UserFavorite.objects.filter(user=user, scheme=scheme).delete()
            return Response({'message': 'Removed from favorites'}, status=status.HTTP_204_NO_CONTENT)
    
    except Scheme.DoesNotExist:
        return Response({'error': 'Scheme not found'}, status=status.HTTP_404_NOT_FOUND)

# Get user's favorite schemes
class FavoriteSchemeListView(generics.ListAPIView):
    serializer_class = SchemeListSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        favorite_ids = UserFavorite.objects.filter(user=user).values_list('scheme_id', flat=True)
        return Scheme.objects.filter(id__in=favorite_ids, is_active=True)


# ============ ADMIN VIEWS ============

# Admin: List all schemes (including inactive)
class AdminSchemeListView(generics.ListAPIView):
    queryset = Scheme.objects.all().order_by('-created_at')
    serializer_class = SchemeDetailSerializer
    permission_classes = [IsAdminUser]

# Admin: Create new scheme
class AdminSchemeCreateView(generics.CreateAPIView):
    queryset = Scheme.objects.all()
    serializer_class = SchemeDetailSerializer
    permission_classes = [IsAdminUser]

# Admin: Update or delete scheme
class AdminSchemeUpdateView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Scheme.objects.all()
    serializer_class = SchemeDetailSerializer
    permission_classes = [IsAdminUser]
