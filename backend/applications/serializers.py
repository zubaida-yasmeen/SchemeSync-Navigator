from rest_framework import serializers
from .models import Application, ApplicationDocument
from django.conf import settings

class ApplicationDocumentSerializer(serializers.ModelSerializer):
    file_size_display = serializers.CharField(source='get_file_size_display', read_only=True)
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ApplicationDocument
        fields = ['id', 'field_name', 'file_path', 'file_url',
                 'original_filename', 'file_size', 'file_size_display', 'uploaded_at']
        read_only_fields = ['file_size', 'uploaded_at']
    
    def get_file_url(self, obj):
        request = self.context.get('request')
        if request:
            return request.build_absolute_uri(f'/media/{obj.file_path}')
        return f'/media/{obj.file_path}'


class ApplicationSerializer(serializers.ModelSerializer):
    documents = ApplicationDocumentSerializer(many=True, read_only=True)
    user_details = serializers.SerializerMethodField()
    scheme_details = serializers.SerializerMethodField()
    
    class Meta:
        model = Application
        fields = ['id', 'application_id', 'user', 'scheme', 'status', 'form_data',
                 'applied_date', 'last_updated', 'remarks', 'documents',
                 'user_details', 'scheme_details']
        read_only_fields = ['applied_date', 'last_updated']
    
    def get_user_details(self, obj):
        return {
            'username': obj.user.username,
            'first_name': obj.user.first_name,
            'last_name': obj.user.last_name,
            'email': obj.user.email,
            'phone': obj.user.phone,
        }
    
    def get_scheme_details(self, obj):
        return {
            'name': obj.scheme.name,
            'category': obj.scheme.category,
            'scheme_type': obj.scheme.scheme_type,
        }
