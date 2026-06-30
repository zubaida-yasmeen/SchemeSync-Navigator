from django.urls import path
from . import views

urlpatterns = [
    # User endpoints
    path('', views.SchemeListView.as_view(), name='scheme-list'),
    path('<int:pk>/', views.SchemeDetailView.as_view(), name='scheme-detail'),
    path('<int:pk>/favorite/', views.toggle_favorite, name='toggle-favorite'),
    path('favorites/', views.FavoriteSchemeListView.as_view(), name='favorite-schemes'),
    
    # Admin endpoints
    path('admin/list/', views.AdminSchemeListView.as_view(), name='admin-scheme-list'),
    path('admin/create/', views.AdminSchemeCreateView.as_view(), name='admin-scheme-create'),
    path('admin/<int:pk>/', views.AdminSchemeUpdateView.as_view(), name='admin-scheme-update'),
]
