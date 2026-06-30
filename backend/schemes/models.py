from django.db import models
from accounts.models import CustomUser

class Scheme(models.Model):
    SCHEME_TYPE_CHOICES = [
        ('CENTRAL', 'Central Government'),
        ('STATE', 'State Government'),
    ]
    
    CATEGORY_CHOICES = [
        ('AGRICULTURE', 'Agriculture & Rural Development'),
        ('EDUCATION', 'Education & Skill Development'),
        ('HEALTH', 'Health & Nutrition'),
        ('EMPLOYMENT', 'Employment & Livelihood'),
        ('HOUSING', 'Housing & Urban Development'),
        ('SOCIAL_SECURITY', 'Social Security & Welfare'),
        ('WOMEN_CHILD', 'Women & Child Development'),
        ('FINANCIAL', 'Financial Services'),
        ('OTHER', 'Other'),
    ]
    
    name = models.CharField(max_length=200)
    description = models.TextField()
    scheme_type = models.CharField(max_length=10, choices=SCHEME_TYPE_CHOICES)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    ministry = models.CharField(max_length=100)
    
    # Use the column that already exists in DB
    custom_form_fields = models.JSONField(
        null=True, 
        blank=True,
        help_text='Custom application fields'
    )
    form_template = models.CharField(
        max_length=50, 
        blank=True, 
        null=True,
        help_text='Form template name'
    )
    
    # Rest of fields...
    income_groups = models.JSONField(default=list, blank=True)
    applicable_states = models.JSONField(default=list, blank=True)
    age_min = models.PositiveIntegerField(null=True, blank=True)
    age_max = models.PositiveIntegerField(null=True, blank=True)
    gender_applicable = models.JSONField(default=list, blank=True)
    
    benefits = models.TextField()
    eligibility_details = models.TextField()
    required_documents = models.TextField()
    application_process = models.TextField()
    official_website = models.URLField(blank=True, null=True)
    helpline_number = models.CharField(max_length=20, blank=True, null=True)
    
    is_active = models.BooleanField(default=True)
    launch_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'schemes_scheme'
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name


class UserFavorite(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='favorites')
    scheme = models.ForeignKey(Scheme, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'schemes_userfavorite'
        unique_together = ('user', 'scheme')
    
    def __str__(self):
        return f"{self.user.username} - {self.scheme.name}"
