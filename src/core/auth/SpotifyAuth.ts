// src/core/auth/SpotifyAuth.ts

import * as Crypto from 'expo-crypto';
import * as WebBrowser from 'expo-web-browser';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

/**
 * Implementa OAuth 2.0 com PKCE (Proof Key for Code Exchange)
 * Para segurança em apps mobile
 */
export class SpotifyAuth {
  private clientId: string;
  private redirectUri: string;
  private scopes: string[];

  constructor(
    clientId: string,
    redirectUri: string,
    scopes: string[] = [
      'user-read-playback-state',
      'user-modify-playback-state',
      'user-read-currently-playing',
      'streaming',
      'user-library-read',
      'user-library-modify',
      'playlist-read-private',
      'playlist-modify-public',
      'playlist-modify-private',
    ],
  ) {
    this.clientId = clientId;
    this.redirectUri = redirectUri;
    this.scopes = scopes;
  }

  /**
   * Gerar PKCE challenge
   */
  private async generatePKCE(): Promise<{
    codeVerifier: string;
    codeChallenge: string;
  }> {
    // Code verifier: 43-128 caracteres
    const codeVerifier = await this.generateRandomString(128);

    // Code challenge: hash SHA256 do verifier
    const digest = await Crypto.digestStringAsync(
      Crypto.CryptoDigestAlgorithm.SHA256,
      codeVerifier,
    );

    // Converter para base64url
    const codeChallenge = Buffer.from(digest, 'hex')
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');

    return { codeVerifier, codeChallenge };
  }

  /**
   * Gerar string aleatória
   */
  private async generateRandomString(length: number): Promise<string> {
    const possible =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let text = '';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }

  /**
   * Iniciar fluxo de autenticação
   */
  async startAuth(): Promise<{
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
    userId: string;
  }> {
    try {
      // Gerar PKCE
      const { codeVerifier, codeChallenge } = await this.generatePKCE();

      // Salvar code_verifier para uso depois
      await SecureStore.setItemAsync('spotify_code_verifier', codeVerifier);

      // State para verificação
      const state = await this.generateRandomString(32);
      await AsyncStorage.setItem('spotify_auth_state', state);

      // Construir authorization URL
      const authUrl = new URL('https://accounts.spotify.com/authorize');
      authUrl.searchParams.set('client_id', this.clientId);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('redirect_uri', this.redirectUri);
      authUrl.searchParams.set('scope', this.scopes.join(' '));
      authUrl.searchParams.set('state', state);
      authUrl.searchParams.set('code_challenge_method', 'S256');
      authUrl.searchParams.set('code_challenge', codeChallenge);

      // Abrir navegador
      const result = await WebBrowser.openAuthSessionAsync(
        authUrl.toString(),
        this.redirectUri,
      );

      if (result.type !== 'success') {
        throw new Error('Authentication cancelled');
      }

      // Extrair código da URL
      const url = new URL(result.url);
      const code = url.searchParams.get('code');
      const returnedState = url.searchParams.get('state');

      if (!code) {
        throw new Error('No authorization code received');
      }

      // Verificar state
      const savedState = await AsyncStorage.getItem('spotify_auth_state');
      if (returnedState !== savedState) {
        throw new Error('State mismatch - possible CSRF attack');
      }

      // Trocar código por token
      const tokens = await this.exchangeCodeForToken(code, codeVerifier);

      // Obter informações do usuário
      const userId = await this.getUserId(tokens.accessToken);

      return {
        ...tokens,
        userId,
      };
    } catch (error) {
      console.error('Auth error:', error);
      throw error;
    } finally {
      // Cleanup
      await SecureStore.deleteItemAsync('spotify_code_verifier');
      await AsyncStorage.removeItem('spotify_auth_state');
    }
  }

  /**
   * Trocar authorization code por tokens
   */
  private async exchangeCodeForToken(
    code: string,
    codeVerifier: string,
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    try {
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: this.redirectUri,
          client_id: this.clientId,
          code_verifier: codeVerifier,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return {
        accessToken: response.data.access_token,
        refreshToken: response.data.refresh_token,
        expiresIn: response.data.expires_in,
      };
    } catch (error) {
      console.error('Token exchange failed:', error);
      throw new Error('Failed to exchange code for token');
    }
  }

  /**
   * Obter ID do usuário
   */
  private async getUserId(accessToken: string): Promise<string> {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      return response.data.id;
    } catch (error) {
      console.error('Failed to get user info:', error);
      throw new Error('Failed to get user information');
    }
  }

  /**
   * Refrescar token de acesso
   */
  async refreshToken(refreshToken: string): Promise<{
    accessToken: string;
    expiresIn: number;
  }> {
    try {
      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
          client_id: this.clientId,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      );

      return {
        accessToken: response.data.access_token,
        expiresIn: response.data.expires_in,
      };
    } catch (error) {
      console.error('Token refresh failed:', error);
      throw new Error('Failed to refresh token');
    }
  }
}
