/**
 * Authentication utility functions
 */

export function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}

export function isAuthenticated(): boolean {
  const token = getAuthToken();
  return token !== null;
}

export function clearAuthData(): void {
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
} 