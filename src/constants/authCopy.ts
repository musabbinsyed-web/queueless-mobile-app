import type { LiveVenueCopy } from '../components/auth';

export const onboardingCopy = {
  tagline: 'SKIP THE LINE, SAVE YOUR TIME',
  loadingMessage: 'Initializing your priority access...',
  liveCard: {
    badgeLabel: 'LIVE STATUS',
    venueName: 'Coffee Smith',
    statusLine: 'No Wait',
  } satisfies LiveVenueCopy,
  autoAdvanceMs: 3200,
} as const;

export const loginCopy = {
  tagline: 'Wait less, live more.',
  brandSubtitle: 'Log into your account',
  welcomeTitle: 'Welcome back',
  welcomeSubtitle: 'Please enter your details to sign in.',
  emailLabel: 'Email or Phone Number',
  emailPlaceholder: 'name@example.com',
  passwordLabel: 'Password',
  forgotPassword: 'Forgot password?',
  loginCta: 'Login',
  divider: 'OR CONTINUE WITH',
  googleLabel: 'Google',
  appleLabel: 'Apple',
  createAccountPrompt: "Don't have an account?",
  createAccountCta: 'Create an account',
  copyright: '© 2026 QUEUELESS TECHNOLOGIES',
} as const;

export const signUpCopy = {
  brandSubtitle: 'Create your account',
  fullNameLabel: 'Full Name',
  fullNamePlaceholder: 'John Doe',
  emailLabel: 'Email Address',
  emailPlaceholder: 'hello@example.com',
  passwordLabel: 'Password',
  confirmPasswordLabel: 'Confirm Password',
  signUpCta: 'Sign Up',
  divider: 'Or continue with',
  googleLabel: 'Google',
  appleLabel: 'Apple',
  alreadyPrompt: 'Already have an account?',
  loginLink: 'Log In',
  copyright: loginCopy.copyright,
} as const;

export const loginDummyUser = {
  email: 'name@example.com',
  password: '••••••••',
} as const;
