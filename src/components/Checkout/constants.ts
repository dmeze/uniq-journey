export const signUpFields = [
  { id: 'name', type: 'text', label: 'Name' },
  {
    id: 'phone',
    type: 'tel',
    label: 'Phone',
    pattern: '^[0-9]{7,10}$',
    title:
      'Enter a valid phone number without a country code (e.g., 1234567 or 1234567890)',
  },
  { id: 'email', type: 'email', label: 'Email' },
  {
    id: 'password',
    type: 'password',
    label: 'Password',
    pattern: '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}',
    title:
      'Password must be at least 8 characters long and include at least one number, one uppercase and one lowercase letter.',
  },
]

export const signInFields = [
  { id: 'email', type: 'email', label: 'Email' },
  {
    id: 'password',
    type: 'password',
    label: 'Password',
    pattern: '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}',
    title:
      'Password must be at least 8 characters long and include at least one number, one uppercase and one lowercase letter.',
  },
]
