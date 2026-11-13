import { AppRole, getRolesFromUser, hasRole, ROLES_CLAIM, tryGetRolesClaimFromIdToken } from './auth0-utils';
import type { Auth0SessionUser } from './auth0-utils';

jest.mock('./auth0', () => {
  auth0: {
    getSession: jest.fn();
  }
})

jest.mock('next/navigation', () => {
  redirect: jest.fn();
});

const mockAdminToken= 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJaeFlkNWg4SFhRU2o2dlFDSDNBVSJ9.eyJodHRwczovL3B5cC9jbGFpbXMvcmVzdGF1cmFudCI6InR1bnNiZXJnLWZlc3RpdmFsIiwiaHR0cHM6Ly9weXAtYWRtaW4vcm9sZXMiOlsiYWRtaW4iXSwiaHR0cHM6Ly9weXAtYWRtaW4vaXNfYWRtaW4iOnRydWUsImdpdmVuX25hbWUiOiJBbm5hIiwiZmFtaWx5X25hbWUiOiJTZXZvc3R5YW5vdmEgQXRhbGF5Iiwibmlja25hbWUiOiJpbmZvIiwibmFtZSI6IkFubmEgU2V2b3N0eWFub3ZhIEF0YWxheSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS0vQUxWLVVqVlBGN3NzQ2NuS0pvVXhBd3J2Q2ZkbFRjZDYwMzFGcmlFWXBJaXlGWW51aTNmT0V0d2JJaHJBMTBNWS0zdHNJcWZmMGV5Qlo2dGZHV3BGRl9JemxVcnd3RGtNTnFrXy15QTE1OUYyQnFJckNCdnlNbUE2NHg5cTBXdU5oYS0zcDVDWll2TFVaNTl2MzZQVWpQbzVHbThuVzB5Nk1Eb0xTeVNXU2QzWWpNOWJldFBxanNxQ3VTT09ZWlctc3Nhei1ZQnVkZG5pMEpaUndMVnBvWlZmcVlMU1o5RHRFenNPOGt3Nkd4NUJ2SU4xMFpBbmVkQlBHeEVFQTMxb1hoSWd5SThhMXFNbE1yck1hZkcza0paclRZT1RKZVJSd0dqamtwSXN0NXM3WlNyTGtkOTV3cEQyNS0tZ1VaVGduY3JVaXVlSklGdGVqRnZSVEpaMG01VzN6ZzI3OGZCeERNVk5Xa3ZiTVR0UnJTQlZBMzlNcV9oM2JoNGFfZnJzX1BQanpHV29sMTQtMk82WWdQVTdlSUVfMFVDMzlsSDFqbzg3WVhlX2M4OXFJbVpfa1dWUzh6cS1TYmhaQk9uanh3VEJSakZLTU1Dd2xjcjBaMFo0dk4zMUt2TWYwV2JweTRySWo4cy1WVzJDaW1KYUNQZFFILVZxcUZuYUZkUzh5WlM2Y2Nac3pIX0JOYXdidFBBWUYzOFpqUWlmd01xdXB1c1NGNnYwUUMzMVRsbjBYM1BsQXNQT05iSXJtM0NyT3c4SnJ0aUltNlpQZDg3YWdNWUpzM3BjZFdUeExjVHE0eXlvNExqaGhTYXI0ZS05aGJDYnFIbmphZDJqY0lXdGIxd0tlOHRDWTRzWk1JTnRaOENycFR0bVM3SEwwR1J5QTZlR0hGMXdsSkNGdDNVaDB4ZEpWb0lmVjZod0NpSGZqYjBtb3lMUDYta1FNemhmanNHaGVDZXhIN3AtaXY4Rm1kTjl5cldER0EtUzZyeHd5UllUZ1NEdmFfNE93MkU1dU9HMU9SQVhoU0FXRnBtcktBNGVBOTJRTm56eGNvYTNfOWFrQXVxdEtQS3pIbUpvdjNrRE5LWjJqdFJvWndYRTh1d2pfaEx3VnlwQXB3aTBIb0ttcGNXUHR5bkZXb0dPbmN6ejgwMTBvaThLekI4NWZ3Y0Z4bHhfak5oODl1LUs0VklrLTktZFRDUEhGZWJEUjdhdzdCUE54a2hfMHJfMXBPZVJRUGh6SWdzZGczd05JQ2JEQk9yaUQ3ZFdUc2h1Mi1PMWNiRlRtVHE5d2x2NUNyTWpGUTdSWXN3S0FNTGwyS3dHRmNfTkhYaEs4MHZya1N1Skh4SUNfeHVaMk5fdWN6czBWRkx1dUpHVXVqNFk2c0t0Z1FEU2ZJVXFUbmplMEU5VEVPSzVMTzB6Zm8wNWl6Y3pIOFJhT2dDYT1zOTYtYyIsInVwZGF0ZWRfYXQiOiIyMDI2LTEwLTE1VDE4OjMzOjM1LjEzNFoiLCJlbWFpbCI6ImluZm9AYW5uYWF0YWxheS5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiaXNzIjoiaHR0cHM6Ly9kZXYtam01bTB6M3hrcXh6dGlweC51cy5hdXRoMC5jb20vIiwiYXVkIjoiMnRwbnU3d1c1ZE5Ebm40bW5SaUlTM2lISUtGM2oyRjUiLCJzdWIiOiJnb29nbGUtb2F1dGgyfDExNTA5OTg4MDExNDk3MDcwNDA3MSIsImlhdCI6MTc5MjA4OTIxNiwiZXhwIjoxNzkyMTI1MjE2LCJzaWQiOiJneURIUUFnRWd3OFF2SVcxSzZ3MHFzMGR3RDZQYTFSSyIsIm5vbmNlIjoiZjN0TTJSUURIU0Y2WkJmY0k5MEVjVkJFNC1feWdMaERSWDNkVkJ4RzNPNCJ9.CyBZm0PdrREw_5f-okF9BlQdZFELX2zSz3VQqU3BKy5OTlcdRFFJ4TqQAiqPFsAd4rbmLqhGhVkW_UU6rUR7PzFCRdpxtf-v-_zeMAGyhCyftJqlRrkQl3s8IbNH1zSwxlPtfF49Zc-I-u0fpvyccK9nzQh6u4OgDg-pAaXUZF_rQ05OHqhFh0qGWCFXDLu3x5wta3DMgdxj7XXOxk9nigGCVyEWAg45DYExC-BMlfgln28JxNBTcith0v2CeGwbevtyQqpO_-wLSjUjb9YAjoGdN8zdiLhvd9FbTiKR7fSoijE-bSBMJy57KBDnOr4jksME8SS5L9gzygWF8s0gsQ';
const mockInvalidToken= 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJaeFlkNWg4SFhRU2o2dlFDSDNBVSJ9.eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJaeFlkNWg4SFhRU2o2dlFDSDNBVSJ9';


const mockAdminUserSession: Auth0SessionUser = {
  sub: 'admin-user-id',
  name: 'Admin User',
  email: 'admin@example.com',
  [ROLES_CLAIM]: [AppRole.ADMIN],
};

const mockUserSession: Auth0SessionUser = {
  sub: 'regular-user-id',
  name: 'Regular User',
  email: 'user@example.com',
  [ROLES_CLAIM]: [AppRole.USER],
};

const mockUserWithoutRolesSession: Auth0SessionUser = {
  sub: 'user-without-roles-id',
  name: 'User Without Roles',
  email: 'no-roles@example.com',
};

describe('auth0-utils', () => {
  describe('tryGetRolesClaimFromIdToken', () => {
    it('should return admin role as array for admin user token', () => {
      expect(tryGetRolesClaimFromIdToken(mockAdminToken)).toStrictEqual(["admin"]);
    });

    it('should return empty array if token input wasnt a string', () => {
      expect(tryGetRolesClaimFromIdToken(123)).toStrictEqual([]);
    })

  it('should return empty array if token input was in incorrect format', () => {
      expect(tryGetRolesClaimFromIdToken(mockInvalidToken)).toStrictEqual([]);
    })
  })


  describe('getRolesFromUser', () => {
    it.each([null, undefined])('should return an empty array for a %s user', (user) => {
      expect(getRolesFromUser(user)).toStrictEqual([]);
    });

    it('should return an empty array when the roles claim is missing', () => {
      expect(getRolesFromUser(mockUserWithoutRolesSession)).toStrictEqual([]);
    });

    it.each([
      { label: 'undefined', value: undefined },
      { label: 'null', value: null },
      { label: 'a string', value: AppRole.ADMIN },
      { label: 'a number', value: 123 },
      { label: 'a boolean', value: true },
      { label: 'an object', value: { role: AppRole.ADMIN } },
    ])('should return an empty array when the roles claim is $label', ({ value }) => {
      expect(getRolesFromUser({ [ROLES_CLAIM]: value })).toStrictEqual([]);
    });

    it('should return an empty array for an empty roles array', () => {
      expect(getRolesFromUser({ [ROLES_CLAIM]: [] })).toStrictEqual([]);
    });

    it('should preserve multiple string roles in their original order', () => {
      expect(getRolesFromUser({
        [ROLES_CLAIM]: [AppRole.ADMIN, AppRole.USER],
      })).toStrictEqual([AppRole.ADMIN, AppRole.USER]);
    });

    it('should filter non-string entries out of a mixed roles array', () => {
      const user = {
        [ROLES_CLAIM]: [AppRole.ADMIN, 123, null, undefined, true, {}, [AppRole.ADMIN], AppRole.USER],
      };

      expect(getRolesFromUser(user)).toStrictEqual([AppRole.ADMIN, AppRole.USER]);
    });

    it('should return an empty array when every role is a non-string', () => {
      expect(getRolesFromUser({
        [ROLES_CLAIM]: [123, null, undefined, false, {}, []],
      })).toStrictEqual([]);
    });

    it('should preserve string values without validating or normalizing them', () => {
      const roles = ['', ' ', 'ADMIN', 'unknown-role', AppRole.ADMIN, AppRole.ADMIN];

      expect(getRolesFromUser({ [ROLES_CLAIM]: roles })).toStrictEqual(roles);
    });

    it('should return a new array without modifying the original roles', () => {
      const roles = Object.freeze([AppRole.ADMIN, 123, AppRole.USER]);
      const result = getRolesFromUser({ [ROLES_CLAIM]: roles });

      expect(result).toStrictEqual([AppRole.ADMIN, AppRole.USER]);
      expect(result).not.toBe(roles);
      expect(roles).toStrictEqual([AppRole.ADMIN, 123, AppRole.USER]);
    });
  });

  describe('hasRole', () => {
    it('should return true when admin user and role ADMIN is provided', () => {
      expect(hasRole(mockAdminUserSession, AppRole.ADMIN)).toBeTruthy()
    })

    it('should return true when regular user and role USER is provided', () => {
      expect(hasRole(mockUserSession, AppRole.USER)).toBe(true);
    });

    it('should return false for a user without roles', () => {
      expect(hasRole(mockUserWithoutRolesSession, AppRole.USER)).toBe(false);
      expect(hasRole(mockUserWithoutRolesSession, AppRole.ADMIN)).toBe(false);
    });
  })

  
})

