// Form templates created by developers
const FORM_TEMPLATES = {
  BASIC: {
    name: "Basic Template",
    fields: []
  },

  EDUCATION: {
    name: "Education Scheme",
    fields: [
      {
        name: 'annual_income',
        type: 'number',
        label: 'Annual Family Income (₹)',
        required: true,
        placeholder: 'Enter total annual family income',
        validation: { min: 0, max: 100000000 }
      },
      {
        name: 'current_class',
        type: 'select',
        label: 'Current Class/Year',
        required: true,
        options: [
          'Class 9',
          'Class 10',
          'Class 11',
          'Class 12',
          'Undergraduate Year 1',
          'Undergraduate Year 2',
          'Undergraduate Year 3',
          'Postgraduate Year 1',
          'Postgraduate Year 2',
          'PhD'
        ]
      },
      {
        name: 'previous_marks',
        type: 'number',
        label: 'Previous Year Marks/CGPA (%)',
        required: true,
        placeholder: 'Enter percentage or CGPA',
        validation: { min: 0, max: 100 }
      },
      {
        name: 'school_name',
        type: 'text',
        label: 'School/College/University Name',
        required: true,
        placeholder: 'Enter institution name'
      },
      {
        name: 'course_name',
        type: 'text',
        label: 'Course/Stream',
        required: false,
        placeholder: 'e.g., B.Tech Computer Science'
      }
    ]
  },

  HEALTH: {
    name: "Health Scheme",
    fields: [
      {
        name: 'family_size',
        type: 'number',
        label: 'Total Family Members',
        required: true,
        placeholder: 'Number of family members',
        validation: { min: 1, max: 30 }
      },
      {
        name: 'annual_income',
        type: 'number',
        label: 'Annual Family Income (₹)',
        required: true,
        placeholder: 'Enter total annual family income',
        validation: { min: 0, max: 100000000 }
      },
      {
        name: 'health_condition',
        type: 'textarea',
        label: 'Health Condition/Medical Issue',
        required: true,
        placeholder: 'Describe the health condition in detail',
        rows: 4
      },
      {
        name: 'hospital_preference',
        type: 'text',
        label: 'Preferred Hospital/Clinic',
        required: false,
        placeholder: 'Enter hospital name'
      },
      {
        name: 'monthly_medical_expense',
        type: 'number',
        label: 'Monthly Medical Expenses (₹)',
        required: false,
        placeholder: 'Approximate monthly medical costs'
      }
    ]
  },

  HOUSING: {
    name: "Housing Scheme",
    fields: [
      {
        name: 'current_housing',
        type: 'select',
        label: 'Current Housing Status',
        required: true,
        options: [
          'Owned House',
          'Rented House',
          'Living with Family',
          'No Permanent Shelter',
          'Slum/Temporary Housing'
        ]
      },
      {
        name: 'monthly_income',
        type: 'number',
        label: 'Monthly Family Income (₹)',
        required: true,
        placeholder: 'Enter monthly income',
        validation: { min: 0 }
      },
      {
        name: 'family_size',
        type: 'number',
        label: 'Family Size',
        required: true,
        placeholder: 'Number of family members',
        validation: { min: 1, max: 30 }
      },
      {
        name: 'property_location',
        type: 'text',
        label: 'Preferred Property Location',
        required: false,
        placeholder: 'City/Area preference'
      }
    ]
  },

  EMPLOYMENT: {
    name: "Employment Scheme",
    fields: [
      {
        name: 'qualification',
        type: 'select',
        label: 'Educational Qualification',
        required: true,
        options: [
          'Below 10th',
          '10th Pass',
          '12th Pass',
          'ITI/Diploma',
          'Graduate',
          'Post Graduate',
          'Professional Degree'
        ]
      },
      {
        name: 'work_experience',
        type: 'number',
        label: 'Years of Work Experience',
        required: false,
        placeholder: 'Total years of experience',
        validation: { min: 0, max: 50 }
      },
      {
        name: 'preferred_sector',
        type: 'select',
        label: 'Preferred Work Sector',
        required: false,
        options: [
          'Agriculture',
          'Manufacturing',
          'Construction',
          'IT/Software',
          'Healthcare',
          'Education',
          'Retail/Sales',
          'Transportation',
          'Hospitality',
          'Other'
        ]
      },
      {
        name: 'employment_status',
        type: 'select',
        label: 'Current Employment Status',
        required: true,
        options: [
          'Unemployed',
          'Part-time Employed',
          'Self-employed',
          'Looking for Better Job',
          'Recently Lost Job'
        ]
      },
      {
        name: 'skill_set',
        type: 'textarea',
        label: 'Skills/Expertise',
        required: false,
        placeholder: 'List your skills and expertise',
        rows: 3
      }
    ]
  },

  FINANCIAL: {
    name: "Financial Scheme",
    fields: [
      {
        name: 'monthly_income',
        type: 'number',
        label: 'Monthly Income (₹)',
        required: true,
        placeholder: 'Enter monthly income',
        validation: { min: 0 }
      },
      {
        name: 'bank_account',
        type: 'select',
        label: 'Do you have a bank account?',
        required: true,
        options: ['Yes', 'No']
      },
      {
        name: 'loan_requirement',
        type: 'number',
        label: 'Loan Amount Required (₹)',
        required: false,
        placeholder: 'If applicable'
      },
      {
        name: 'purpose',
        type: 'textarea',
        label: 'Purpose of Financial Assistance',
        required: true,
        placeholder: 'Explain how you will use this assistance',
        rows: 4
      }
    ]
  },

  SOCIAL_SECURITY: {
    name: "Social Security Scheme",
    fields: [
      {
        name: 'monthly_income',
        type: 'number',
        label: 'Monthly Income (₹)',
        required: true,
        placeholder: 'Enter monthly income',
        validation: { min: 0 }
      },
      {
        name: 'disability_status',
        type: 'select',
        label: 'Disability Status',
        required: false,
        options: [
          'None',
          'Physical Disability',
          'Visual Impairment',
          'Hearing Impairment',
          'Mental Disability',
          'Multiple Disabilities'
        ]
      },
      {
        name: 'pension_type',
        type: 'select',
        label: 'Type of Pension Sought',
        required: false,
        options: [
          'Old Age Pension',
          'Widow Pension',
          'Disability Pension',
          'General Pension'
        ]
      }
    ]
  },

  WOMEN_CHILD: {
    name: "Women & Child Welfare",
    fields: [
      {
        name: 'number_of_children',
        type: 'number',
        label: 'Number of Children',
        required: false,
        placeholder: 'Number of children',
        validation: { min: 0, max: 20 }
      },
      {
        name: 'marital_status',
        type: 'select',
        label: 'Marital Status',
        required: true,
        options: [
          'Single',
          'Married',
          'Widow',
          'Divorced',
          'Separated'
        ]
      },
      {
        name: 'monthly_income',
        type: 'number',
        label: 'Monthly Family Income (₹)',
        required: true,
        placeholder: 'Enter monthly income',
        validation: { min: 0 }
      },
      {
        name: 'special_circumstances',
        type: 'textarea',
        label: 'Special Circumstances (if any)',
        required: false,
        placeholder: 'Describe any special circumstances',
        rows: 3
      }
    ]
  }
};

export default FORM_TEMPLATES;
