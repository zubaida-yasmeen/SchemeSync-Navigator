import re
from django.core.exceptions import ValidationError
from django.utils.translation import gettext as _

def validate_strong_password(password):
    """
    Validate that the password meets strength requirements:
    - At least 8 characters
    - At least one uppercase letter
    - At least one lowercase letter  
    - At least one digit
    - At least one special character
    """
    if len(password) < 8:
        raise ValidationError(
            _('Password must be at least 8 characters long.'),
            code='password_too_short',
        )
    
    if not re.search(r'[A-Z]', password):
        raise ValidationError(
            _('Password must contain at least one uppercase letter (A-Z).'),
            code='password_no_upper',
        )
    
    if not re.search(r'[a-z]', password):
        raise ValidationError(
            _('Password must contain at least one lowercase letter (a-z).'),
            code='password_no_lower',
        )
    
    if not re.search(r'[0-9]', password):
        raise ValidationError(
            _('Password must contain at least one number (0-9).'),
            code='password_no_digit',
        )
    
    if not re.search(r'[!@#$%^&*()_+\-=\[\]{};\':"\\|,.<>\/?]', password):
        raise ValidationError(
            _('Password must contain at least one special character (!@#$%^&*()_+-=[]{};\':"|,.<>/?).'),
            code='password_no_special',
        )
