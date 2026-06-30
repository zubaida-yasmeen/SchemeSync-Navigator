from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.parsers import MultiPartParser, FormParser
from django.http import FileResponse, Http404
from .models import Application, ApplicationDocument
from .serializers import ApplicationSerializer, ApplicationDocumentSerializer
import os
import json
from django.conf import settings

# ============ USER VIEWS ============

class ApplicationListView(generics.ListAPIView):
    """List user's applications"""
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Application.objects.filter(user=self.request.user)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def create_application(request):
    """Create new application with file uploads"""
    try:
        form_data = {}
        files = {}
        
        # Separate files from form data
        for key, value in request.data.items():
            if hasattr(value, 'read'):  # It's a file
                files[key] = value
            else:
                form_data[key] = value
        
        # Parse form_data JSON string
        try:
            parsed_form_data = json.loads(form_data.get('form_data', '{}'))
        except:
            parsed_form_data = {}
        
        # Create application
        application = Application.objects.create(
            user=request.user,
            scheme_id=form_data.get('scheme_id'),
            application_id=form_data.get('application_id'),
            form_data=parsed_form_data,
            status='APPLIED'
        )
        
        # Save uploaded files
        for field_name, file in files.items():
            # Create directory structure
            upload_dir = os.path.join(
                settings.MEDIA_ROOT,
                f'applications/user_{application.user.id}/scheme_{application.scheme.id}'
            )
            os.makedirs(upload_dir, exist_ok=True)
            
            # Generate filename
            ext = file.name.split('.')[-1] if '.' in file.name else 'bin'
            filename = f"{field_name}_{application.id}.{ext}"
            file_path = f'applications/user_{application.user.id}/scheme_{application.scheme.id}/{filename}'
            full_path = os.path.join(settings.MEDIA_ROOT, file_path)
            
            # Save file to disk
            with open(full_path, 'wb+') as destination:
                for chunk in file.chunks():
                    destination.write(chunk)
            
            # Create document record - NO document_type field
            ApplicationDocument.objects.create(
                application=application,
                field_name=field_name,
                file_path=file_path,
                original_filename=file.name,
                file_size=file.size
            )
        
        return Response(
            ApplicationSerializer(application, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )
    
    except Exception as e:
        import traceback
        return Response(
            {'error': str(e), 'traceback': traceback.format_exc()},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


class ApplicationDetailView(generics.RetrieveAPIView):
    """Get application details"""
    serializer_class = ApplicationSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        if self.request.user.is_staff:
            return Application.objects.all()
        return Application.objects.filter(user=self.request.user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def download_document(request, document_id):
    """Download uploaded document"""
    try:
        document = ApplicationDocument.objects.get(id=document_id)
        
        # Check permissions
        if not (request.user == document.application.user or request.user.is_staff):
            return Response(
                {'error': 'Permission denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        file_path = os.path.join(settings.MEDIA_ROOT, document.file_path)
        
        if os.path.exists(file_path):
            return FileResponse(
                open(file_path, 'rb'),
                as_attachment=True,
                filename=document.original_filename
            )
        else:
            raise Http404("File not found")
    
    except ApplicationDocument.DoesNotExist:
        raise Http404("Document not found")


# ============ ADMIN VIEWS ============

class AdminApplicationListView(generics.ListAPIView):
    """Admin: List all applications"""
    serializer_class = ApplicationSerializer
    permission_classes = [IsAdminUser]
    queryset = Application.objects.all().order_by('-applied_date')
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Optional filters
        status_filter = self.request.query_params.get('status')
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        scheme_id = self.request.query_params.get('scheme_id')
        if scheme_id:
            queryset = queryset.filter(scheme_id=scheme_id)
        
        return queryset


class AdminApplicationUpdateView(generics.RetrieveUpdateAPIView):
    """Admin: Update application status"""
    serializer_class = ApplicationSerializer
    permission_classes = [IsAdminUser]
    queryset = Application.objects.all()
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.status = request.data.get('status', instance.status)
        instance.remarks = request.data.get('remarks', instance.remarks)
        instance.save()
        
        serializer = self.get_serializer(instance)
        return Response(serializer.data)
