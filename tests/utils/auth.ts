export const PASSWORD = 'secret_sauce';

export const AUTH_USERS = ['standard_user', 'problem_user'];

/**
 * Returns the saved storage state path for a user logged in by the setup project.
 */
export function authFile(username: string) {
  return `playwright/.auth/${username}.json`;
}
