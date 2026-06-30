from django.core.management.base import BaseCommand
from schemes.models import Scheme
import json

class Command(BaseCommand):
    help = 'Seed database with sample government schemes'

    def handle(self, *args, **kwargs):
        schemes_data = [
            {
                "name": "PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)",
                "scheme_type": "CENTRAL",
                "category": "AGRICULTURE",
                "ministry": "Ministry of Agriculture and Farmers Welfare",
                "description": "Direct income support to farmers with financial assistance of ₹6,000 per year in three equal installments",
                "benefits": "Financial assistance of ₹6,000 per year paid in three installments of ₹2,000 each, directly transferred to farmer's bank account",
                "eligibility_details": "All landholding farmers' families are eligible. Family is defined as husband, wife and minor children. Institutional land holders and farmers who hold constitutional posts are excluded",
                "required_documents": "Aadhaar card, Bank account details, Land ownership documents, Mobile number",
                "application_process": "Apply online through PM-KISAN portal or visit nearest Common Service Centre (CSC). Farmers can also register through state agriculture offices",
                "official_website": "https://pmkisan.gov.in",
                "helpline_number": "155261",
                "is_active": True,
                "custom_form_fields": {
                    "fields": [
                        {
                            "field_name": "land_area",
                            "field_type": "number",
                            "label": "Total Land Area (in hectares)",
                            "required": True,
                            "placeholder": "Enter land area"
                        },
                        {
                            "field_name": "bank_account",
                            "field_type": "text",
                            "label": "Bank Account Number",
                            "required": True,
                            "placeholder": "Enter bank account number"
                        },
                        {
                            "field_name": "land_document",
                            "field_type": "file",
                            "label": "Land Ownership Document",
                            "required": True,
                            "accept": ".pdf,.jpg,.png"
                        }
                    ]
                }
            },
            {
                "name": "National Scholarship Portal (NSP)",
                "scheme_type": "CENTRAL",
                "category": "EDUCATION",
                "ministry": "Ministry of Education",
                "description": "Comprehensive scholarship scheme for students from various backgrounds including SC/ST, OBC, minorities, and economically weaker sections",
                "benefits": "Financial assistance ranging from ₹10,000 to ₹25,000 per year depending on the course and category. Covers tuition fees, maintenance allowance, and study materials",
                "eligibility_details": "Students from SC/ST/OBC/Minority communities, students with disabilities, and economically weaker sections. Annual family income should be below specified limits (varies by scheme)",
                "required_documents": "Aadhaar card, Income certificate, Caste certificate (if applicable), Previous year mark sheets, Bank account details, Admission proof",
                "application_process": "Register on National Scholarship Portal (scholarships.gov.in), complete profile, upload documents, apply for relevant schemes, and submit application",
                "official_website": "https://scholarships.gov.in",
                "helpline_number": "0120-6619540",
                "is_active": True,
                "custom_form_fields": {
                    "fields": [
                        {
                            "field_name": "course_level",
                            "field_type": "select",
                            "label": "Course Level",
                            "required": True,
                            "options": ["10th Class", "12th Class", "Undergraduate", "Postgraduate", "Diploma"]
                        },
                        {
                            "field_name": "annual_income",
                            "field_type": "number",
                            "label": "Annual Family Income",
                            "required": True,
                            "placeholder": "Enter annual income"
                        },
                        {
                            "field_name": "income_certificate",
                            "field_type": "file",
                            "label": "Income Certificate",
                            "required": True,
                            "accept": ".pdf,.jpg,.png"
                        },
                        {
                            "field_name": "marksheet",
                            "field_type": "file",
                            "label": "Previous Year Marksheet",
                            "required": True,
                            "accept": ".pdf"
                        }
                    ]
                }
            },
            {
                "name": "Ayushman Bharat - Pradhan Mantri Jan Arogya Yojana (PM-JAY)",
                "scheme_type": "CENTRAL",
                "category": "HEALTH",
                "ministry": "Ministry of Health and Family Welfare",
                "description": "World's largest health insurance scheme providing health cover of ₹5 lakh per family per year for secondary and tertiary care hospitalization",
                "benefits": "Free health insurance coverage up to ₹5 lakh per family per year. Covers 1,393 procedures including pre and post hospitalization expenses. Cashless treatment at empanelled hospitals",
                "eligibility_details": "Automatically covers families identified through Socio-Economic Caste Census (SECC) 2011. Includes poor and vulnerable families, rural and urban areas",
                "required_documents": "Aadhaar card, Ration card, SECC verification document, Mobile number for registration",
                "application_process": "Eligible beneficiaries automatically identified. Visit nearest CSC or Ayushman Bharat-PMJAY center for card generation. No application fee required",
                "official_website": "https://pmjay.gov.in",
                "helpline_number": "14555",
                "is_active": True,
                "custom_form_fields": {
                    "fields": [
                        {
                            "field_name": "family_members",
                            "field_type": "number",
                            "label": "Number of Family Members",
                            "required": True,
                            "placeholder": "Enter number of family members"
                        },
                        {
                            "field_name": "ration_card_type",
                            "field_type": "select",
                            "label": "Ration Card Type",
                            "required": True,
                            "options": ["BPL (Below Poverty Line)", "APL (Above Poverty Line)", "Antyodaya", "Not Applicable"]
                        },
                        {
                            "field_name": "ration_card",
                            "field_type": "file",
                            "label": "Ration Card Copy",
                            "required": False,
                            "accept": ".pdf,.jpg,.png"
                        }
                    ]
                }
            },
            {
                "name": "PMEGP (Prime Minister's Employment Generation Programme)",
                "scheme_type": "CENTRAL",
                "category": "EMPLOYMENT",
                "ministry": "Ministry of Micro, Small and Medium Enterprises",
                "description": "Credit-linked subsidy scheme for generating employment opportunities through establishment of micro-enterprises in non-farm sector",
                "benefits": "Subsidy of 15-35% of project cost (up to ₹25 lakh for manufacturing and ₹10 lakh for service sector). Special categories get higher subsidy. Working capital assistance available",
                "eligibility_details": "Indian citizens above 18 years. Minimum 8th pass for projects above ₹10 lakh. Priority to SC/ST/OBC/Minorities/Women/Ex-servicemen/Physically handicapped/NER/Hill and Border areas",
                "required_documents": "Educational certificates, Caste certificate (if applicable), Project report, Identity proof, Address proof, Bank account details, 2 passport size photographs",
                "application_process": "Apply online through PMEGP portal. Submit detailed project report, attend EDP training, obtain bank loan approval, start business with subsidy",
                "official_website": "https://www.kviconline.gov.in/pmegpeportal",
                "helpline_number": "1800-3000-0034",
                "is_active": True,
                "custom_form_fields": {
                    "fields": [
                        {
                            "field_name": "business_type",
                            "field_type": "select",
                            "label": "Type of Business",
                            "required": True,
                            "options": ["Manufacturing", "Service", "Trading"]
                        },
                        {
                            "field_name": "project_cost",
                            "field_type": "number",
                            "label": "Estimated Project Cost (in Rs)",
                            "required": True,
                            "placeholder": "Enter project cost"
                        },
                        {
                            "field_name": "business_experience",
                            "field_type": "textarea",
                            "label": "Previous Business Experience (if any)",
                            "required": False,
                            "placeholder": "Describe your experience"
                        },
                        {
                            "field_name": "project_report",
                            "field_type": "file",
                            "label": "Detailed Project Report",
                            "required": True,
                            "accept": ".pdf,.doc,.docx"
                        }
                    ]
                }
            },
            {
                "name": "PMAY - Pradhan Mantri Awas Yojana (Urban)",
                "scheme_type": "CENTRAL",
                "category": "HOUSING",
                "ministry": "Ministry of Housing and Urban Affairs",
                "description": "Mission to provide affordable housing to urban poor with credit-linked subsidy on home loans and direct financial assistance",
                "benefits": "Interest subsidy up to ₹2.67 lakh on home loans. Direct financial assistance of ₹1.5 lakh for new house construction. Priority to women, SC/ST, minorities, and economically weaker sections",
                "eligibility_details": "All citizens belonging to EWS/LIG/MIG categories. Family should not own pucca house in any part of India. Annual income limits: EWS up to ₹3 lakh, LIG ₹3-6 lakh, MIG-I ₹6-12 lakh, MIG-II ₹12-18 lakh",
                "required_documents": "Aadhaar card, Income certificate, Property documents, Bank account details, Caste certificate (if applicable), Affidavit for not owning house elsewhere",
                "application_process": "Apply through PMAY portal or approach lending institutions. Submit documents, get property verification done, loan processing, and subsidy credit",
                "official_website": "https://pmaymis.gov.in",
                "helpline_number": "1800-11-6163",
                "is_active": True,
                "custom_form_fields": {
                    "fields": [
                        {
                            "field_name": "income_category",
                            "field_type": "select",
                            "label": "Income Category",
                            "required": True,
                            "options": ["EWS (Up to 3 Lakh)", "LIG (3-6 Lakh)", "MIG-I (6-12 Lakh)", "MIG-II (12-18 Lakh)"]
                        },
                        {
                            "field_name": "house_ownership",
                            "field_type": "select",
                            "label": "Do you own any house in India?",
                            "required": True,
                            "options": ["No", "Yes"]
                        },
                        {
                            "field_name": "property_location",
                            "field_type": "text",
                            "label": "Property Location (City/Area)",
                            "required": True,
                            "placeholder": "Enter property location"
                        },
                        {
                            "field_name": "property_document",
                            "field_type": "file",
                            "label": "Property/Land Document",
                            "required": True,
                            "accept": ".pdf,.jpg,.png"
                        }
                    ]
                }
            },
            {
                "name": "National Social Assistance Programme (NSAP)",
                "scheme_type": "CENTRAL",
                "category": "SOCIAL_SECURITY",
                "ministry": "Ministry of Rural Development",
                "description": "Social security scheme providing financial assistance to elderly, widows, and persons with disabilities from BPL families",
                "benefits": "Monthly pension: ₹200-500 for elderly (varies by age), ₹300 for widows, ₹300 for persons with disabilities, Family benefit scheme provides ₹20,000 on death of primary breadwinner",
                "eligibility_details": "Old age pension: 60+ years (BPL), Widow pension: 40-79 years (BPL), Disability pension: 18+ years (BPL) with 80% or more disability",
                "required_documents": "Aadhaar card, Age proof, BPL certificate, Bank account details, Disability certificate (if applicable), Death certificate of spouse (for widow pension)",
                "application_process": "Apply through state social welfare department, Gram Panchayat, or online state portal. Documents verification by authorities, beneficiary list approval",
                "official_website": "https://nsap.nic.in",
                "helpline_number": "1800-180-1551",
                "is_active": True,
                "custom_form_fields": {
                    "fields": [
                        {
                            "field_name": "pension_type",
                            "field_type": "select",
                            "label": "Pension Type",
                            "required": True,
                            "options": ["Old Age Pension", "Widow Pension", "Disability Pension"]
                        },
                        {
                            "field_name": "disability_percentage",
                            "field_type": "number",
                            "label": "Disability Percentage (if applicable)",
                            "required": False,
                            "placeholder": "Enter percentage"
                        },
                        {
                            "field_name": "bpl_certificate",
                            "field_type": "file",
                            "label": "BPL Certificate",
                            "required": True,
                            "accept": ".pdf,.jpg,.png"
                        },
                        {
                            "field_name": "supporting_document",
                            "field_type": "file",
                            "label": "Supporting Document (Age/Widow/Disability proof)",
                            "required": True,
                            "accept": ".pdf,.jpg,.png"
                        }
                    ]
                }
            },
            {
                "name": "Beti Bachao Beti Padhao (BBBP)",
                "scheme_type": "CENTRAL",
                "category": "WOMEN_CHILD",
                "ministry": "Ministry of Women and Child Development",
                "description": "Multi-sectoral initiative to address declining Child Sex Ratio and promote education and empowerment of girl child",
                "benefits": "Sukanya Samriddhi Yojana accounts with attractive interest rates (currently 8.2%). Incentives for girl child education, Healthcare benefits, Community awareness programs",
                "eligibility_details": "Girl child below 10 years of age. Parents/legal guardians can open Sukanya Samriddhi account. One account per girl child, maximum two accounts per family",
                "required_documents": "Birth certificate of girl child, Parents' identity proof, Address proof, Photographs, Bank account details for Sukanya Samriddhi Yojana",
                "application_process": "Open Sukanya Samriddhi account at post office or authorized banks. Deposit minimum ₹250, maximum ₹1.5 lakh per year. Account matures when girl turns 21 or gets married after 18",
                "official_website": "https://wcd.nic.in",
                "helpline_number": "011-23388612",
                "is_active": True,
                "custom_form_fields": {
                    "fields": [
                        {
                            "field_name": "girl_age",
                            "field_type": "number",
                            "label": "Girl Child Age",
                            "required": True,
                            "placeholder": "Enter age (must be below 10)"
                        },
                        {
                            "field_name": "account_type",
                            "field_type": "select",
                            "label": "Account Opening Preference",
                            "required": True,
                            "options": ["Post Office", "Public Sector Bank", "Private Bank"]
                        },
                        {
                            "field_name": "birth_certificate",
                            "field_type": "file",
                            "label": "Birth Certificate",
                            "required": True,
                            "accept": ".pdf,.jpg,.png"
                        },
                        {
                            "field_name": "parent_id",
                            "field_type": "file",
                            "label": "Parent's ID Proof",
                            "required": True,
                            "accept": ".pdf,.jpg,.png"
                        }
                    ]
                }
            },
            {
                "name": "Stand Up India Scheme",
                "scheme_type": "CENTRAL",
                "category": "FINANCIAL",
                "ministry": "Ministry of Finance",
                "description": "Scheme to promote entrepreneurship among SC/ST and women entrepreneurs by facilitating bank loans between ₹10 lakh to ₹1 crore",
                "benefits": "Composite loan between ₹10 lakh to ₹1 crore for setting up greenfield enterprise. Working capital up to 25% of total project cost. Handholding support and credit guarantee",
                "eligibility_details": "SC/ST and/or women entrepreneurs, above 18 years. At least one SC/ST and one women entrepreneur per bank branch. First time entrepreneur for manufacturing, services, or trading sector",
                "required_documents": "Identity proof, Caste certificate (SC/ST), Educational certificates, Project report, Property documents (for collateral), Bank statements, PAN card",
                "application_process": "Submit application through Stand Up India portal or approach bank. Prepare project report, obtain necessary licenses, get bank loan approval, start business",
                "official_website": "https://www.standupmitra.in",
                "helpline_number": "1800-180-1111",
                "is_active": True,
                "custom_form_fields": {
                    "fields": [
                        {
                            "field_name": "business_sector",
                            "field_type": "select",
                            "label": "Business Sector",
                            "required": True,
                            "options": ["Manufacturing", "Services", "Trading in Agricultural Allied Activities"]
                        },
                        {
                            "field_name": "loan_amount",
                            "field_type": "number",
                            "label": "Required Loan Amount (₹10 lakh - ₹1 crore)",
                            "required": True,
                            "placeholder": "Enter loan amount"
                        },
                        {
                            "field_name": "entrepreneur_type",
                            "field_type": "select",
                            "label": "Entrepreneur Category",
                            "required": True,
                            "options": ["SC Category", "ST Category", "Women Entrepreneur"]
                        },
                        {
                            "field_name": "detailed_project_report",
                            "field_type": "file",
                            "label": "Detailed Project Report (DPR)",
                            "required": True,
                            "accept": ".pdf,.doc,.docx"
                        }
                    ]
                }
            },
            {
                "name": "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
                "scheme_type": "CENTRAL",
                "category": "OTHER",
                "ministry": "Ministry of Agriculture and Farmers Welfare",
                "description": "Crop insurance scheme providing insurance coverage and financial support to farmers in event of crop failure",
                "benefits": "Low premium: 2% for Kharif, 1.5% for Rabi, 5% for commercial/horticultural crops. Full coverage against natural calamities, pests, diseases. Quick settlement of claims within 2 months",
                "eligibility_details": "All farmers (sharecroppers, tenant farmers included) growing notified crops in notified areas. Mandatory for loanee farmers. Voluntary for non-loanee farmers",
                "required_documents": "Aadhaar card, Bank account details, Land records, Sowing certificate, Loan account details (if applicable), KYC documents",
                "application_process": "Apply online through PMFBY portal or crop insurance mobile app. Can also apply through banks, CSC, or agriculture office. Insure within 7 days of sowing",
                "official_website": "https://pmfby.gov.in",
                "helpline_number": "1800-180-1551",
                "is_active": True,
                "custom_form_fields": {
                    "fields": [
                        {
                            "field_name": "crop_type",
                            "field_type": "select",
                            "label": "Crop Type",
                            "required": True,
                            "options": ["Kharif Crops", "Rabi Crops", "Commercial/Horticultural Crops"]
                        },
                        {
                            "field_name": "crop_name",
                            "field_type": "text",
                            "label": "Crop Name",
                            "required": True,
                            "placeholder": "e.g., Paddy, Wheat, Cotton"
                        },
                        {
                            "field_name": "insured_area",
                            "field_type": "number",
                            "label": "Area to be Insured (in hectares)",
                            "required": True,
                            "placeholder": "Enter area"
                        },
                        {
                            "field_name": "sowing_certificate",
                            "field_type": "file",
                            "label": "Sowing Certificate",
                            "required": True,
                            "accept": ".pdf,.jpg,.png"
                        }
                    ]
                }
            }
        ]

        created_count = 0
        for scheme_data in schemes_data:
            scheme, created = Scheme.objects.get_or_create(
                name=scheme_data['name'],
                defaults=scheme_data
            )
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'✓ Created: {scheme.name}')
                )
            else:
                self.stdout.write(
                    self.style.WARNING(f'- Already exists: {scheme.name}')
                )

        self.stdout.write(
            self.style.SUCCESS(f'\n✓ Successfully created {created_count} new schemes!')
        )
