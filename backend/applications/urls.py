from django.urls import path
from . import views

urlpatterns = [
    # User endpoints
    path('', views.ApplicationListView.as_view(), name='application-list'),
    path('create/', views.create_application, name='application-create'),
    path('<int:pk>/', views.ApplicationDetailView.as_view(), name='application-detail'),
    path('documents/<int:document_id>/download/', views.download_document, name='document-download'),
    
    # Admin endpoints - ADD THESE
    path('admin/', views.AdminApplicationListView.as_view(), name='admin-application-list'),
    path('admin/<int:pk>/', views.AdminApplicationUpdateView.as_view(), name='admin-application-update'),
]
