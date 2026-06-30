from django.test import TestCase
from rest_framework.test import APITestCase


class AuthFlowTests(APITestCase):
    def test_registration_returns_validation_errors_for_weak_password(self):
        response = self.client.post(
            '/api/auth/register/',
            {
                'username': 'newuser',
                'email': 'newuser@example.com',
                'first_name': 'New',
                'last_name': 'User',
                'phone': '9876543210',
                'password': 'weak',
                'password_confirm': 'weak',
            },
            format='json',
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn('password', response.data)

    def test_login_returns_error_for_unknown_user(self):
        response = self.client.post(
            '/api/auth/login/',
            {'username': 'unknown', 'password': 'Password123!'},
            format='json',
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn('error', response.data)
