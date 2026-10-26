import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: import.meta.env['VITE_KEYCLOAK_URL'] ?? 'http://localhost:8080',
  realm: 'longiplus',
  clientId: 'longiplus-web',
});

keycloak.onTokenExpired = () => {
  keycloak.updateToken(30).catch(() => {
    keycloak.logout();
  });
};

export async function initKeycloak(): Promise<boolean> {
  return keycloak.init({
    onLoad: 'check-sso',
    pkceMethod: 'S256',
    silentCheckSsoRedirectUri: `${window.location.origin}/silent-check-sso.html`,
    checkLoginIframe: false,
  });
}

export default keycloak;
