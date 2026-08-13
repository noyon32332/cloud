const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  'auth/admin-restricted-operation': 'This operation is restricted to administrators.',
  'auth/account-exists-with-different-credential': 'An account already exists with the same email but a different sign-in method. Please sign in using that method instead.',
  'auth/email-already-in-use': 'An account with this email already exists. Please sign in instead.',
  'auth/expired-action-code': 'This link is invalid or has expired. Please request a new one.',
  'auth/invalid-action-code': 'This link is invalid or has expired. Please request a new one.',
  'auth/invalid-api-key': 'Authentication is not configured correctly. Please contact support.',
  'auth/invalid-credential': 'Incorrect email or password. Please check your details and try again.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/invalid-password': 'The password is incorrect. Please try again.',
  'auth/user-disabled': 'This account has been disabled. Please contact support.',
  'auth/user-not-found': 'No account found with this email address. Please check your details or create an account.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/weak-password': 'Password should be at least 6 characters.',
  'auth/too-many-requests': 'Too many attempts. Please try again later.',
  'auth/network-request-failed': 'Network error. Please check your connection and try again.',
  'auth/operation-not-allowed': 'This sign-in method is not enabled. Please contact support.',
  'auth/popup-blocked': 'The sign-in popup was blocked by your browser. Please allow popups and try again.',
  'auth/popup-closed-by-user': 'Sign-in was cancelled. Please try again.',
  'auth/cancelled-popup-request': 'Sign-in was cancelled. Please try again.',
  'auth/user-mismatch': 'The provided credentials do not match the signed-in user.',
  'auth/requires-recent-login': 'For your security, please sign in again before completing this action.',
  'auth/missing-continue-uri': 'A required link is missing. Please try again.',
  'auth/invalid-continue-uri': 'The link provided is invalid. Please try again.',
}

export function getFirebaseErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code?: unknown }).code
    if (typeof code === 'string' && FIREBASE_ERROR_MESSAGES[code]) {
      return FIREBASE_ERROR_MESSAGES[code]
    }
  }
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallback
}
