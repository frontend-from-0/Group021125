
// Add this code to auth0 as a new action (Actions > Library), then set up post-login trigger and add the action to it.
// Make sure to use 'https://ecom-200825/roles' as ROLES_CLAIM in the src/lib/auth0.ts file.

exports.onExecutePostLogin = async (event, api) => {
  const namespace = 'https://ecom-021125';
  const roles = event.authorization?.roles || [];

  api.idToken.setCustomClaim(`${namespace}/roles`, roles);
  api.idToken.setCustomClaim(`${namespace}/is_admin`, roles.includes('admin'));
  
  api.accessToken.setCustomClaim(`${namespace}/roles`, roles);
  api.accessToken.setCustomClaim(`${namespace}/is_admin`, roles.includes('admin'));
};