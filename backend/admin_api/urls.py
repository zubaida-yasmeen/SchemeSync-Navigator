from django.urls import path
from . import views

urlpatterns = [
    path('stats/', views.AdminStatsView.as_view(), name='admin-stats'),
    path('users/', views.AdminUserListView.as_view(), name='admin-users'),
    path('users/<int:pk>/', views.AdminUserDetailView.as_view(), name='admin-user-detail'),
]
