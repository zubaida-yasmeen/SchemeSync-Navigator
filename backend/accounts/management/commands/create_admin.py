import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from django.core.management.base import BaseCommand
from accounts.models import CustomUser

class Command(BaseCommand):
    help = 'Create admin user'
    
    def handle(self, *args, **options):
        if not CustomUser.objects.filter(username='admin').exists():
            admin = CustomUser.objects.create_user(
                username='admin',
                email='admin@schemeseva.com',
                first_name='Admin',
                last_name='User',
                is_staff=True,
                is_superuser=True,
                income_group='GENERAL',
                state='KA',
                age=30,
                gender='MALE'
            )
            admin.set_password('Mueez@456')
            admin.save()
            self.stdout.write(
                self.style.SUCCESS('Successfully created admin user')
            )
        else:
            self.stdout.write(
                self.style.WARNING('Admin user already exists')
            )
