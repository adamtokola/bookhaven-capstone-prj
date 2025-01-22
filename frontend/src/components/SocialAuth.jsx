import { useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Typography,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Google as GoogleIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  GitHub as GitHubIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import OAuth2Service from '../services/OAuth2Service';

function SocialAuth({ onSuccess }) {
  const { socialLogin } = useAuth();
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');

  const handleSocialLogin = async (provider) => {
    setLoading(provider);
    setError('');

    try {
      // Get OAuth2 URL
      const authUrl = await OAuth2Service.initiateOAuth2Flow(provider.toLowerCase());
      
      // Open popup
      const popup = window.open(
        authUrl,
        'OAuth2 Login',
        'width=500,height=600'
      );

      const result = await new Promise((resolve, reject) => {
        window.addEventListener('message', async function(event) {
          if (event.origin !== window.location.origin) return;
          
          if (event.data.type === 'oauth2_callback') {
            try {
              const { code } = event.data;
              const tokens = await OAuth2Service.handleOAuth2Callback(
                provider.toLowerCase(),
                code
              );
              resolve(tokens);
            } catch (err) {
              reject(err);
            }
            popup.close();
          }
        }, false);

        // Check if popup was closed
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            reject(new Error('Login window was closed'));
          }
        }, 1000);
      });

      await socialLogin(result.accessToken, provider);
      onSuccess?.();
    } catch (err) {
      setError(`${provider} login failed: ${err.message}`);
    } finally {
      setLoading('');
    }
  };

  return (
    <Box>
      <Divider sx={{ my: 2 }}>
        <Typography variant="body2" color="text.secondary">
          OR CONTINUE WITH
        </Typography>
      </Divider>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
        <IconButton
          onClick={() => handleSocialLogin('Google')}
          disabled={Boolean(loading)}
          sx={{
            bgcolor: 'grey.100',
            '&:hover': {
              bgcolor: 'grey.200',
            },
          }}
        >
          {loading === 'Google' ? (
            <CircularProgress size={24} />
          ) : (
            <GoogleIcon sx={{ color: '#DB4437' }} />
          )}
        </IconButton>

        <IconButton
          onClick={() => handleSocialLogin('Facebook')}
          disabled={Boolean(loading)}
          sx={{
            bgcolor: 'grey.100',
            '&:hover': {
              bgcolor: 'grey.200',
            },
          }}
        >
          {loading === 'Facebook' ? (
            <CircularProgress size={24} />
          ) : (
            <FacebookIcon sx={{ color: '#4267B2' }} />
          )}
        </IconButton>

        <IconButton
          onClick={() => handleSocialLogin('Twitter')}
          disabled={Boolean(loading)}
          sx={{
            bgcolor: 'grey.100',
            '&:hover': {
              bgcolor: 'grey.200',
            },
          }}
        >
          {loading === 'Twitter' ? (
            <CircularProgress size={24} />
          ) : (
            <TwitterIcon sx={{ color: '#1DA1F2' }} />
          )}
        </IconButton>

        <IconButton
          onClick={() => handleSocialLogin('GitHub')}
          disabled={Boolean(loading)}
          sx={{
            bgcolor: 'grey.100',
            '&:hover': {
              bgcolor: 'grey.200',
            },
          }}
        >
          {loading === 'GitHub' ? (
            <CircularProgress size={24} />
          ) : (
            <GitHubIcon sx={{ color: '#333' }} />
          )}
        </IconButton>
      </Box>
    </Box>
  );
}

export default SocialAuth; 