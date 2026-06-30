from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.db.models import Count, Q
from accounts.models import CustomUser
from schemes.models import Scheme
from applications.models import Application
from accounts.serializers import UserProfileSerializer

class AdminStatsView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        # Check admin permission
        if not (request.user.is_staff or request.user.is_superuser):
            return Response({'error': 'Admin privileges required'}, status=403)
        
        # Get statistics
        stats = {
            'totalSchemes': Scheme.objects.count(),
            'totalApplications': Application.objects.count(),
            'totalUsers': CustomUser.objects.filter(is_superuser=False, is_staff=False).count(),
            'pendingApplications': Application.objects.filter(
                status__in=['APPLIED', 'UNDER_REVIEW']
            ).count(),
            'approvedApplications': Application.objects.filter(status='APPROVED').count(),
            'rejectedApplications': Application.objects.filter(status='REJECTED').count(),
        }
        
        return Response(stats)

class AdminUserListView(generics.ListAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        if not (self.request.user.is_staff or self.request.user.is_superuser):
            return CustomUser.objects.none()
        
        # Return only regular users (not admins)
        queryset = CustomUser.objects.filter(
            is_superuser=False, 
            is_staff=False
        ).order_by('-date_joined')
        
        # Search functionality
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(
                Q(first_name__icontains=search) |
                Q(last_name__icontains=search) |
                Q(email__icontains=search) |
                Q(username__icontains=search)
            )
        
        return queryset

class AdminUserDetailView(generics.RetrieveUpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        if not (self.request.user.is_staff or self.request.user.is_superuser):
            raise permissions.PermissionDenied("Admin privileges required")
        return super().get_object()
