from django.db import models
from django.contrib.auth import get_user_model
from schemes.models import Scheme

User = get_user_model()

class Application(models.Model):
    STATUS_CHOICES = [
        ('APPLIED', 'Applied'),
        ('UNDER_REVIEW', 'Under Review'),
        ('APPROVED', 'Approved'),
        ('REJECTED', 'Rejected'),
        ('ON_HOLD', 'On Hold'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications')
    scheme = models.ForeignKey(Scheme, on_delete=models.CASCADE, related_name='applications')
    application_id = models.CharField(max_length=100, unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='APPLIED')
    form_data = models.JSONField(default=dict, null=True, blank=True)
    
    applied_date = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    remarks = models.TextField(blank=True, null=True)
    
    class Meta:
        db_table = 'applications_application'
        ordering = ['-applied_date']
    
    def __str__(self):
        return f"{self.application_id} - {self.user.username}"


class ApplicationDocument(models.Model):
    application = models.ForeignKey(Application, on_delete=models.CASCADE, related_name='documents')
    field_name = models.CharField(max_length=100)
    file_path = models.CharField(max_length=500)
    original_filename = models.CharField(max_length=255)
    file_size = models.IntegerField()
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'applications_document'
        ordering = ['-uploaded_at']

    
    class Meta:
        db_table = 'applications_document'
        ordering = ['-uploaded_at']
    
    def __str__(self):
        return f"{self.application.application_id} - {self.field_name}"
    
    def get_file_size_display(self):
        if self.file_size < 1024:
            return f"{self.file_size} B"
        elif self.file_size < 1024 * 1024:
            return f"{self.file_size / 1024:.2f} KB"
        else:
            return f"{self.file_size / (1024 * 1024):.2f} MB"
