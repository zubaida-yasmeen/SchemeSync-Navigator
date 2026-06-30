from rest_framework import serializers
from .models import Scheme, UserFavorite

class SchemeListSerializer(serializers.ModelSerializer):
    is_favorite = serializers.SerializerMethodField()
    has_applied = serializers.SerializerMethodField()
    
    class Meta:
        model = Scheme
        fields = ['id', 'name', 'description', 'scheme_type', 'category', 
                 'ministry', 'benefits', 'eligibility_details', 'required_documents',
                 'application_process', 'official_website', 'helpline_number',
                 'is_active', 'created_at', 'is_favorite', 'has_applied', 
                 'custom_form_fields']
    
    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return UserFavorite.objects.filter(user=request.user, scheme=obj).exists()
        return False
    
    def get_has_applied(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            from applications.models import Application
            return Application.objects.filter(user=request.user, scheme=obj).exists()
        return False


class SchemeDetailSerializer(serializers.ModelSerializer):
    is_favorite = serializers.SerializerMethodField()
    has_applied = serializers.SerializerMethodField()
    
    class Meta:
        model = Scheme
        fields = '__all__'
    
    def get_is_favorite(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return UserFavorite.objects.filter(user=request.user, scheme=obj).exists()
        return False
    
    def get_has_applied(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            from applications.models import Application
            return Application.objects.filter(user=request.user, scheme=obj).exists()
        return False
