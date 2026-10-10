import { AppRole, hasRole, type Auth0SessionUser} from './auth0-utils';

jest.mock('./auth0', () => ({
  auth0: {
    getSession: jest.fn(),
  },
}));

jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}));

const ROLES_CLAIM = 'https://pyp-admin/roles';

function userWithRoles(roles: unknown): Auth0SessionUser {
  return { sub: 'auth0|123', [ROLES_CLAIM]: roles };
}

describe('hasRole', () => {
  it('should return true when the user has the give role', () => {
    expect(hasRole(userWithRoles(['admin']), AppRole.ADMIN)).toBe(true);
  });

  // it('should return false when the user is missing the give role', () => {
  //   expect(hasRole(userWithRoles('user, super-admin'), AppRole.ADMIN)).toBe(false);
  // })
});
