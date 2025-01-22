class OAuth2Service {
  constructor() {
    this.baseUrl = 'http://localhost:5001/auth';
    this.providers = {
      google: {
        authUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
        scope: 'email profile',
        responseType: 'code',
        grantType: 'authorization_code',
      },
      facebook: {
        authUrl: 'https://www.facebook.com/v12.0/dialog/oauth',
        scope: 'email,public_profile',
        responseType: 'code',
        grantType: 'authorization_code',
      },
      twitter: {
        authUrl: 'https://twitter.com/i/oauth2/authorize',
        scope: 'users.read tweet.read',
        responseType: 'code',
        grantType: 'authorization_code',
        codeChallenge: true, // Uses PKCE
      },
      github: {
        authUrl: 'https://github.com/login/oauth/authorize',
        scope: 'read:user user:email',
        responseType: 'code',
        grantType: 'authorization_code',
      },
    };
  }

  async generateCodeVerifier() {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    return this.base64URLEncode(array);
  }

  async generateCodeChallenge(verifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(verifier);
    const hash = await window.crypto.subtle.digest('SHA-256', data);
    return this.base64URLEncode(new Uint8Array(hash));
  }

  base64URLEncode(buffer) {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }

  async initiateOAuth2Flow(provider) {
    const state = this.base64URLEncode(window.crypto.getRandomValues(new Uint8Array(32)));
    const nonce = this.base64URLEncode(window.crypto.getRandomValues(new Uint8Array(32)));
    
    let codeVerifier;
    let codeChallenge;

    if (this.providers[provider].codeChallenge) {
      codeVerifier = await this.generateCodeVerifier();
      codeChallenge = await this.generateCodeChallenge(codeVerifier);
    }

    // Store state and PKCE values
    sessionStorage.setItem('oauth2_state', state);
    if (codeVerifier) {
      sessionStorage.setItem('oauth2_code_verifier', codeVerifier);
    }
    sessionStorage.setItem('oauth2_nonce', nonce);

    const params = new URLSearchParams({
      client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
      redirect_uri: `${window.location.origin}/auth/callback`,
      response_type: this.providers[provider].responseType,
      scope: this.providers[provider].scope,
      state: state,
      nonce: nonce,
    });

    if (codeChallenge) {
      params.append('code_challenge', codeChallenge);
      params.append('code_challenge_method', 'S256');
    }

    return `${this.providers[provider].authUrl}?${params.toString()}`;
  }

  async handleOAuth2Callback(provider, code) {
    const storedState = sessionStorage.getItem('oauth2_state');
    const codeVerifier = sessionStorage.getItem('oauth2_code_verifier');
    const nonce = sessionStorage.getItem('oauth2_nonce');

    // Clear stored OAuth2 values
    sessionStorage.removeItem('oauth2_state');
    sessionStorage.removeItem('oauth2_code_verifier');
    sessionStorage.removeItem('oauth2_nonce');

    const params = new URLSearchParams({
      grant_type: this.providers[provider].grantType,
      code: code,
      redirect_uri: `${window.location.origin}/auth/callback`,
      client_id: process.env.REACT_APP_OAUTH_CLIENT_ID,
    });

    if (codeVerifier) {
      params.append('code_verifier', codeVerifier);
    }

    try {
      const response = await fetch(`${this.baseUrl}/token/${provider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params,
      });

      if (!response.ok) {
        throw new Error('Token exchange failed');
      }

      const data = await response.json();
      return {
        accessToken: data.access_token,
        idToken: data.id_token,
        expiresIn: data.expires_in,
        refreshToken: data.refresh_token,
      };
    } catch (error) {
      console.error('OAuth2 token exchange failed:', error);
      throw error;
    }
  }

  async refreshToken(refreshToken, provider) {
    try {
      const response = await fetch(`${this.baseUrl}/refresh/${provider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: refreshToken }),
      });

      if (!response.ok) {
        throw new Error('Token refresh failed');
      }

      const data = await response.json();
      return {
        accessToken: data.access_token,
        expiresIn: data.expires_in,
        refreshToken: data.refresh_token,
      };
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw error;
    }
  }

  async revokeToken(token, provider) {
    try {
      const response = await fetch(`${this.baseUrl}/revoke/${provider}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });

      if (!response.ok) {
        throw new Error('Token revocation failed');
      }
    } catch (error) {
      console.error('Token revocation failed:', error);
      throw error;
    }
  }
}

export default new OAuth2Service(); 